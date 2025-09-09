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
              render json: { error: 'Unexpected error occurred' }, status: :internal_server_error
            end
          else
            Rails.logger.error "Signature verification failed"
            render json: { error: 'Invalid signature' }, status: :forbidden
          end
        end

        private

        def handle_event(event)
          event_id = event[:data][:id]
          event_type = event[:event]
          metadata = event.dig(:data, :metadata) || {}
          
          Rails.logger.info "=== WEBHOOK EVENT RECEIVED ==="
          Rails.logger.info "Event: #{event_type}, ID: #{event_id}"
          Rails.logger.info "Metadata: #{metadata.inspect}"
          
          # Check for duplicate event
          if EventProcessed.exists?(event_id: event_id)
            Rails.logger.info "Event already processed: #{event_id}"
            return
          end

          case event_type
          when 'charge.success'
            Rails.logger.info "Processing charge.success event"
            
            # Route to appropriate handler based on metadata
            if metadata[:premium_access]
              Rails.logger.info "Routing to PremiumSubscriptionHandler for charge.success"
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call(:charge_success)
            else
              Rails.logger.info "Routing to ChargeSuccessHandler"
              PaystackWebhook::ChargeSuccessHandler.new(event[:data]).call
            end

          when 'charge.failed'
            Rails.logger.info "Processing charge.failed event"
            PaystackWebhook::ChargeFailedHandler.new(event[:data]).call

          when 'transfer.success'
            Rails.logger.info "Processing transfer.success event"
            PaystackWebhook::TransferSuccessHandler.new(event[:data]).call

          when 'transfer.failed'
            Rails.logger.info "Processing transfer.failed event"
            PaystackWebhook::TransferFailedHandler.new(event[:data]).call

          when 'transfer.reversed'
            Rails.logger.info "Processing transfer.reversed event"
            PaystackWebhook::TransferReversedHandler.new(event[:data]).call

          when 'subscription.create'
            Rails.logger.info "Processing subscription.create event"
            PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_create)

          when 'subscription.disable', 'subscription.not_renew'
            Rails.logger.info "Processing #{event_type} event"
            PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call(:subscription_disable)

          when 'subscription.charge.failed'
            Rails.logger.info "Processing subscription.charge.failed event"
            PaystackWebhook::SubscriptionChargeFailedHandler.new(event[:data]).call

          when 'refund.processed'
            Rails.logger.info "Processing refund.processed event"
            if metadata[:type] == 'equity_investment'
              PaystackWebhook::Handlers::RefundProcessedHandler.new(data: event[:data]).call
            else
              PaystackWebhook::Handlers::DonationRefundHandler.new(data: event[:data]).call
            end

          else
            Rails.logger.warn "Unhandled event type: #{event_type}"
          end

          EventProcessed.create(event_id: event_id)
          Rails.logger.info "Event processing completed successfully"
        rescue => e
          Rails.logger.error "Error processing webhook event: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          # Don't raise the error again to prevent returning 500 to Paystack
          # Paystack will retry if we don't return 200
        end
      end
    end
  end
end