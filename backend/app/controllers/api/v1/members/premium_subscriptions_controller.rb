# app/controllers/api/v1/members/premium_subscriptions_controller.rb
module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request

        def create
          # Initialize Paystack payment
          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: @current_user.email,
            amount: params[:amount], # in kobo
            plan_code: params[:plan_code],
            metadata: {
              user_id: @current_user.id,
              premium_access: true
            }
          )

          if response[:status]
            render json: { authorization_url: response[:data][:authorization_url] }, status: :ok
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end

        def show
          render json: {
            has_premium: @current_user.premium_access?,
            expires_at: @current_user.premium_expires_at
          }, status: :ok
        end
      end
    end
  end
end