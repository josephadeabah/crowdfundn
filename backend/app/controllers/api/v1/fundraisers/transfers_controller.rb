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
          subaccount = @fundraiser.subaccount.order(created_at: :desc).first
          campaign = Campaign.find(params[:campaign_id])
        
          raise "Fundraiser does not have a subaccount configured." unless subaccount
        
          # Check if a recipient code already exists
          if subaccount.recipient_code.present?
            render json: { recipient_code: subaccount.recipient_code, message: "Recipient code already exists." }, status: :ok
            return
          end
        
          # Here, we will utilize the recently created subaccount for the recipient
          response = @paystack_service.create_transfer_recipient(
            type: subaccount.subaccount_type,           # Use the subaccount type from the subaccount
            name: subaccount.business_name,             # Use the business name from the subaccount
            account_number: subaccount.account_number,  # Use the account number from the subaccount
            bank_code: subaccount.settlement_bank,      # Use the settlement bank from the subaccount
            currency: campaign.currency.upcase,                            # You may use the currency from the campaign if necessary
            description: "Transfer recipient for campaign payouts",
            metadata: { user_id: @fundraiser.id, campaign_id: campaign.id }
          )
        
          if response[:status]
            subaccount.update!(recipient_code: response.dig(:data, :recipient_code))
            render json: { message: "Recipient created successfully.", recipient_code: response.dig(:data, :recipient_code), campaign_id: campaign.id }, status: :ok
          else
            render json: { error: "Provide valid data" }, status: :unprocessable_entity
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
          subaccount = @fundraiser.subaccount.order(created_at: :desc).first

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

       # Fetch transfers for the logged-in user
        def fetch_user_transfers
          @fundraiser = @current_user

          # Query the database for transfers belonging to the current user
          @transfers = @fundraiser.transfers.includes(:campaign).order(created_at: :desc)

          if @transfers.empty?
            render json: { error: "No transfers found for this user" }, status: :not_found
          else
            render json: @transfers, status: :ok
          end
        end

        # Save a transfer from Paystack to the database
        def save_transfer_from_paystack(transfer_data)
          # Here we extract the relevant transfer data from the Paystack API response
          transfer = {
            transfer_code: transfer_data[:transfer_code],
            reference: transfer_data[:reference],
            amount: transfer_data[:amount],
            reason: transfer_data[:reason],
            account_name: transfer_data[:recipient][:name],
            recipient_code: transfer_data[:recipient][:recipient_code],
            account_number: transfer_data[:recipient][:details][:account_number],
            bank_name: transfer_data[:recipient][:details][:bank_name],
            status: transfer_data[:status],
            currency: transfer_data[:currency],
            created_at: transfer_data[:createdAt]
          }

          campaign = Transfers.find_by(campaign_id: transfer_data.dig(:metadata, :campaign_id))

          # Create or update the transfer in the database
          transfer_record = Transfer.find_or_initialize_by(transfer_code: transfer[:transfer_code])
          transfer_record.update(
            user: current_user,  # Associate with the logged-in user
            campaign: campaign,  # Associate with the campaign
            bank_name: transfer[:bank_name],
            account_number: transfer[:account_number],
            amount: transfer[:amount],
            currency: transfer[:currency],
            status: transfer[:status],
            reason: transfer[:reason],
            recipient_code: transfer[:recipient_code],
            failure_reason: transfer[:failure_reason],
            completed_at: transfer[:completed_at],
            reversed_at: transfer[:reversed_at],
            reference: transfer[:reference]
          )

          if transfer_record.save
            render json: { message: "Transfer saved successfully" }, status: :ok
          else
            render json: { error: "Failed to save transfer" }, status: :unprocessable_entity
          end
        end

        # Fetch transfers from Paystack for the logged-in user
        def fetch_transfers_from_paystack
          @fundraiser = current_user
          subaccounts = @fundraiser.subaccount

          # Fetch transfers for each subaccount
          subaccounts.each do |subaccount|
            # Assuming `@paystack_service` is a service class that interacts with the Paystack API
            response = @paystack_service.fetch_transfers(subaccount.transfer_code)
            
            if response[:status] && response[:data].present?
              # Loop through each transfer and save it to the database
              response[:data].each do |transfer_data|
                save_transfer_from_paystack(transfer_data)
              end
            else
              render json: { error: "No transfers found or an error occurred" }, status: :unprocessable_entity
              return
            end
          end

          render json: { message: "Transfers fetched and saved successfully" }, status: :ok
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
