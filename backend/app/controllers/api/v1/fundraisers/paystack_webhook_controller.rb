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
            
            # Route to appropriate handler based on metadata type
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
            if metadata[:type] == 'premium_subscription' || metadata[:premium_plan_id]
              Rails.logger.info "Routing to PremiumSubscriptionHandler for subscription.create"
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              Rails.logger.info "Ignoring subscription.create event for non-premium subscription"
            end

          when 'subscription.disable', 'subscription.not_renew'
            metadata = event[:data][:metadata] || {}
            if metadata[:type] == 'premium_subscription' || metadata[:premium_plan_id]
              Rails.logger.info "Routing to PremiumSubscriptionHandler for #{event_type}"
              PaystackWebhook::PremiumSubscriptionHandler.new(event[:data]).call
            else
              Rails.logger.info "Ignoring #{event_type} event for non-premium subscription"
            end

          else
            Rails.logger.warn "Unhandled event type: #{event_type}"
          end

          EventProcessed.create(event_id: event_id)
          Rails.logger.info "Event processing completed successfully"
        rescue => e
          Rails.logger.error "Error processing webhook event: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          raise e
        end
      end
    end
  end
end