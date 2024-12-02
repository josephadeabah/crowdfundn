module Api
  module V1
    module Fundraisers
      class TransfersController < ApplicationController
        before_action :authenticate_request! # Assuming you require authentication
        before_action :set_transfer_service

         # Create a transfer recipient
        def create_transfer_recipient
          response = @paystack_service.create_transfer_recipient(
            name: transfer_recipient_params[:name],
            account_number: transfer_recipient_params[:account_number],
            bank_code: transfer_recipient_params[:bank_code],
            email: transfer_recipient_params[:email]
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

        # Fetch a specific transfer recipient
        def fetch_transfer_recipient
          response = @paystack_service.fetch_transfer_recipient(params[:recipient_code])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end
      
        def initialize_transfer
          response = @paystack_service.initiate_transfer(
            amount: transfer_params[:amount],
            recipient: transfer_params[:recipient],
            reason: transfer_params[:reason]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      
        def finalize_transfer
          response = @paystack_service.finalize_transfer(
            transfer_code: params[:transfer_code],
            otp: params[:otp]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      
        def initiate_bulk_transfer
          response = @paystack_service.initiate_bulk_transfer(
            transfers: params[:transfers]
          )
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
      
        def fetch_transfer
          response = @paystack_service.fetch_transfer(params[:id_or_code])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end
      
        def verify_transfer
          response = @paystack_service.verify_transfer(params[:reference])
          render json: response, status: :ok
        rescue => e
          render json: { error: e.message }, status: :not_found
        end
      
        private

        def set_transfer_service
          @paystack_service = PaystackService.new
        end

        def transfer_recipient_params
          params.require(:transfer_recipient).permit(:name, :account_number, :bank_code, :email)
        end
      
        def transfer_params
          params.require(:transfer).permit(:amount, :recipient, :reason)
        end
      end
    end
  end
end
