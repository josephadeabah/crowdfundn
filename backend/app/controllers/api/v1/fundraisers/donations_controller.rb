module Api
    module V1
      module Fundraisers
        class DonationsController < ApplicationController
          def create
            # Find the campaign based on the campaign_id provided
            campaign = Campaign.find_by(id: params[:campaign_id])
            unless campaign
              return render json: { error: 'Campaign not found' }, status: :not_found
            end
  
            # Create a new donation with the provided parameters
            donation = Donation.new(donation_params)
            
            # Set the campaign_id and status
            donation.campaign_id = campaign.id
            donation.status = 'pending'
  
            # Set user_id if authenticated, otherwise it will be nil
            donation.user_id = @current_user&.id
  
            # Initialize Paystack transaction with the donation details
            response = initialize_paystack_transaction(donation)
  
            if response[:status] == true
              # Only save the donation if Paystack transaction initialization is successful
              donation.transaction_reference = response[:data][:reference]
  
              if donation.save
                # Return the authorization URL and donation details on success
                render json: { authorization_url: response[:data][:authorization_url], donation: donation }, status: :created
              else
                # Log and return any validation errors from the donation save
                Rails.logger.error("Donation save failed: #{donation.errors.full_messages}")
                render json: { error: donation.errors.full_messages.join(", ") }, status: :unprocessable_entity
              end
            else
              # Log the error and return a message if Paystack initialization fails
              Rails.logger.error("Paystack initialization failed: #{response[:message]}")
              render json: { error: response[:message] }, status: :unprocessable_entity
            end
          end
  
          def verify
            # Log to confirm which reference is being processed
            Rails.logger.debug("Verifying donation with reference: #{params[:id]}")
          
            # Find the donation by its transaction reference
            donation = Donation.find_by(transaction_reference: params[:id])
          
            # If the donation is not found, return a 404 error
            if donation.nil?
              Rails.logger.error("Donation not found with reference: #{params[:id]}")
              return render json: { error: 'Donation not found' }, status: :not_found
            end
          
            # Verify the Paystack transaction
            response = verify_paystack_transaction(donation.transaction_reference)
          
            # Log the response from Paystack for debugging
            Rails.logger.debug("Paystack verification response: #{response}")
          
            # Check if the transaction was successful on Paystack
            if response[:status] == true && response[:data][:status] == 'success'
              # Update the donation status and amount
              donation.update(status: 'successful', amount: response[:data][:amount] / 100.0)
          
              # Check if the update was successful
              if donation.errors.any?
                Rails.logger.error("Error updating donation: #{donation.errors.full_messages}")
                return render json: { error: donation.errors.full_messages.join(", ") }, status: :unprocessable_entity
              end
          
              render json: { message: 'Donation successful', donation: donation }, status: :ok
            else
              # Mark the donation as failed if Paystack verification fails
              donation.update(status: 'failed')
          
              # Check if the update was successful
              if donation.errors.any?
                Rails.logger.error("Error updating donation status to 'failed': #{donation.errors.full_messages}")
                return render json: { error: donation.errors.full_messages.join(", ") }, status: :unprocessable_entity
              end
          
              render json: { error: 'Donation verification failed' }, status: :unprocessable_entity
            end
          end        
  
          private
  
          def donation_params
            # Permit donation attributes and metadata, but not the user_id (it's optional)
            params.require(:donation).permit(:amount, :transaction_reference, :email, metadata: {})
          end
  
          def initialize_paystack_transaction(donation)
            # Get the donor's email either from the authenticated user or from the provided email
            donor_email = donation.user&.email || params[:email]
  
            if donor_email.blank?
              return { status: 'error', message: 'Email address is required' }
            end
  
            # Initialize the Paystack transaction
            url = URI("https://api.paystack.co/transaction/initialize")
            http = Net::HTTP.new(url.host, url.port)
            http.use_ssl = true
  
            request = Net::HTTP::Post.new(url)
            request["Authorization"] = "Bearer #{ENV['PAYSTACK_PRIVATE_KEY']}"
            request["Content-Type"] = "application/json"
  
            request.body = {
              email: donor_email,  # Use the email from the user or from params
              amount: (donation.amount * 100).to_i,  # Convert amount to kobo (smallest unit)
              reference: SecureRandom.uuid,
              metadata: {
                user_id: donation.user_id,  # user_id can be nil
                campaign_id: donation.campaign_id
              }
            }.to_json
  
            response = http.request(request)
            parsed_response = JSON.parse(response.body, symbolize_names: true)
  
            # Log the Paystack response for debugging
            Rails.logger.debug("Paystack response: #{parsed_response}")
  
            parsed_response
          end
  
          def verify_paystack_transaction(reference)
            # Verify the Paystack transaction status
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
  