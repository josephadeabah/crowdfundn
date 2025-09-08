# app/controllers/api/v1/members/premium_subscriptions_controller.rb
module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request
        
        def show
          active_subscription = @current_user.active_premium_subscription
          
          render json: {
            has_premium: @current_user.premium_access?,
            expires_at: @current_user.premium_expires_at,
            current_plan: @current_user.premium_plan,
            active_subscription: active_subscription ? {
              id: active_subscription.id,
              status: active_subscription.status,
              auto_renew: active_subscription.auto_renew,
              paystack_subscription_code: active_subscription.paystack_subscription_code,
              expires_at: active_subscription.expires_at,
              start_date: active_subscription.start_date
            } : nil
          }, status: :ok
        end
        
      def create
        plan = PremiumPlan.find(params[:plan_id])
        
        # Handle both string and boolean values for recurring parameter
        recurring_param = params[:recurring]
        is_recurring = if recurring_param.is_a?(String)
                        recurring_param.downcase == 'true'
                      else
                        recurring_param == true
                      end
          
          callback_url = 'https://www.bantuhive.com/premium/callback'
          paystack_service = PaystackService.new
          
          metadata = {
            user_id: @current_user.id,
            premium_plan_id: plan.id,
            premium_access: true,
            type: 'premium_subscription',
            is_recurring: is_recurring.to_s,
            plan_interval: plan.interval
          }

          if is_recurring
            # Create Paystack plan for recurring subscription
            plan_response = paystack_service.create_subscription_plan(
              name: "#{plan.name} - #{plan.interval}",
              amount: plan.price,
              interval: plan.interval,
              currency: plan.currency
            )
            
            if plan_response[:status]
              plan_code = plan_response[:data][:plan_code]
              # Use initialize_subscription method for recurring
              response = paystack_service.initialize_subscription(
                email: @current_user.email,
                plan_code: plan_code,
                callback_url: callback_url,
                metadata: metadata.merge(plan_code: plan_code)
              )
            else
              render json: { error: 'Failed to create subscription plan' }, status: :unprocessable_entity
              return
            end
          else
            # One-time payment - use initialize_transaction
            response = paystack_service.initialize_transaction(
              email: @current_user.email,
              amount: plan.price,
              currency: plan.currency,
              callback_url: callback_url,
              metadata: metadata
            )
          end
          
          if response[:status]
            render json: { 
              authorization_url: response[:data][:authorization_url],
              reference: response[:data][:reference],
              is_recurring: is_recurring
            }, status: :ok
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end

        def verify
          reference = params[:reference]
          
          paystack_service = PaystackService.new
          verification_response = paystack_service.verify_transaction(reference)
          
          if verification_response[:status] && verification_response[:data][:status] == 'success'
            metadata = verification_response[:data][:metadata]
            user = User.find(metadata[:user_id].to_i)
            plan = PremiumPlan.find(metadata[:premium_plan_id].to_i)
            is_recurring = metadata[:is_recurring] == 'true'
            
            subscription_code = if is_recurring && verification_response[:data][:subscription_code].present?
                                  verification_response[:data][:subscription_code]
                                else
                                  nil
                                end
            
            user.upgrade_to_premium(
              plan, 
              verification_response[:data][:reference],
              subscription_code
            )
            
            render json: { 
              success: true, 
              message: 'Payment verified successfully',
              plan: plan.name,
              is_recurring: is_recurring
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