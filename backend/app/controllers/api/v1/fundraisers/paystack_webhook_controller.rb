module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController

        def receive
          # Read the raw request body (Paystack sends the event data in the request body)
          payload = request.body.read

          # Extract the signature from the request headers
          signature = request.headers['X-Paystack-Signature']

          # Verify the webhook signature (Paystack sends a signature in headers)
          paystack_service = PaystackService.new
          if paystack_service.verify_paystack_signature(payload, signature)
            begin
              # Parse the incoming JSON payload from Paystack
              event = JSON.parse(payload, symbolize_names: true)
              handle_event(event)
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

          # Respond to Paystack to acknowledge receipt
          head :ok
        end

        private

        def handle_event(event)
          case event[:event]
          when 'charge.success'
            handle_charge_success(event[:data])
          when 'charge.failed'
            handle_charge_failed(event[:data])
          when 'transfer.success'
            handle_transfer_success(event[:data])
          when 'balance.updated'
            handle_balance_updated(event[:data])
          when 'subscription.create'
            handle_subscription_create(event[:data])
          when 'subscription.disabled'
            handle_subscription_disabled(event[:data])
          when 'subscription.charge.failed'
            handle_subscription_charge_failed(event[:data])
          else
            Rails.logger.warn "Unhandled event type: #{event[:event]}"
            render json: { error: 'Unhandled event type' }, status: :unprocessable_entity
          end
        end

        # Handle charge success event
        def handle_charge_success(data)
          transaction_reference = data[:reference]
          subscription_code = data[:subscription_code]
          Rails.logger.debug "Processing charge success: #{transaction_reference} or subscription #{subscription_code}"

          ActiveRecord::Base.transaction do
            handle_donation_success(transaction_reference) if transaction_reference.present?
            handle_subscription_success(subscription_code) if subscription_code.present?
          end
        rescue StandardError => e
          Rails.logger.error "Error processing charge success: #{e.message}"
          render json: { error: 'Error processing charge success' }, status: :unprocessable_entity
        end

        def handle_donation_success(transaction_reference)
          donation = Donation.find_by(transaction_reference: transaction_reference)
          raise "Donation not found" unless donation

          response = PaystackService.new.verify_transaction(transaction_reference)
          raise "Transaction verification failed" unless response[:status] == true

          transaction_status = response[:data][:status]
          if transaction_status == 'success'
            gross_amount = response[:data][:amount] / 100.0
            net_amount = gross_amount * 0.985
            donation.update!(status: 'successful', gross_amount: gross_amount, net_amount: net_amount, amount: net_amount)

            Balance.create!(
              amount: gross_amount - net_amount,
              description: "Platform fee for donation #{donation.id}",
              status: 'pending'
            )

            campaign = donation.campaign
            campaign.update!(
              current_amount: campaign.donations.where(status: 'successful').sum(:net_amount)
            )
          else
            donation.update!(status: transaction_status)
            raise "Transaction status is #{transaction_status}"
          end
        end

        def handle_subscription_success(subscription_code)
          subscription = Subscription.find_by(subscription_code: subscription_code)
          raise "Subscription not found" unless subscription

          subscription.update!(status: 'active')
        end

        # Handle charge failed event
        def handle_charge_failed(data)
          transaction_reference = data[:reference]
          subscription_code = data[:subscription_code]
          Rails.logger.debug "Processing charge failed: #{transaction_reference} or subscription #{subscription_code}"

          handle_donation_failure(transaction_reference) if transaction_reference.present?
          handle_subscription_failure(subscription_code) if subscription_code.present?
        end

        def handle_donation_failure(transaction_reference)
          donation = Donation.find_by(transaction_reference: transaction_reference)
          if donation
            donation.update!(status: 'failed')
          else
            Rails.logger.error "Donation not found for transaction: #{transaction_reference}"
          end
        end

        def handle_subscription_failure(subscription_code)
          subscription = Subscription.find_by(subscription_code: subscription_code)
          if subscription
            subscription.update!(status: 'failed')
          else
            Rails.logger.error "Subscription not found: #{subscription_code}"
          end
        end

        # Handle transfer success event
        def handle_transfer_success(data)
          Rails.logger.debug "Processing transfer success: #{data[:reference]}"
          # Handle transfer logic here
          render json: { message: "Transfer success: #{data[:reference]}" }, status: :ok
        end

        # Handle balance updated event
        def handle_subscription_create(data)
          subscription_code = data[:subscription_code]
          email = data[:customer][:email]
          plan = data[:plan]
          authorization = data[:authorization]
          metadata = data[:metadata]  # Metadata should contain user_id and campaign_id
        
          # Extract user_id and campaign_id from metadata
          user_id = metadata[:user_id]
          campaign_id = metadata[:campaign_id]
        
          unless user_id && campaign_id
            Rails.logger.error "Missing user_id or campaign_id in metadata: #{metadata}"
            render json: { error: 'Invalid subscription metadata' }, status: :unprocessable_entity
            return
          end
        
          # Find associated user and campaign using user_id and campaign_id from metadata
          user = User.find_by(id: user_id)
          campaign = Campaign.find_by(id: campaign_id)
        
          unless user && campaign
            Rails.logger.error "User or campaign not found. User ID: #{user_id}, Campaign ID: #{campaign_id}"
            render json: { error: 'User or campaign not found' }, status: :not_found
            return
          end
        
          # Create subscription on Paystack (if needed)
          paystack_service = PaystackService.new
          response = paystack_service.create_subscription(
            email: email,
            plan: plan,
            authorization: authorization
          )
        
          if response[:status] == false || response[:data].blank?
            Rails.logger.error "Failed to create subscription on Paystack. Response: #{response}"
            render json: { error: 'Failed to create subscription on Paystack' }, status: :unprocessable_entity
            return
          end
        
          # Create the subscription record in the local database
          subscription = Subscription.create!(
            user: user,
            campaign: campaign,
            subscription_code: subscription_code,
            email_token: data[:email_token],
            status: 'active'
          )
        
          render json: { message: "Subscription created successfully for User #{user.id} on Campaign #{campaign.id}", subscription: subscription }, status: :ok
        rescue ActiveRecord::RecordInvalid => e
          Rails.logger.error "Failed to create subscription: #{e.message}"
          render json: { error: 'Failed to create subscription' }, status: :unprocessable_entity
        end        
        
        
        # Handle subscription charge failed event
        def handle_subscription_charge_failed(data)
          subscription_code = data[:subscription_code]
          Rails.logger.debug "Processing subscription charge failed: #{subscription_code}"

          subscription = Subscription.find_by(subscription_code: subscription_code)
          if subscription
            subscription.update!(status: 'failed')
          else
            Rails.logger.error "Subscription not found: #{subscription_code}"
          end
        end

        # Handle subscription disabled event
        def handle_subscription_disabled(data)
          subscription_code = data[:subscription_code]
          email_token = data[:email_token]

          paystack_service = PaystackService.new
          response = paystack_service.cancel_subscription(
            subscription_code: subscription_code,
            email_token: email_token
          )

          if response[:status]
            subscription = Subscription.find_by(subscription_code: subscription_code)
            if subscription
              subscription.update!(status: 'inactive')
              render json: { message: "Subscription disabled successfully: #{subscription_code}" }, status: :ok
            else
              render json: { error: 'Subscription not found' }, status: :not_found
            end
          else
            Rails.logger.error "Failed to disable subscription: #{response[:message]}"
            render json: { error: "Subscription disabling failed: #{response[:message]}" }, status: :unprocessable_entity
          end
        end

      end
    end
  end
end
