# app/controllers/api/v1/fundraisers/transfers_controller.rb
module Api
  module V1
    module Fundraisers
      class TransfersController < ApplicationController
        include ErrorHandler
        before_action :authenticate_request,
                      only: %i[fetch_user_transfers fetch_transfers_from_paystack initialize_transfer]
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

        # In app/controllers/api/v1/fundraisers/transfers_controller.rb
        def resolve_account_details
          response = @paystack_service.resolve_account_details(
            account_number: params[:account_number],
            bank_code: params[:bank_code]
          )
          
          if response[:status]
            render json: response, status: :ok
          else
            error_message = response[:message]
            
            # Safe way to extract meta info
            meta_info = if response[:body].is_a?(Hash)
                          response[:body][:meta]&.dig(:nextStep) || 
                          response[:body]['meta']&.dig('nextStep') || 
                          'Please double-check the details and try again.'
                        else
                          'Please double-check the details and try again.'
                        end
            
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

        # Create a transfer recipient
        def create_transfer_recipient
          @fundraiser = User.find(params[:fundraiser_id])
          campaign = Campaign.find(params[:campaign_id])

          # Fetch the full subaccount based on subaccount_id in the user's table
          subaccount = Subaccount.find_by(subaccount_code: @fundraiser.subaccount_id)

          unless subaccount
            render json: { error: 'No subaccount found for the fundraiser' }, status: :unprocessable_entity
            return
          end

          # Always use the current subaccount details to create recipient
          metadata = subaccount.metadata || {}
          custom_fields = metadata['custom_fields'] || []

          bank_code_value = custom_fields.find { |f| f['type'] == 'ghipss' }&.dig('value') ||
                            custom_fields.find { |f| f['type'] == 'mobile_money' }&.dig('value') ||
                            subaccount.bank_code

          if bank_code_value.blank?
            render json: { error: 'No valid bank code or mobile money details provided' }, status: :unprocessable_entity
            return
          end

          # Always create a new recipient code to ensure it matches current subaccount details
          # This handles cases where subaccount was updated but recipient code wasn't
          recipient_type = subaccount.subaccount_type || 'nuban'

          # Merge existing metadata with new fields
          recipient_metadata = {
            user_id: @fundraiser.id,
            campaign_id: campaign.id,
            email: @fundraiser.email,
            user_name: @fundraiser.full_name,
            subaccount_code: subaccount.subaccount_code,
            metadata: metadata
          }

          response = @paystack_service.create_transfer_recipient(
            type: recipient_type,
            name: subaccount.business_name,
            account_number: subaccount.account_number,
            bank_code: bank_code_value,
            currency: campaign.currency.upcase,
            description: "Transfer recipient for #{campaign.title}",
            metadata: recipient_metadata
          )

          if response[:status] == true
            # Update subaccount with new recipient code
            subaccount.update!(
              recipient_code: response.dig(:data, :recipient_code), 
              campaign_id: campaign.id
            )
            render json: { 
              message: 'Recipient created successfully.', 
              recipient_code: response.dig(:data, :recipient_code), 
              campaign_id: campaign.id,
              account_number: subaccount.account_number,
              bank_name: custom_fields.first&.dig('display_name')
            }, status: :ok
          else
            render json: { error: 'Failed to create recipient: Provide valid data' }, status: :unprocessable_entity
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

          # Call the Paystack service to update the recipient
          response = @paystack_service.update_transfer_recipient(recipient_code, **update_params.symbolize_keys)

          if response[:status]
            # Update the local database with the new recipient details if needed
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

        # Fetch customer balance from your database or system
        def get_customer_balance(customer_id)
          # Fetch customer record and return balance
          Campaign.find(customer_id).current_amount
        rescue ActiveRecord::RecordNotFound
          puts "Customer with ID #{customer_id} not found."
          nil
        end

        # Update the customer's balance in the database
        def update_customer_balance(customer_id, new_balance)
          campaign = Campaign.find(customer_id)
          if campaign
            campaign.update(current_amount: new_balance)
          else
            puts "Failed to update balance: Customer with ID #{customer_id} not found."
          end
        end

        # Reset the customer's balance to zero after a successful transfer
        def reset_customer_balance(customer_id)
          update_customer_balance(customer_id, 0)
        end

        # Handle the process of transferring funds and resetting the balance
        def process_transfer(campaign_id, subaccount, recipient_account, campaign_title, currency)
          customer_balance = get_customer_balance(campaign_id)

          if customer_balance.nil? || customer_balance <= 0
            render json: { error: 'Insufficient funds for transfer.' }, status: :unprocessable_entity
            return
          end

          transfer_response = @paystack_service.initiate_transfer(
            amount: customer_balance.round, # Convert to kobo
            recipient: recipient_account,
            reason: "Payout for campaign: #{campaign_title}",
            currency: currency
          )

          Rails.logger.info "Transfer response: #{transfer_response.inspect}"

          if transfer_response[:status]
            transfer_data = transfer_response[:data]
            
            # Create transfer record with current subaccount details
            Transfer.create!(
              transfer_code: transfer_data[:transfer_code],
              user_id: subaccount.user_id,
              campaign_id: campaign_id,
              bank_name: subaccount.metadata&.dig('custom_fields')&.first&.dig('display_name') || 'N/A',
              account_number: subaccount.account_number,
              amount: customer_balance,
              currency: currency,
              status: transfer_data[:status],
              reason: "Payout for campaign: #{campaign_title}",
              recipient_code: recipient_account,
              reference: transfer_data[:reference]
            )

            update_customer_balance(campaign_id, 0) # Reset current_amount

            render json: {
              transfer_code: transfer_data[:transfer_code],
              reference: transfer_data[:reference],
              message: 'Transfer initiated successfully.',
              account_number: subaccount.account_number,
              bank_name: subaccount.metadata&.dig('custom_fields')&.first&.dig('display_name')
            }, status: :ok
          else
            # Parse the body to get the specific message about insufficient balance
            body = begin
              JSON.parse(transfer_response[:body])
            rescue StandardError
              {}
            end
            specific_message = body['message'] || 'An error occurred'
            Rails.logger.info "Transfer failed: #{specific_message}"
            render json: { error: 'Sorry, this is an issue on our side. Please wait for a while.' },
                   status: :unprocessable_entity
          end
        rescue StandardError => e
          Rails.logger.error "Error processing transfer: #{e.message}"
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Initialize a transfer
        def initialize_transfer
          raise 'Campaign ID is missing' unless params[:campaign_id]

          @campaign = Campaign.find(params[:campaign_id])

          # Check if transfers are locked for this user - use outgoing direction
          unless @current_user.can_make_transfers? && @campaign.can_transfer_funds?(:outgoing)
            render json: { 
              error: 'Transfers are currently locked for your account. Please contact support.',
              code: 'TRANSFERS_LOCKED',
              lock_info: @current_user.transfer_lock_info
            }, status: :forbidden
            return
          end

          unless @campaign.fundraiser_id == @current_user.id
            render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
          end

          @fundraiser = @campaign.fundraiser
          subaccount = Subaccount.find_by(subaccount_code: @fundraiser.subaccount_id)
          
          raise 'You do not have a bank account added.' unless subaccount
          raise 'Account number not found for this fundraiser' unless subaccount.account_number.present?

          total_donations = @campaign.current_amount
          raise 'You have no funds available for payout.' if total_donations <= 0.0

          balance_response = @paystack_service.check_balance

          unless balance_response[:status]
            render json: { error: 'Unable to perform transaction at this time. Please try again later.' },
                   status: :unprocessable_entity
            return
          end

          currency = @campaign.currency.upcase
          available_balance = balance_response[:data].find { |b| b[:currency] == currency }&.dig(:balance).to_f

          if available_balance < total_donations
            render json: { error: 'Insufficient balance on our side. Kindly try again later.' },
                   status: :unprocessable_entity
            return
          end

          # Use the current recipient code or create a new one
          recipient_code = subaccount.recipient_code
          if recipient_code.blank?
            # Create recipient on the fly using current subaccount details
            recipient_response = create_transfer_recipient_for_transfer(subaccount, @campaign)
            if recipient_response[:error]
              render json: { error: recipient_response[:error] }, status: :unprocessable_entity
              return
            end
            recipient_code = recipient_response[:recipient_code]
          end

          process_transfer(@campaign.id, subaccount, recipient_code, @campaign.title, currency)
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

        # Fetch settlements details for user
        def fetch_settlement_status
          @fundraiser = User.find(params[:fundraiser_id])

          raise ActiveRecord::RecordNotFound, 'Fundraiser not found' unless @fundraiser

          subaccount = Subaccount.find_by(subaccount_code: @fundraiser.subaccount_id)
          raise ActiveRecord::RecordNotFound, 'Subaccount not found for this fundraiser' unless subaccount

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

        # Fetch transfers for the logged-in user
        def fetch_user_transfers
          @fundraiser = @current_user

          # Define pagination parameters
          page = params[:page] || 1
          page_size = params[:page_size] || 8

          # Query the database for transfers belonging to the current user with pagination and order by created_at
          @transfers = @fundraiser.transfers.includes(:campaign).order(created_at: :desc).page(page).per(page_size)

          # Check if transfers are present
          if @transfers.any?
            render json: {
              transfers: @transfers.as_json(include: :campaign),
              current_page: @transfers.current_page,
              total_pages: @transfers.total_pages,
              total_count: @transfers.total_count
            }, status: :ok
          else
            render json: { error: 'No transfers found for this user' }, status: :not_found
          end
        end

        # Fetch transfers from Paystack for the logged-in user
        def fetch_transfers_from_paystack
          @fundraiser = @current_user
          subaccounts = Subaccount.where(subaccount_code: @fundraiser.subaccount_id)

          # Fetch transfers for each subaccount
          subaccounts.each do |subaccount|
            response = @paystack_service.fetch_transfer(subaccount.transfer_code)

            # Check if response is successful
            if response[:status] && response[:data].present?
              # If data is an array (multiple transfers)
              if response[:data].is_a?(Array)
                response[:data].each do |transfer_data|
                  # Find or initialize the transfer record
                  transfer_record = Transfer.find_by(transfer_code: transfer_data[:transfer_code])

                  # Only create a new record if it doesn't exist
                  next if transfer_record

                  Transfer.create(
                    transfer_code: transfer_data[:transfer_code],
                    user_id: subaccount.user_id,            # Associate with the logged-in user
                    campaign_id: subaccount.campaign_id,    # Associate with the campaign
                    bank_name: transfer_data[:recipient][:details][:bank_name],
                    account_number: transfer_data[:recipient][:details][:account_number],
                    amount: transfer_data[:amount] / 100.0, # Convert amount to naira
                    currency: transfer_data[:currency],
                    status: transfer_data[:status],
                    reason: transfer_data[:reason],
                    recipient_code: transfer_data[:recipient][:recipient_code],
                    reference: transfer_data[:reference],
                    created_at: transfer_data[:createdAt]
                  )
                  Rails.logger.info "Transfer with code #{transfer_data[:transfer_code]} created successfully"
                end
              # If data is a single transfer object (hash)
              elsif response[:data].is_a?(Hash)
                transfer_data = response[:data]

                # Find or initialize the transfer record
                transfer_record = Transfer.find_by(transfer_code: transfer_data[:transfer_code])

                # Only create a new record if it doesn't exist
                unless transfer_record
                  Transfer.create(
                    transfer_code: transfer_data[:transfer_code],
                    user_id: subaccount.user_id,            # Associate with the logged-in user
                    campaign_id: subaccount.campaign_id,    # Associate with the campaign
                    bank_name: transfer_data[:recipient][:details][:bank_name],
                    account_number: transfer_data[:recipient][:details][:account_number],
                    amount: transfer_data[:amount] / 100.0, # Convert amount to naira
                    currency: transfer_data[:currency],
                    status: transfer_data[:status],
                    reason: transfer_data[:reason],
                    recipient_code: transfer_data[:recipient][:recipient_code],
                    reference: transfer_data[:reference],
                    created_at: transfer_data[:createdAt]
                  )
                  Rails.logger.info "Transfer with code #{transfer_data[:transfer_code]} created successfully"
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

          render json: { message: 'Transfers fetched and saved successfully' }, status: :ok
        end

        private

        def create_transfer_recipient_for_transfer(subaccount, campaign)
          metadata = subaccount.metadata || {}
          custom_fields = metadata['custom_fields'] || []

          bank_code_value = custom_fields.find { |f| f['type'] == 'ghipss' }&.dig('value') ||
                            custom_fields.find { |f| f['type'] == 'mobile_money' }&.dig('value') ||
                            subaccount.bank_code

          return { error: 'No valid bank code provided' } if bank_code_value.blank?

          recipient_type = subaccount.subaccount_type || 'nuban'

          recipient_metadata = {
            user_id: subaccount.user_id,
            campaign_id: campaign.id,
            email: subaccount.user.email,
            user_name: subaccount.user.full_name,
            subaccount_code: subaccount.subaccount_code,
            metadata: metadata
          }

          response = @paystack_service.create_transfer_recipient(
            type: recipient_type,
            name: subaccount.business_name,
            account_number: subaccount.account_number,
            bank_code: bank_code_value,
            currency: campaign.currency.upcase,
            description: "Transfer recipient for #{campaign.title}",
            metadata: recipient_metadata
          )

          if response[:status] == true
            subaccount.update!(recipient_code: response.dig(:data, :recipient_code))
            { recipient_code: response.dig(:data, :recipient_code) }
          else
            { error: "Failed to create recipient: #{response[:message]}" }
          end
        end

        def filter_bank_params
          params.permit(:country, :use_cursor, :per_page, :next, :previous).except(:format)
        end

        def process_transfer_approval(transfer_details)
          # Add your logic to decide whether to approve or reject the transfer.
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
          # For transfers, we need to verify that the fundraiser has completed KYC as an issuer or investor or both
          unless @current_user.verified_issuer? || @current_user.verified_both? || @current_user.verified_investor?
            render json: { 
              success: false, 
              error: 'You must complete user verification before initiating transfers',
              code: 'KYC_VERIFICATION_REQUIRED',
              kyc_status: @current_user.kyc_status_info
            }, status: :forbidden
            return false
          end

          # Additional check: ensure KYC is not expired
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
end