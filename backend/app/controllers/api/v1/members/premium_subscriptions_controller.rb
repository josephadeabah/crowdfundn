# app/controllers/api/v1/members/premium_subscriptions_controller.rb
module Api
  module V1
    module Members
      class PremiumSubscriptionsController < ApplicationController
        before_action :authenticate_request

        def show
          active_subscription = @current_user.active_premium_subscription
          current_plan = active_subscription&.premium_plan

          render json: {
            has_premium: @current_user.premium_access?,
            expires_at: active_subscription&.expires_at,
            current_plan: current_plan ? {
              id: current_plan.id,
              name: current_plan.name,
              price: current_plan.price,
              currency: current_plan.currency,
              interval: current_plan.interval,
              description: current_plan.description,
              features: current_plan.features,
              is_recurring: current_plan.recurring?
            } : nil,
            active_subscription: active_subscription ? {
              id: active_subscription.id,
              status: active_subscription.status,
              auto_renew: active_subscription.auto_renew,
              paystack_subscription_code: active_subscription.paystack_subscription_code,
              expires_at: active_subscription.expires_at,
              start_date: active_subscription.start_date,
              is_recurring: active_subscription.auto_renew
            } : nil
          }, status: :ok
        end

        def create
          plan = PremiumPlan.find(params[:plan_id])

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
            type: 'premium_subscription',
            is_recurring: is_recurring,
            plan_interval: plan.interval
          }

          if is_recurring
            if plan.paystack_plan_code.present?
              plan_code = plan.paystack_plan_code

              response = paystack_service.initialize_transaction(
                email: @current_user.email,
                amount: plan.price,
                currency: plan.currency,
                plan: plan_code,
                callback_url: callback_url,
                metadata: metadata.merge(plan_code: plan_code)
              )
            else
              plan_response = paystack_service.create_subscription_plan(
                name: "#{plan.name} - #{plan.interval}",
                amount: plan.price,
                interval: plan.interval,
                currency: plan.currency
              )

              if plan_response[:status]
                plan_code = plan_response[:data][:plan_code]
                plan.update(paystack_plan_code: plan_code)

                response = paystack_service.initialize_transaction(
                  email: @current_user.email,
                  amount: plan.price,
                  currency: plan.currency,
                  plan: plan_code,
                  callback_url: callback_url,
                  metadata: metadata.merge(plan_code: plan_code)
                )
              else
                render json: { error: 'Failed to create subscription plan' }, status: :unprocessable_entity
                return
              end
            end
          else
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
            is_recurring = ActiveModel::Type::Boolean.new.cast(metadata[:is_recurring])

            subscription = PremiumSubscription.find_by(transaction_reference: reference)

            if subscription
              render json: {
                success: true,
                message: 'Payment verified successfully',
                processed: true
              }, status: :ok
            else
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
              render json: { message: 'Subscription cancelled successfully' }, status: :ok
            rescue => e
              Rails.logger.error "Failed to cancel subscription: #{e.message}"
              render json: {
                error: 'Failed to cancel subscription on Paystack',
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
