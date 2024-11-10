module Api
    module V1
      module Fundraisers
        class DonationsController < ApplicationController
          def create
            donation = Donation.new(donation_params)
            donation.campaign_id = params[:campaign_id]
            donation.user_id = @current_user&.id # Authenticated user, if available
            donation.status = 'pending'
  
            # Initialize transaction with Paystack
            response = initialize_paystack_transaction(donation)
  
            if response[:status] == 'success'
              donation.transaction_reference = response[:data][:reference]
              donation.save
  
              render json: { authorization_url: response[:data][:authorization_url], donation: donation }, status: :created
            else
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
  
          def verify
            donation = Donation.find_by(transaction_reference: params[:reference])
            return render json: { error: 'Donation not found' }, status: :not_found unless donation
  
            response = verify_paystack_transaction(donation.transaction_reference)
  
            if response[:status] == 'success' && response[:data][:status] == 'success'
              donation.update(status: 'successful', amount: response[:data][:amount] / 100.0)
              render json: { message: 'Donation successful', donation: donation }, status: :ok
            else
              donation.update(status: 'failed')
              render json: { error: 'Donation verification failed' }, status: :unprocessable_entity
            end
          end
  
          private
  
          def donation_params
            # Permitting only the attributes that belong to the Donation model
            params.require(:donation).permit(:amount, :transaction_reference, metadata: {})
          end
          
  
          def initialize_paystack_transaction(donation)
            donor_email = donation.user&.email || params[:email]
          
            if donor_email.blank?
              return { status: 'error', message: 'Email address is required' }
            end
          
            url = URI("https://api.paystack.co/transaction/initialize")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
          
            request = Net::HTTP::Post.new(url)
            request["Authorization"] = "Bearer #{ENV['PAYSTACK_PRIVATE_KEY']}"
            request["Content-Type"] = "application/json"
          
            request.body = {
              email: donor_email,  # Use the email from the user or the request params
              amount: (donation.amount * 100).to_i, # Convert amount to kobo (smallest unit)
              reference: SecureRandom.uuid,
              metadata: {
                user_id: donation.user_id,
                campaign_id: donation.campaign_id
              }
            }.to_json
          
            response = http.request(request)
            JSON.parse(response.body, symbolize_names: true)
          end
          
  
          def verify_paystack_transaction(reference)
            url = URI("https://api.paystack.co/transaction/verify/#{reference}")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
  
            request = Net::HTTP::Get.new(url)
            request["Authorization"] = "Bearer #{ENV['PAYSTACK_PRIVATE_KEY']}"
  
            response = http.request(request)
            JSON.parse(response.body, symbolize_names: true)
          end
        end
      end
    end
end
  