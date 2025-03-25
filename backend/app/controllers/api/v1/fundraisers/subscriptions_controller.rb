module Api
  module V1
    module Fundraisers
      class SubscriptionsController < ApplicationController
        # Skip authentication for anonymous subscription creation
        before_action :authenticate_request, only: %i[fetch_subscription]

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

        def cancel_subscription
          paystack_service = PaystackService.new
          subscription = Subscription.find_by(subscription_code: params[:subscription_code])

          return render json: { error: 'Subscription not found' }, status: :not_found unless subscription

          response = paystack_service.cancel_subscription(
            subscription_code: subscription.subscription_code,
            email_token: subscription.email_token
          )

          if response[:status]
            subscription.update(status: 'canceled')
            render json: { message: 'Subscription canceled successfully' }, status: :ok
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end

        def fetch_subscription
          paystack_service = PaystackService.new
          subscription = Subscription.find_by(subscription_code: params[:subscription_code])

          return render json: { error: 'Subscription not found' }, status: :not_found unless subscription

          response = paystack_service.fetch_subscription(subscription.subscription_code)

          if response[:status]
            render json: { subscription: response[:data] }, status: :ok
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end
