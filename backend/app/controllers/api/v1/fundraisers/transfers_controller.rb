module Api
  module V1
    module Fundraisers
      class TransfersController < ApplicationController
        include ErrorHandler
        before_action :authenticate_request, only: %i[fetch_user_transfers]
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
            Rails.logger.error "Invalid Paystack signature"
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
            meta_info = response.dig(:body, :meta, :nextStep) || "Please double-check the details and try again."
            render json: { 
              error: "Account resolution failed: #{error_message}. #{meta_info}" 
            }, status: :unprocessable_entity
          end
        rescue StandardError => e
          Rails.logger.error "Failed to resolve account details: #{e.message}"
          render json: { 
            error: "An unexpected error occurred while resolving the account details. Please try again later or contact support."
          }, status: :unprocessable_entity
        end        

        # Fetch list of supported countries
        def get_supported_countries
          response = @paystack_service.get_supported_countries
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Fetch list of banks
        def get_bank_list
          response = @paystack_service.get_bank_list(**filter_bank_params.to_h.symbolize_keys)
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end             

        # Create a transfer recipient
        def create_transfer_recipient
          @fundraiser = User.find(params[:fundraiser_id])
          subaccount = @fundraiser.subaccount.first
          campaign = Campaign.find(params[:campaign_id])

          raise "Fundraiser does not have a subaccount configured." unless subaccount

          # Check if a recipient code already exists
          if subaccount.recipient_code.present?
            render json: { recipient_code: subaccount.recipient_code, message: "Recipient code already exists." }, status: :ok
            return
          end

          response = @paystack_service.create_transfer_recipient(
            type: subaccount.subaccount_type,
            name: subaccount.business_name,
            account_number: subaccount.account_number,
            bank_code: subaccount.settlement_bank,
            currency: "GHS",
            description: "Transfer recipient for campaign payouts",
            metadata: { user_id: @fundraiser.id, campaign_id: campaign.id }
          )

          if response[:status]
            subaccount.update!(recipient_code: response.dig(:data, :recipient_code))
            render json: { message: "Recipient created successfully.", recipient_code: response.dig(:data, :recipient_code), campaign_id: campaign_id  }, status: :ok
          else
            render json: { error: "Provide a valid data" }, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: "Failed to save recipient code: #{e.message}" }, status: :internal_server_error
        rescue => e
          Rails.logger.error "Error creating transfer recipient: #{e.message}"
          render json: { error: e.message }, status: :unprocessable_entity
        end        

        # Initialize a transfer
        def initialize_transfer
          # Check that necessary parameters are present
          raise "Campaign ID is missing" unless params[:campaign_id]

          @campaign = Campaign.find(params[:campaign_id])
          @fundraiser = @campaign.fundraiser
          subaccount = @fundraiser.subaccount.first

          Rails.logger.debug "Currency: #{@campaign.currency.upcase}"

          raise "You do not have a account number configured." unless subaccount
          raise "Recipient code not found for this fundraiser" unless subaccount.recipient_code

          total_donations = @campaign.current_amount
          raise "You have no funds available for payout." if total_donations <= 0.0

          # Check if there is sufficient balance
          balance_response = @paystack_service.check_balance

          if balance_response[:status]

            currency = @campaign.currency.upcase 
            available_balance = balance_response[:data].find { |b| b[:currency] == currency }&.dig(:balance).to_f

            if available_balance < total_donations
              render json: { error: "Sorry, this is an issue on our side. We'll resolve it soon. Kindly try again later" }, status: :unprocessable_entity
              return
            end
          else
            render json: { error: "We cannot perform your transaction at this time. Please try again later." }, status: :unprocessable_entity
            return
          end


          # Proceed with the transfer
          response = @paystack_service.initiate_transfer(
            amount: total_donations.round,
            recipient: subaccount.recipient_code,
            reason: "Payout for campaign: #{@campaign.title}",
            currency: @campaign.currency.upcase
          )

          if response[:status]
            subaccount.update!(reference: response.dig(:data, :reference), transfer_code: response.dig(:data, :transfer_code), amount: total_donations.round)
            render json: { transfer_code: response.dig(:data, :transfer_code), reference: response.dig(:data, :reference), message: "Transfer initiated successfully." }, status: :ok
          else
            render json: { error: "This is an error on our side." }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Error initiating transfer: #{e.message}"
          render json: { error: e.message }, status: :unprocessable_entity
        end        

        # Bulk create transfer recipients
        def bulk_create_transfer_recipients
          response = @paystack_service.bulk_create_transfer_recipients(
            recipients: params[:recipients]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # List transfer recipients
        def list_transfer_recipients
          response = @paystack_service.list_transfer_recipients(
            page: params[:page] || 1,
            per_page: params[:per_page] || 50
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Fetch transfer recipient details
        def fetch_transfer_recipient
          response = @paystack_service.fetch_transfer_recipient(params[:recipient_code])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end

        # Finalize a transfer
        def finalize_transfer
          response = @paystack_service.finalize_transfer(
            transfer_code: params[:transfer_code],
            otp: params[:otp]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Initiate a bulk transfer
        def initiate_bulk_transfer
          response = @paystack_service.initiate_bulk_transfer(
            transfers: params[:transfers]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Fetch transfer details
        def fetch_transfers
          @fundraiser = User.find_by(id: params[:fundraiser_id])
          raise ActiveRecord::RecordNotFound, "Fundraiser not found" unless @fundraiser

          subaccount = @fundraiser.subaccount
          raise ActiveRecord::RecordNotFound, "Subaccount not found for this fundraiser" unless subaccount

          response = @paystack_service.fetch_transfer(subaccount.transfer_code)
          render json: response, status: :ok
        rescue ActiveRecord::RecordNotFound => e
          render json: { error: e.message }, status: :not_found
        rescue => e
          Rails.logger.error "Error fetching transfers: #{e.message}"
          render json: { error: e.message }, status: :unprocessable_entity
        end

      # Fetch all transfers for the current user
      def fetch_user_transfers
        @fundraiser = @current_user  # current_user is the fundraiser (User)
      
        # Fetch all subaccounts for the current user
        subaccounts = @fundraiser.subaccount
      
        if subaccounts.empty?
          render json: { error: "No subaccounts found for this user" }, status: :not_found
          return
        end
      
        # Assuming you want to fetch transfers for each subaccount
        transfer_responses = subaccounts.map do |subaccount|
          response = @paystack_service.fetch_transfer(subaccount.transfer_code)
      
          if response[:status]
            # Extract and simplify the data for each transfer
            simplified_data = response[:data].map do |transfer|
              {
                subaccount_id: subaccount.id,
                transfer_code: transfer[:transfer_code],
                reference: transfer[:reference],
                amount: transfer[:amount],
                reason: transfer[:reason],
                recipient_name: transfer[:recipient][:name],
                recipient_code: transfer[:recipient][:recipient_code],
                recipient_account_number: transfer[:recipient][:details][:account_number],
                recipient_bank_name: transfer[:recipient][:details][:bank_name],
                status: transfer[:status],
                currency: transfer[:currency],
                created_at: transfer[:createdAt]
              }
            end
            { subaccount_id: subaccount.id, transfers: simplified_data }
          else
            { subaccount_id: subaccount.id, error: "No transfers found" }
          end
        end
      
        # Render the simplified response
        render json: { transfers: transfer_responses }, status: :ok
      rescue => e
        Rails.logger.error "Error fetching user transfers: #{e.message}"
        render json: { error: "An error occurred while fetching transfers: #{e.message}" }, status: :unprocessable_entity
      end
      
      
      
      

        private

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
      end
    end
  end
end
