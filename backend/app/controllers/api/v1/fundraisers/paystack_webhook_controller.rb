# app/controllers/api/v1/fundraisers/paystack_webhook_controller.rb
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

          # Check if the event has already been processed (deduplication)
          if EventProcessed.exists?(event_id: event_id)
            Rails.logger.info "Event already processed: #{event_id}"
            return # Ignore duplicate events
          end

          # Log the received event for debugging purposes
          Rails.logger.info "Received Paystack event: #{event[:event]}"

          # Process different event types
          case event[:event]
          when 'charge.success'
            metadata = event[:data][:metadata] || {}
            if metadata[:premium_access] # Check for premium subscription
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
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
            # Check if this is a premium subscription by plan name pattern
            plan_name = event.dig(:data, :plan, :name)
            if plan_name&.match?(/ - (monthly|quarterly|annually)$/)
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              PaystackWebhook::SubscriptionCreateHandler.new(event[:data]).call
            end
          when 'subscription.disable'
            # Check if this is a premium subscription by plan name pattern
            plan_name = event.dig(:data, :plan, :name)
            if plan_name&.match?(/ - (monthly|quarterly|annually)$/)
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              PaystackWebhook::SubscriptionDisabledHandler.new(event[:data]).call
            end
          when 'subscription.not_renew'
            # Check if this is a premium subscription by plan name pattern
            plan_name = event.dig(:data, :plan, :name)
            if plan_name&.match?(/ - (monthly|quarterly|annually)$/)
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            end
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
            # Don't render an error response here as it would prevent the 200 OK response
            # Just log and continue
          end

          # Mark the event as processed to prevent future duplicates
          EventProcessed.create(event_id: event_id)
        rescue => e
          Rails.logger.error "Error processing webhook event: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          # Don't re-raise the exception to prevent webhook retries
        end
      end
    end
  end
end