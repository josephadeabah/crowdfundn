module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController
        def receive
          payload = request.body.read
          signature = request.headers['X-Paystack-Signature']

          paystack_service = PaystackService.new
          if paystack_service.verify_paystack_signature(payload, signature)
            begin
              event = JSON.parse(payload, symbolize_names: true)
              handle_event(event)
              head :ok # Respond with 200 OK after handling the event
            rescue JSON::ParserError => e
              Rails.logger.error "Invalid JSON payload: #{e.message}"
              render json: { error: 'Invalid JSON payload' }, status: :unprocessable_entity
            rescue StandardError => e
              Rails.logger.error "Unexpected error: #{e.message}"
              render json: { error: 'Unexpected error occurred' }, status: :internal_server_error
            end
          else
            Rails.logger.error 'Invalid webhook signature'
            render json: { error: 'Invalid signature' }, status: :forbidden
          end
        end

        private

        def handle_event(event)
          event_id = event[:data][:id]

          # deduplication
          if EventProcessed.exists?(event_id: event_id)
            Rails.logger.info "Event already processed: #{event_id}"
            return
          end

          Rails.logger.info "Received Paystack event: #{event[:event]}"

          case event[:event]
          when 'charge.success'
            metadata = event[:data][:metadata] || {}
            
            # ✅ FIXED: Check for premium subscription metadata
            if metadata[:type] == 'premium_subscription' || metadata[:premium_plan_id]
              handler = PaystackWebhook::PremiumSubscriptionHandler.new(event[:data])
              handler.call(:charge_success)
              
              # ✅ Double ensure user gets updated for premium status
              ensure_user_premium_status(event[:data])
            else
              PaystackWebhook::ChargeSuccessHandler.new(event[:data]).call
            end

          when 'charge.failed'
            PaystackWebhook::ChargeFailedHandler.new(event[:data]).call

          when 'transfer.success'
            PaystackWebhook::TransferSuccessHandler.new(event[:data]).call

          when 'transfer.failed'
            PaystackWebhook::TransferFailedHandler.new(event[:data]).call

          when 'transfer.reversed'
            PaystackWebhook::TransferReversedHandler.new(event[:data]).call

          when 'subscription.create'
            PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_create)

          when 'subscription.disable', 'subscription.not_renew'
            PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_disable)

          when 'subscription.charge.failed'
            PaystackWebhook::SubscriptionChargeFailedHandler.new(event[:data]).call

          when 'refund.processed'
            metadata = event[:data][:metadata] || {}
            if metadata[:type] == 'equity_investment'
              PaystackWebhook::Handlers::RefundProcessedHandler.new(data: event[:data]).call
            else
              PaystackWebhook::Handlers::DonationRefundHandler.new(data: event[:data]).call
            end

          else
            Rails.logger.warn "Unhandled event type: #{event[:event]}"
          end

          EventProcessed.create(event_id: event_id)
        rescue => e
          Rails.logger.error "Error processing webhook event: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
        end

        # ✅ New method to ensure user premium status is updated
        def ensure_user_premium_status(data)
          metadata = data[:metadata] || {}
          user_id = metadata[:user_id]
          plan_id = metadata[:premium_plan_id]
          
          return unless user_id && plan_id
          
          user = User.find_by(id: user_id)
          plan = PremiumPlan.find_by(id: plan_id)
          
          return unless user && plan
          
          # Only update if not already set
          unless user.premium_access?
            user.update_columns(
              premium_access: true,
              premium_plan_id: plan.id,
              premium_expires_at: user.calculate_premium_expiry(plan),
              updated_at: Time.current
            )
            Rails.logger.info "Ensured premium status for User##{user.id}"
          end
        end
      end
    end
  end
end