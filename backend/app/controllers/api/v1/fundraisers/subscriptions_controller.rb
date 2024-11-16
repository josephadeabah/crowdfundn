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
              amount: params[:amount],
            )
    
            if response[:status]
              render json: { plan: response[:data] }, status: :created
            else
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
    
        #   def create_subscription
        #     paystack_service = PaystackService.new
        #     campaign = Campaign.find(params[:campaign_id])
    
        #     # Handle anonymous user subscription
        #     customer_email = params[:email] || @current_user&.email # If no current user, get email from params
    
        #     if customer_email.nil?
        #       return render json: { error: 'Email is required for subscription' }, status: :unprocessable_entity
        #     end
    
        #     # Create customer in Paystack if not authenticated (anonymous)
        #     response = paystack_service.create_subscription(
        #       email: customer_email,
        #       plan: params[:plan],
        #       authorization: params[:authorization] # assuming authorization data is provided
        #     )
    
        #     if response[:status]
        #       subscription = Subscription.new(
        #         user: @current_user,  # This will be nil if the user is anonymous
        #         campaign: campaign,
        #         subscription_code: response[:data]['subscription_code'],
        #         email_token: response[:data]['email_token'],
        #         status: response[:data]['status']
        #       )
    
        #       if subscription.save
        #         render json: { subscription: subscription }, status: :created
        #       else
        #         render json: { error: subscription.errors.full_messages }, status: :unprocessable_entity
        #       end
        #     else
        #       render json: { error: response[:message] }, status: :unprocessable_entity
        #     end
        #   end
    
          def cancel_subscription
            paystack_service = PaystackService.new
            subscription = Subscription.find_by(subscription_code: params[:subscription_code])
    
            unless subscription
              return render json: { error: 'Subscription not found' }, status: :not_found
            end
    
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
    
            unless subscription
              return render json: { error: 'Subscription not found' }, status: :not_found
            end
    
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
  