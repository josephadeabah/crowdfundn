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
              head :ok
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
          return if EventProcessed.exists?(event_id: event_id)

          Rails.logger.info "Received Paystack event: #{event[:event]}"

          # FIRST check if this is clearly an equity transaction
          if clearly_equity_event?(event)
            handle_equity_event(event)
          else
            # Default to regular donation processing
            handle_regular_event(event)
          end

          EventProcessed.create(event_id: event_id)
        end

        def clearly_equity_event?(event)
          metadata = event.dig(:data, :metadata) || {}
          # Only treat as equity if there's an explicit investment_id
          metadata[:investment_id].present?
        end

        def handle_regular_event(event)
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
          end
        end

        def handle_equity_event(event)
          case event[:event]
          when 'charge.success'
            PaystackEquity::WebhookHandler.new(event[:data]).handle_charge_success
          when 'transfer.success'
            PaystackEquity::WebhookHandler.new(event[:data]).handle_transfer_success
          else
            Rails.logger.warn "Unhandled equity event: #{event[:event]}"
          end
        end
      end
    end
  end
end