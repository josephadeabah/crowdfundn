module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController

        # This endpoint will receive webhook notifications
        def receive
          # Get the request body (Paystack sends the event data in the request body)
          payload = request.body.read

          # Extract the signature from the request headers
          signature = request.headers['X-Paystack-Signature']

          # Verify the webhook signature (Paystack sends a signature in headers)
          paystack_service = PaystackService.new
          if paystack_service.verify_paystack_signature(payload, signature)
            # Parse the incoming JSON payload from Paystack
            event = JSON.parse(payload, symbolize_names: true)

            # Check if the event is of type "charge.success"
            if event[:event] == 'charge.success'
              transaction_reference = event[:data][:reference]
              donation = Donation.find_by(transaction_reference: transaction_reference)

              if donation
                # Verify the transaction status from Paystack
                response = paystack_service.verify_transaction(transaction_reference)

                if response[:status] == true
                  transaction_status = response[:data][:status]

                  case transaction_status
                  when 'success'
                    # Proceed with marking the donation as successful
                    gross_amount = response[:data][:amount] / 100.0
                    net_amount = gross_amount * 0.985  # Assuming 1.5% platform fee

                    # Update donation with the transaction details
                    donation.update(
                      status: 'successful',
                      gross_amount: gross_amount,
                      net_amount: net_amount,
                      amount: net_amount
                    )

                    # Create the balance record (platform fee)
                    Balance.create(
                      amount: gross_amount - net_amount,
                      description: "Platform fee for donation #{donation.id}",
                      status: "pending"
                    )

                    # Update the campaign with the total donations
                    campaign = donation.campaign
                    total_donations = campaign.donations.where(status: 'successful').sum(:net_amount)
                    campaign.update(current_amount: total_donations)

                    # Respond with success message
                    render json: {
                      message: 'Donation successful',
                      transaction_status: transaction_status,
                      donation: donation,
                      total_donations: total_donations,
                      campaign: campaign
                    }, status: :ok

                  when 'failed', 'abandoned', 'reversed'
                    # Update the donation status if failed
                    donation.update(status: transaction_status)

                    render json: {
                      error: "Donation #{transaction_status}. Please try again later.",
                      transaction_status: transaction_status
                    }, status: :unprocessable_entity

                  when 'ongoing', 'pending', 'processing', 'queued'
                    # If the donation is still in progress
                    donation.update(status: transaction_status)

                    render json: {
                      message: "Donation is #{transaction_status}. Please complete the required actions.",
                      transaction_status: transaction_status
                    }, status: :accepted

                  else
                    # If an unknown status is returned
                    donation.update(status: 'unknown')

                    render json: {
                      error: 'Donation verification returned an unknown status. Please contact support.',
                      transaction_status: transaction_status
                    }, status: :unprocessable_entity
                  end

                else
                  # If Paystack verification failed
                  donation.update(status: 'failed')
                  render json: { error: 'Donation verification failed. Please try again later.' }, status: :unprocessable_entity
                end
              else
                render json: { error: 'Donation not found.' }, status: :not_found
              end
            else
              render json: { error: 'Invalid event type.' }, status: :unprocessable_entity
            end
          else
            render json: { error: 'Invalid signature' }, status: :forbidden
          end

          # Respond to Paystack to acknowledge receipt
          head :ok
        end
      end
    end
  end
end
