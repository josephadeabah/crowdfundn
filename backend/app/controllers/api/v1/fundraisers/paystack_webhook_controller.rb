module Api
  module V1
    module Fundraisers
      class PaystackWebhookController < ApplicationController
        skip_before_action :verify_authenticity_token # Disable CSRF protection for API requests

        # This endpoint will receive webhook notifications
        def receive
          # Get the request body (Paystack sends the event data in the request body)
          payload = request.body.read

          # Verify the webhook signature (Paystack sends a signature in headers)
          if verify_paystack_signature(payload)
            # Parse the incoming JSON payload from Paystack
            event = JSON.parse(payload, symbolize_names: true)

            # Check if the event is of type "charge.success"
            if event[:event] == 'charge.success'
              transaction_reference = event[:data][:reference]
              donation = Donation.find_by(transaction_reference: transaction_reference)

              if donation
                # Call your verify method to update the donation status
                paystack_service = PaystackService.new
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

        private

        # Verify Paystack's webhook signature (using the signature in headers)
        def verify_paystack_signature(payload)
          secret_key = ENV['PAYSTACK_SECRET_KEY']
          signature = request.headers['X-Paystack-Signature']

          # Create the hash to verify the signature
          expected_signature = OpenSSL::HMAC.hexdigest('sha512', secret_key, payload)

          # Compare the signatures
          signature == expected_signature
        end
      end
    end
  end
end
