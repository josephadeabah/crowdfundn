module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController
        # skip_before_action :verify_authenticity_token # Disable CSRF protection for API requests

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
                # Call your verify method to update the donation status
                response = paystack_service.verify_transaction(transaction_reference)

                if response[:status] == true
                  transaction_status = response[:data][:status]
                  if transaction_status == 'success'
                    # Proceed with marking the donation as successful
                    donation.update(status: 'successful', amount: response[:data][:amount] / 100.0)
                    # Optionally, update campaign, create balances, etc.
                  else
                    donation.update(status: 'failed')
                  end
                else
                  # If Paystack verification failed, update the donation status as failed
                  donation.update(status: 'failed')
                end
              end
            end
          else
            render json: { error: 'Invalid signature' }, status: :forbidden
            return
          end

          # Respond to Paystack to acknowledge receipt
          head :ok
        end
      end
    end
  end
end
