module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request
                
        def show
          active_subscription = @current_user.active_premium_subscription
          current_plan = @current_user.premium_plan
          
          render json: {
            has_premium: @current_user.premium_access?,
            expires_at: @current_user.premium_expires_at,
            current_plan: current_plan ? {
              id: current_plan.id,
              name: current_plan.name,
              price: current_plan.price,
              currency: current_plan.currency,
              interval: current_plan.interval,
              description: current_plan.description,
              features: current_plan.features
            } : nil,
            active_subscription: active_subscription ? {
              id: active_subscription.id,
              status: active_subscription.status,
              auto_renew: active_subscription.auto_renew,
              expires_at: active_subscription.expires_at,
              start_date: active_subscription.start_date
            } : nil
          }, status: :ok
        end
        

        def create
          plan = PremiumPlan.find(params[:plan_id])
          
          callback_url = 'https://www.bantuhive.com/premium/callback'
          paystack_service = PaystackService.new
          
          metadata = {
            user_id: @current_user.id,
            premium_plan_id: plan.id,
            premium_access: true,
            type: 'premium_subscription'
          }

          # One-time payment only
          response = paystack_service.initialize_transaction(
            email: @current_user.email,
            amount: plan.price,
            currency: plan.currency,
            callback_url: callback_url,
            metadata: metadata
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

        def verify
          reference = params[:reference]
          
          paystack_service = PaystackService.new
          verification_response = paystack_service.verify_transaction(reference)
          
          if verification_response[:status] && verification_response[:data][:status] == 'success'
            # Check if webhook has already processed this (optional safety check)
            subscription = PremiumSubscription.find_by(transaction_reference: reference)
            
            if subscription
              # Webhook already processed this payment
              render json: { 
                success: true, 
                message: 'Payment verified successfully',
                processed: true
              }, status: :ok
            else
              # Payment successful but webhook not processed yet
              render json: { 
                success: true, 
                message: 'Payment verified successfully. Your subscription will be activated shortly.',
                processed: false
              }, status: :ok
            end
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
            begin
              subscription.cancel!
              @current_user.downgrade_from_premium
              
              render json: { message: 'Subscription cancelled successfully' }, status: :ok
            rescue => e
              Rails.logger.error "Failed to cancel subscription: #{e.message}"
              render json: { 
                error: 'Failed to cancel subscription', 
                details: e.message 
              }, status: :unprocessable_entity
            end
          else
            render json: { error: 'No active subscription found' }, status: :not_found
          end
        end
      end
    end
  end
end