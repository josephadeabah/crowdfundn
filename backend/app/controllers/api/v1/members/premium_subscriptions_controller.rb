# app/controllers/api/v1/members/premium_subscriptions_controller.rb
module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request
        
        # This now handles GET /api/v1/members/premium_subscriptions/current
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

          # Use dedicated callback page
          callback_url = 'https://www.bantuhive.com/premium/callback'
          
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

        # Add to your PremiumSubscriptionsController
        def verify
          reference = params[:reference]
          
          # Verify payment with Paystack
          paystack_service = PaystackService.new
          verification_response = paystack_service.verify_transaction(reference)
          
          if verification_response[:status] && verification_response[:data][:status] == 'success'
            # Process successful payment
            metadata = verification_response[:data][:metadata]
            user = User.find(metadata[:user_id])
            plan = PremiumPlan.find(metadata[:premium_plan_id])
            
            # Pass the Paystack transaction reference
            user.upgrade_to_premium(plan, verification_response[:data][:reference])
            
            render json: { 
              success: true, 
              message: 'Payment verified successfully',
              plan: plan.name
            }, status: :ok
          else
            render json: { 
              success: false, 
              message: 'Payment verification failed',
              error: verification_response[:message]
            }, status: :unprocessable_entity
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