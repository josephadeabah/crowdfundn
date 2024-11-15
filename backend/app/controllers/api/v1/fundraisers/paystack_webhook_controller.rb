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
            # Parse the incoming JSON payload from Paystack
            event = JSON.parse(payload, symbolize_names: true)

            # Handle the different event types
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
            else
              Rails.logger.warn "Unhandled event type: #{event[:event]}"
              render json: { error: 'Unhandled event type' }, status: :unprocessable_entity
            end

          else
            render json: { error: 'Invalid signature' }, status: :forbidden
          end

          # Respond to Paystack to acknowledge receipt
          head :ok
        end

        private

        # Handle charge success event
        def handle_charge_success(data)
          transaction_reference = data[:reference]
          Rails.logger.debug "Processing charge success: #{transaction_reference}"

          donation = Donation.find_by(transaction_reference: transaction_reference)

          if donation
            paystack_service = PaystackService.new
            response = paystack_service.verify_transaction(transaction_reference)

            if response[:status] == true
              transaction_status = response[:data][:status]
              if transaction_status == 'success'
                gross_amount = response[:data][:amount] / 100.0
                net_amount = gross_amount * 0.985  # Assuming 1.5% platform fee

                # Update donation with the transaction details
                donation.update(status: 'successful', gross_amount: gross_amount, net_amount: net_amount, amount: net_amount)

                # Create the platform fee record
                Balance.create(amount: gross_amount - net_amount, description: "Platform fee for donation #{donation.id}", status: "pending")

                # Update the campaign with the total donations
                campaign = donation.campaign
                total_donations = campaign.donations.where(status: 'successful').sum(:net_amount)
                campaign.update(current_amount: total_donations)

                render json: { message: 'Donation successful', donation: donation, total_donations: total_donations, campaign: campaign }, status: :ok
              else
                donation.update(status: transaction_status)
                render json: { error: "Donation failed: #{transaction_status}" }, status: :unprocessable_entity
              end
            else
              donation.update(status: 'failed')
              render json: { error: 'Transaction verification failed' }, status: :unprocessable_entity
            end
          else
            render json: { error: 'Donation not found' }, status: :not_found
          end
        end

        # Handle charge failed event
        def handle_charge_failed(data)
          transaction_reference = data[:reference]
          Rails.logger.debug "Processing charge failed: #{transaction_reference}"

          # You can handle charge failures here, for example, updating donation status
          donation = Donation.find_by(transaction_reference: transaction_reference)
          if donation
            donation.update(status: 'failed')
            render json: { message: "Donation failed for transaction: #{transaction_reference}" }, status: :unprocessable_entity
          else
            render json: { error: 'Donation not found' }, status: :not_found
          end
        end

        # Handle transfer success event
        def handle_transfer_success(data)
          # Handle transfer-related actions here
          Rails.logger.debug "Processing transfer success: #{data[:reference]}"
          # You can log the transfer or update relevant records like payout or platform fees
          render json: { message: "Transfer success: #{data[:reference]}" }, status: :ok
        end

        # Handle balance updated event
        def handle_balance_updated(data)
          Rails.logger.debug "Processing balance update: #{data}"
          # Here you can update your internal balance tracking, etc.
          render json: { message: "Balance updated: #{data[:balance]}" }, status: :ok
        end

        # Handle subscription create event
        def handle_subscription_create(data)
          Rails.logger.debug "Processing subscription create: #{data[:subscription_code]}"
          # Update subscription records or trigger actions based on the subscription data
          render json: { message: "Subscription created: #{data[:subscription_code]}" }, status: :ok
        end
      end
    end
  end
end
