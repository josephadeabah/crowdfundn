# app/controllers/api/v1/fundraisers/paystack_webhook_controller.rb
module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController
        def receive
          payload = request.body.read
          signature = request.headers['X-Paystack-Signature']

          Rails.logger.info "Webhook received with signature: #{signature}"

          paystack_service = PaystackService.new
          if paystack_service.verify_paystack_signature(payload, signature)
            Rails.logger.info "Signature verification successful"

            begin
              event = JSON.parse(payload, symbolize_names: true)
              handle_event(event)
              head :ok
            rescue JSON::ParserError => e
              Rails.logger.error "Invalid JSON payload: #{e.message}"
              render json: { error: 'Invalid JSON payload' }, status: :unprocessable_entity
            rescue StandardError => e
              Rails.logger.error "Unexpected error: #{e.message}"
              Rails.logger.error e.backtrace.join("\n")
              render json: { error: 'Unexpected error occurred' }, status: :internal_server_error
            end
          else
            Rails.logger.error "Signature verification failed"
            render json: { error: 'Invalid signature' }, status: :forbidden
          end
        end

        private

        def handle_event(event)
          event_id   = event[:data][:id]
          event_type = event[:event]
          metadata   = event.dig(:data, :metadata) || {}

          Rails.logger.info "=== WEBHOOK EVENT RECEIVED ==="
          Rails.logger.info "Event: #{event_type}, ID: #{event_id}"
          Rails.logger.info "Metadata: #{metadata.inspect}"

          # ✅ Prevent duplicate event processing
          if EventProcessed.exists?(event_id: event_id)
            Rails.logger.info "Event already processed: #{event_id}"
            return
          end

          case event_type
          when "charge.success"
            Rails.logger.info "Processing charge.success event"

            if metadata[:type] == "premium_subscription" || metadata[:premium_access]
              Rails.logger.info "Routing to PremiumSubscriptionHandler"
              PaystackWebhook::Handlers::PremiumSubscriptionHandler.new(event[:data]).call(:charge_success)
            else
              Rails.logger.info "Routing to ChargeSuccessHandler"
              PaystackWebhook::Handlers::ChargeSuccessHandler.new(event[:data]).call
            end

          when "charge.failed"
            PaystackWebhook::Handlers::ChargeFailedHandler.new(event[:data]).call

          when "transfer.success"
            PaystackWebhook::Handlers::TransferSuccessHandler.new(event[:data]).call

          when "transfer.failed"
            PaystackWebhook::Handlers::TransferFailedHandler.new(event[:data]).call

          when "transfer.reversed"
            PaystackWebhook::Handlers::TransferReversedHandler.new(event[:data]).call

          when "subscription.create"
            PaystackWebhook::Handlers::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_create)

          when "subscription.disable", "subscription.not_renew"
            PaystackWebhook::Handlers::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_disable)

          when "subscription.charge.failed"
            PaystackWebhook::Handlers::SubscriptionChargeFailedHandler.new(event[:data]).call

          when "refund.processed"
            if metadata[:type] == "equity_investment"
              PaystackWebhook::Handlers::RefundProcessedHandler.new(event[:data]).call
            else
              PaystackWebhook::Handlers::DonationRefundHandler.new(event[:data]).call
            end

          else
            Rails.logger.warn "Unhandled event type: #{event_type}"
          end

          # ✅ Mark event processed
          EventProcessed.create!(event_id: event_id)
          Rails.logger.info "Event processing completed successfully"

        rescue => e
          Rails.logger.error "Error processing webhook event: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          # Don’t raise — return 200 to Paystack
        end
      end
    end
  end
end
