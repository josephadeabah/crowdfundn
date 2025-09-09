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
            
            # ✅ FIXED: Check the type field to determine the handler
            case metadata[:type]
              when 'premium_subscription'
                Rails.logger.info "Routing to PremiumSubscriptionHandler"
                PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
              when 'equity_investment'
                Rails.logger.info "Routing to ChargeSuccessHandler"
                PaystackWebhook::ChargeSuccessHandler.new(event[:data]).call
              else
                Rails.logger.info "Routing to ChargeSuccessHandler (default)"
                PaystackWebhook::ChargeSuccessHandler.new(event[:data]).call
            end

          when 'subscription.create'
            metadata = event[:data][:metadata] || {}
            # ✅ Only process premium subscription creates
            if metadata[:type] == 'premium_subscription' || metadata[:premium_plan_id]
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              Rails.logger.info "Ignoring subscription.create event for non-premium subscription"
            end

          when 'subscription.disable', 'subscription.not_renew'
            metadata = event[:data][:metadata] || {}
            # ✅ Only process premium subscription disables
            if metadata[:type] == 'premium_subscription' || metadata[:premium_plan_id]
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              Rails.logger.info "Ignoring subscription.disable event for non-premium subscription"
            end

          when 'charge.failed'
            PaystackWebhook::ChargeFailedHandler.new(event[:data]).call

          when 'transfer.success'
            PaystackWebhook::TransferSuccessHandler.new(event[:data]).call

          when 'transfer.failed'
            PaystackWebhook::TransferFailedHandler.new(event[:data]).call

          when 'transfer.reversed'
            PaystackWebhook::TransferReversedHandler.new(event[:data]).call

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

      end
    end
  end
end