module Api
  module V1
    class ClubTransfersController < ApplicationController
      include ErrorHandler
      before_action :authenticate_request,
                    only: %i[fetch_club_transfers fetch_transfers_from_paystack initialize_transfer]
      before_action :set_club
      before_action :verify_admin_access, only: %i[initialize_transfer]
      before_action :verify_kyc_requirements, only: %i[initialize_transfer]
      before_action :set_transfer_service

      # Approve or reject a transfer based on the payload
      def approve_transfer
        payload = request.body.read
        signature = request.headers['X-Paystack-Signature']

        if @paystack_service.verify_paystack_signature(payload, signature)
          begin
            transfer_details = JSON.parse(payload, symbolize_names: true)
            decision = process_transfer_approval(transfer_details)
            if decision[:approve]
              render json: { message: 'Transfer approved' }, status: :ok
            else
              render json: { message: 'Transfer rejected', reason: decision[:reason] }, status: :bad_request
            end
          rescue JSON::ParserError => e
            Rails.logger.error "Invalid JSON payload: #{e.message}"
            render json: { error: 'Invalid JSON payload' }, status: :unprocessable_entity
          end
        else
          Rails.logger.error 'Invalid Paystack signature'
          render json: { error: 'Invalid signature' }, status: :forbidden
        end
      end

      def resolve_account_details
        response = @paystack_service.resolve_account_details(
          account_number: params[:account_number],
          bank_code: params[:bank_code]
        )
        if response[:status]
          render json: response, status: :ok
        else
          error_message = response[:message]
          meta_info = response.dig(:body, :meta, :nextStep) || 'Please double-check the details and try again.'
          render json: {
            error: "Account resolution failed: #{error_message}. #{meta_info}"
          }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "Failed to resolve account details: #{e.message}"
        render json: {
          error: 'An unexpected error occurred while resolving the account details. Please try again later or contact support.'
        }, status: :unprocessable_entity
      end

      # Fetch list of supported countries
      def get_supported_countries
        response = @paystack_service.get_supported_countries
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Fetch list of banks
      def get_bank_list
        response = @paystack_service.get_bank_list(**filter_bank_params.to_h.symbolize_keys)
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Create a transfer recipient for club
      def create_transfer_recipient
        # Use the club admin/creator's subaccount and email
        admin_membership = @club.investment_club_memberships.admin.first
        unless admin_membership
          render json: { error: 'No admin found for this club' }, status: :unprocessable_entity
          return
        end

        admin_user = admin_membership.user
        
        # Fetch the full subaccount based on subaccount_id in the admin's table
        subaccount = Subaccount.find_by(subaccount_code: admin_user.subaccount_id)

        unless subaccount
          render json: { error: 'No subaccount found for the club admin' }, status: :unprocessable_entity
          return
        end

          metadata       = subaccount.metadata
          custom_fields  = metadata['custom_fields']

          if custom_fields.blank?
            render json: { error: 'No custom fields provided for this subaccount' }, status: :unprocessable_entity
            return
          end

          bank_code_value = custom_fields.find { |f| f['type'] == 'ghipss' }&.dig('value') ||
                            custom_fields.find { |f| f['type'] == 'mobile_money' }&.dig('value')

        if bank_code_value.blank?
          render json: { error: 'No valid bank code or mobile money details provided' }, status: :unprocessable_entity
          return
        end

        # If no recipient_code exists, proceed to create one
        if subaccount.recipient_code.blank?
          # ALIGNED WITH FUNDRAISER: Use the same metadata structure
          recipient_metadata = {
            user_id: admin_user.id,
            club_id: @club.id,
            email: admin_user.email,
            user_name: admin_user.full_name,
            metadata: metadata
          }

          response = @paystack_service.create_transfer_recipient(
            type: bank_code_value,
            name: subaccount.business_name,
            account_number: subaccount.account_number,
            bank_code: bank_code_value,
            currency: @club.currency.upcase,
            description: "Transfer recipient for #{@club.name} club payouts",
            metadata: recipient_metadata  # This metadata will be in the webhook
          )

          if response[:status] == true
            subaccount.update!(recipient_code: response.dig(:data, :recipient_code))
            render json: { 
              message: 'Recipient created successfully.', 
              recipient_code: response.dig(:data, :recipient_code),
              club_id: @club.id 
            }, status: :ok
          else
            # ALIGNED: Better error handling
            render json: { 
              error: "Failed to create recipient: #{response[:message] || 'Unknown error'}" 
            }, status: :unprocessable_entity
          end
        else
          # If recipient_code already exists, return it
          render json: { 
            recipient_code: subaccount.recipient_code, 
            message: 'Recipient code already exists.' 
          }, status: :ok
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: "Failed to save recipient code: #{e.message}" }, status: :internal_server_error
      rescue StandardError => e
        Rails.logger.error "Error creating transfer recipient: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Update a transfer recipient
      def update_transfer_recipient
        recipient_code = params[:recipient_code]
        update_params = transfer_recipient_params

        response = @paystack_service.update_transfer_recipient(recipient_code, **update_params.symbolize_keys)

        if response[:status]
          subaccount = Subaccount.find_by(recipient_code: recipient_code)
          if subaccount
            subaccount.update!(
              business_name: update_params[:name]
            )
          end

          render json: {
            message: 'Transfer recipient updated successfully',
            data: response[:data]
          }, status: :ok
        else
          render json: {
            error: response[:message] || 'Failed to update transfer recipient'
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      rescue StandardError => e
        Rails.logger.error "Error updating transfer recipient: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Handle the process of transferring funds and updating club balance
      def process_transfer(subaccount, recipient_account, currency, transfer_amount)
        # Use the specific transfer_amount instead of club_balance
        if transfer_amount <= 0
          render json: { error: 'Invalid transfer amount.' }, status: :unprocessable_entity
          return
        end

        transfer_response = @paystack_service.initiate_transfer(
          amount: transfer_amount.round,  # Use the specific amount
          recipient: recipient_account,
          reason: "Payout for #{@club.name} investment club",
          currency: currency
        )

        Rails.logger.info "Transfer response: #{transfer_response.inspect}"

        if transfer_response[:status]
          transfer_data = transfer_response[:data]
          
          # ALIGNED WITH FUNDRAISER: Create club transfer record with proper associations
          club_transfer = ClubTransfer.create!(
            investment_club: @club,
            user: @current_user,
            amount: transfer_amount,  # Store the actual transferred amount
            currency: currency,
            status: 'pending',
            reason: "Payout for #{@club.name} investment club",
            recipient_code: recipient_account,
            reference: transfer_data[:reference],
            transfer_code: transfer_data[:transfer_code]
          )

          # DEDUCT THE TRANSFER AMOUNT FROM CLUB FUNDS
          @club.deduct_transfer_amount(transfer_amount)

          render json: {
            transfer_code: transfer_data[:transfer_code],
            reference: transfer_data[:reference],
            message: 'Transfer initiated successfully.',
            club_balance: @club.reload.current_balance,
            transferred_amount: transfer_amount
          }, status: :ok
        else
          # ALIGNED: Better error parsing
          body = begin
            JSON.parse(transfer_response[:body])
          rescue StandardError
            {}
          end
          specific_message = body['message'] || transfer_response[:message] || 'An error occurred'
          meta_info = body.dig('meta', 'nextStep') || ''
          
          Rails.logger.error "Transfer failed: #{specific_message} - #{meta_info}"
          
          render json: { 
            error: "Transfer failed: #{specific_message}. #{meta_info}" 
          }, status: :unprocessable_entity
        end
      rescue StandardError => e
        Rails.logger.error "Error processing transfer: #{e.message}"
        render json: { error: "Transfer processing error: #{e.message}" }, status: :unprocessable_entity
      end

      # Initialize a transfer for club
      def initialize_transfer
        # Check if transfers are locked for the admin user
        unless @current_user.can_make_transfers?
          render json: { 
            error: 'Transfers are currently locked for your account. Please contact support.',
            code: 'TRANSFERS_LOCKED',
            lock_info: @current_user.transfer_lock_info
          }, status: :forbidden
          return
        end

        # Get admin membership to use their subaccount
        admin_membership = @club.investment_club_memberships.admin.first
        unless admin_membership
          render json: { error: 'No admin found for this club' }, status: :forbidden
          return
        end

        admin_user = admin_membership.user
        subaccount = Subaccount.find_by(subaccount_code: admin_user.subaccount_id)
        subaccount.reload if subaccount.present?
        recipient_code = params[:recipient_code]

        raise 'Club admin does not have an account number added.' unless subaccount
        raise 'Recipient code not found for this club' unless recipient_code.present?

        club_balance = @club.current_balance
        raise 'Club has no funds available for payout.' if club_balance <= 0.0

        # ALIGNED: Add recipient verification before transfer
        recipient_response = @paystack_service.fetch_transfer_recipient(recipient_code)
        unless recipient_response[:status]
          render json: { 
            error: "Invalid recipient: #{recipient_response[:message] || 'Recipient not found'}" 
          }, status: :unprocessable_entity
          return
        end

        balance_response = @paystack_service.check_balance

        unless balance_response[:status]
          render json: { error: 'Unable to perform transaction at this time. Please try again later.' },
                status: :unprocessable_entity
          return
        end

        # ADD: Get the specific transfer amount from params
        transfer_amount = params[:transfer_amount]&.to_f || club_balance
        
        # Validate the specific transfer amount
        if transfer_amount <= 0 || transfer_amount > club_balance
          render json: { error: "Invalid transfer amount. Must be between 0.01 and #{club_balance}" }, 
                status: :unprocessable_entity
          return
        end

        currency = @club.currency.upcase
        available_balance = balance_response[:data].find { |b| b[:currency] == currency }&.dig(:balance).to_f

        # ALIGNED: Check against transfer_amount, not club_balance
        if available_balance < transfer_amount
          render json: { error: 'Insufficient balance on our side. Kindly try again later.' },
                status: :unprocessable_entity
          return
        end

        process_transfer(subaccount, recipient_code, currency, transfer_amount)
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      rescue StandardError => e
        Rails.logger.error "Error initializing transfer: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Bulk create transfer recipients
      def bulk_create_transfer_recipients
        response = @paystack_service.bulk_create_transfer_recipients(
          recipients: params[:recipients]
        )
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # List transfer recipients
      def list_transfer_recipients
        response = @paystack_service.list_transfer_recipients(
          page: params[:page] || 1,
          per_page: params[:per_page] || 50
        )
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Fetch transfer recipient details
      def fetch_transfer_recipient
        response = @paystack_service.fetch_transfer_recipient(params[:recipient_code])
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :not_found
      end

      # Finalize a transfer
      def finalize_transfer
        response = @paystack_service.finalize_transfer(
          transfer_code: params[:transfer_code],
          otp: params[:otp]
        )
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Initiate a bulk transfer
      def initiate_bulk_transfer
        response = @paystack_service.initiate_bulk_transfer(
          transfers: params[:transfers]
        )
        render json: response, status: :ok
      rescue StandardError => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Fetch settlements details for club
      def fetch_settlement_status
        admin_membership = @club.investment_club_memberships.admin.first
        unless admin_membership
          render json: { error: 'No admin found for this club' }, status: :not_found
          return
        end

        admin_user = admin_membership.user
        subaccount = Subaccount.find_by(subaccount_code: admin_user.subaccount_id)
        unless subaccount
          render json: { error: 'Subaccount not found for club admin' }, status: :not_found
          return
        end

        response = @paystack_service.fetch_settlements(
          subaccount: subaccount.subaccount_code
        )

        if response[:status]
          render json: {
            status: 'success',
            data: response[:data],
            message: 'Settlement details retrieved successfully'
          }, status: :ok
        else
          render json: {
            status: 'error',
            message: response[:message]
          }, status: :unprocessable_entity
        end
      rescue ActiveRecord::RecordNotFound => e
        render json: { error: e.message }, status: :not_found
      rescue StandardError => e
        Rails.logger.error "Error fetching settlement status: #{e.message}"
        render json: { error: e.message }, status: :unprocessable_entity
      end

      # Fetch transfers for the club
      def fetch_club_transfers
        page = params[:page] || 1
        page_size = params[:pageSize] || 8

        @transfers = @club.club_transfers.includes(:user).order(created_at: :desc).page(page).per(page_size)

        if @transfers.any?
          render json: {
            transfers: @transfers.as_json(include: :user),
            current_page: @transfers.current_page,
            total_pages: @transfers.total_pages,
            total_count: @transfers.total_count
          }, status: :ok
        else
          render json: { error: 'No transfers found for this club' }, status: :not_found
        end
      end

      # Fetch transfers from Paystack for the club
      def fetch_transfers_from_paystack
        admin_membership = @club.investment_club_memberships.admin.first
        unless admin_membership
          render json: { error: 'No admin found for this club' }, status: :not_found
          return
        end

        admin_user = admin_membership.user
        subaccounts = Subaccount.where(subaccount_code: admin_user.subaccount_id)

        subaccounts.each do |subaccount|
          response = @paystack_service.fetch_transfer(subaccount.transfer_code)

          if response[:status] && response[:data].present?
            if response[:data].is_a?(Array)
              response[:data].each do |transfer_data|
                transfer_record = ClubTransfer.find_by(transfer_code: transfer_data[:transfer_code])
                next if transfer_record

                ClubTransfer.create(
                  transfer_code: transfer_data[:transfer_code],
                  investment_club_id: @club.id,
                  user_id: admin_user.id,
                  bank_name: transfer_data[:recipient][:details][:bank_name],
                  account_number: transfer_data[:recipient][:details][:account_number],
                  amount: transfer_data[:amount] / 100.0,
                  currency: transfer_data[:currency],
                  status: transfer_data[:status],
                  reason: transfer_data[:reason],
                  recipient_code: transfer_data[:recipient][:recipient_code],
                  reference: transfer_data[:reference],
                  created_at: transfer_data[:createdAt]
                )
                Rails.logger.info "Club transfer with code #{transfer_data[:transfer_code]} created successfully"
              end
            elsif response[:data].is_a?(Hash)
              transfer_data = response[:data]
              transfer_record = ClubTransfer.find_by(transfer_code: transfer_data[:transfer_code])

              unless transfer_record
                ClubTransfer.create(
                  transfer_code: transfer_data[:transfer_code],
                  investment_club_id: @club.id,
                  user_id: admin_user.id,
                  bank_name: transfer_data[:recipient][:details][:bank_name],
                  account_number: transfer_data[:recipient][:details][:account_number],
                  amount: transfer_data[:amount] / 100.0,
                  currency: transfer_data[:currency],
                  status: transfer_data[:status],
                  reason: transfer_data[:reason],
                  recipient_code: transfer_data[:recipient][:recipient_code],
                  reference: transfer_data[:reference],
                  created_at: transfer_data[:createdAt]
                )
                Rails.logger.info "Club transfer with code #{transfer_data[:transfer_code]} created successfully"
              end
            else
              Rails.logger.error "Expected an array or hash but got: #{response[:data].inspect}"
              render json: { error: 'Unexpected response format' }, status: :unprocessable_entity
              return
            end
          else
            Rails.logger.error "No transfers found or an error occurred. Response: #{response.inspect}"
            render json: { error: 'No transfers found or an error occurred' }, status: :unprocessable_entity
            return
          end
        end

        render json: { message: 'Club transfers fetched and saved successfully' }, status: :ok
      end

      private

      def set_club
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        render json: { error: 'Club not found' }, status: :not_found unless @club
      end

      def verify_admin_access
        unless @club.is_admin?(@current_user)
          render json: { error: 'Admin access required for transfer operations' }, status: :forbidden
        end
      end

      def filter_bank_params
        params.permit(:country, :use_cursor, :per_page, :next, :previous).except(:format)
      end

      def process_transfer_approval(transfer_details)
        if transfer_details[:amount] > 1_000_000
          { approve: false, reason: 'Amount exceeds approval limit' }
        else
          { approve: true }
        end
      end

      def set_transfer_service
        @paystack_service = PaystackService.new
      end

      def transfer_recipient_params
        params.require(:transfer_recipient).permit(
          :type, :name, :account_number, :bank_code, :currency,
          :authorization_code, :description, :metadata
        )
      end

      def transfer_params
        params.require(:transfer).permit(:amount, :recipient, :reason, :currency)
      end

      def verify_kyc_requirements
        unless @current_user.verified_issuer? || @current_user.verified_both? || @current_user.verified_investor?
          render json: { 
            success: false, 
            error: 'You must complete user verification before initiating transfers',
            code: 'KYC_VERIFICATION_REQUIRED',
            kyc_status: @current_user.kyc_status_info
          }, status: :forbidden
          return false
        end

        if @current_user.latest_kyc&.expired?
          render json: { 
            success: false, 
            error: 'Your KYC verification has expired. Please renew your verification before initiating transfers.',
            code: 'KYC_EXPIRED'
          }, status: :forbidden
          return false
        end

        true
      end
    end
  end
end