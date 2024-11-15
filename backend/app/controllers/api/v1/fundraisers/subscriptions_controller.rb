module Api
    module V1
      module Fundraisers
        class SubscriptionsController < ApplicationController
          before_action :authenticate_request, except: []
  
          def create_plan
            paystack_service = PaystackService.new
            response = paystack_service.create_subscription_plan(
              name: params[:name],
              interval: params[:interval],
              amount: params[:amount]
            )
  
            if response[:status]
              render json: { plan: response[:data] }, status: :created
            else
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
  
          def create_subscription
            paystack_service = PaystackService.new
            response = paystack_service.create_subscription(
              email: params[:email],
              plan: params[:plan],
              authorization: params[:authorization]
            )
  
            if response[:status]
              render json: { subscription: response[:data] }, status: :created
            else
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
  
          def cancel_subscription
            paystack_service = PaystackService.new
            response = paystack_service.cancel_subscription(
              subscription_code: params[:subscription_code],
              email_token: params[:email_token]
            )
          
            if response[:status]
              render json: { message: 'Subscription canceled successfully' }, status: :ok
            else
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
          
  
          def fetch_subscription
            paystack_service = PaystackService.new
            response = paystack_service.fetch_subscription(params[:subscription_code])
  
            if response[:status]
              render json: { subscription: response[:data] }, status: :ok
            else
              render json: { error: response[:message] }, status: :not_found
            end
          end
        end
      end
    end
end
  