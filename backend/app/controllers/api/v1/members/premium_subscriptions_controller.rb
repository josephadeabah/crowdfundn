# app/controllers/api/v1/members/premium_subscriptions_controller.rb
module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request
        
        def show
          render json: {
            has_premium: @current_user.premium_access?,
            expires_at: @current_user.premium_expires_at,
            current_plan: @current_user.premium_plan,
            active_subscription: @current_user.active_premium_subscription
          }, status: :ok
        end
        
        def create
          plan = PremiumPlan.find(params[:plan_id])

          callback_url = 'https://www.bantuhive.com/account#Dashboard?'
          
          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: @current_user.email,
            amount: plan.price,
            currency: plan.currency,
            callback_url: callback_url,
            metadata: {
              user_id: @current_user.id,
              premium_plan_id: plan.id,
              premium_access: true,
              type: 'premium_subscription'
            }
          )
          
          if response[:status]
            render json: { 
              authorization_url: response[:data][:authorization_url],
              reference: response[:data][:reference]
            }, status: :ok
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end
        
        def cancel
          subscription = @current_user.active_premium_subscription
          
          if subscription
            subscription.cancel!
            @current_user.downgrade_from_premium
            
            render json: { message: 'Subscription cancelled successfully' }, status: :ok
          else
            render json: { error: 'No active subscription found' }, status: :not_found
          end
        end
      end
    end
  end
end