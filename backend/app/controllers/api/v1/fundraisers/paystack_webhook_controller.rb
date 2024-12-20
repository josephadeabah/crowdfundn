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
            Rails.logger.error "Invalid webhook signature"
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
            PaystackWebhook::ChargeSuccessHandler.new(event[:data]).call
          when 'charge.failed'
            PaystackWebhook::ChargeFailedHandler.new(event[:data]).call
          when 'transfer.success'
            PaystackWebhook::TransferSuccessHandler.new(event[:data]).call
          when 'transfer.failed'
            PaystackWebhook::TransferFailedHandler.new(event[:data]).call
          when 'transfer.reversed'
            PaystackWebhook::TransferReversedHandler.new(event[:data]).call
          when 'subscription.create'
            PaystackWebhook::SubscriptionCreateHandler.new(event[:data]).call
          when 'subscription.disabled'
            PaystackWebhook::SubscriptionDisabledHandler.new(event[:data]).call
          when 'subscription.charge.failed'
            PaystackWebhook::SubscriptionChargeFailedHandler.new(event[:data]).call
          else
            Rails.logger.warn "Unhandled event type: #{event[:event]}"
            render json: { error: 'Unhandled event type' }, status: :unprocessable_entity
          end

          # Mark the event as processed to prevent future duplicates
          EventProcessed.create(event_id: event_id)
        end
      end
    end
  end
end
