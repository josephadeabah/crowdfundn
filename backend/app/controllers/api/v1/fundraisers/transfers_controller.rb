module Api
  module V1
    module Fundraisers
      class TransfersController < ApplicationController
        include ErrorHandler
        # before_action :authenticate_request!, except: [:approve_transfer, :get_supported_countries, :get_bank_list, :add_subaccount_to_split, :check_balance, :create_transfer_recipient, :bulk_create_transfer_recipients, :list_transfer_recipients, :fetch_transfer_recipient, :initiate_transfer, :finalize_transfer, :initiate_bulk_transfer, :fetch_transfer, :verify_transfer]
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
        
        def add_subaccount_to_split
          response = @paystack_service.add_subaccount_to_split(
            split_id: params[:split_id],
            subaccount: params[:subaccount],
            share: params[:share]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end        

        # Check Paystack balance
        def check_balance
          response = @paystack_service.check_balance
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        # Create a transfer recipient
        def create_transfer_recipient
          response = @paystack_service.create_transfer_recipient(
            type: transfer_recipient_params[:type],
            name: transfer_recipient_params[:name],
            account_number: transfer_recipient_params[:account_number],
            bank_code: transfer_recipient_params[:bank_code],
            currency: transfer_recipient_params[:currency],
            authorization_code: transfer_recipient_params[:authorization_code],
            description: transfer_recipient_params[:description],
            metadata: transfer_recipient_params[:metadata]
          )
          render json: response, status: :ok
        rescue => e
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

        # Initiate a transfer
        def initiate_transfer
          response = @paystack_service.initiate_transfer(
            amount: transfer_params[:amount],
            recipient: transfer_params[:recipient],
            reason: transfer_params[:reason],
            user: current_user,
            campaign: params[:campaign],
            currency: transfer_params[:currency] || "NGN"
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
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
        def fetch_transfer
          response = @paystack_service.fetch_transfer(params[:id_or_code])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end

        # Verify transfer status
        def verify_transfer
          response = @paystack_service.verify_transfer(params[:reference])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end

        private

        def filter_bank_params
          params.permit(:country, :use_cursor, :per_page, :next, :previous).except(:format)
        end                  

        def process_transfer_approval(transfer_details)
          # Add your logic to decide whether to approve or reject the transfer.
          # For example:
          if transfer_details[:amount] > 1_000_000 # example condition
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
