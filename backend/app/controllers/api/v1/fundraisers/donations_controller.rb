module Api
    module V1
      module Fundraisers
        class DonationsController < ApplicationController
          before_action :authenticate_request, only: %i[index]
        # Fetch donations for the current authenticated user
        def index
          if @current_user.nil?
            return render json: { error: 'User not authenticated' }, status: :unauthorized
          end
          # Get the page number from params[:page], default to 1 if not present
          page = params[:page] || 1
          
          # Get the number of items per page, default to 10 if not provided
          per_page = params[:per_page] || 10
          
          # Fetch paginated donations with status 'successful'
          donations = @current_user.donations.where(status: 'successful')
                                              .page(page)
                                              .per(per_page)

          render json: donations, status: :ok
        end

        
        def create
          campaign = Campaign.find_by(id: params[:campaign_id])
          unless campaign
            return render json: { error: 'Campaign not found' }, status: :not_found
          end
          
          donation = Donation.new(donation_params)
          donation.campaign_id = campaign.id
          donation.status = 'pending'
          donation.user_id = @current_user&.id
          
          donation.metadata[:campaign] = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description.to_plain_text,
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            fundraiser_id: campaign.fundraiser_id,
            fundraiser_name: campaign.fundraiser.full_name
          }
          
          response = initialize_paystack_transaction(donation)
          
          if response[:status] == true
            donation.transaction_reference = response[:data][:reference]
            if donation.save
              total_donors = campaign.total_donors  # Fetch the total donors here
              render json: { 
                authorization_url: response[:data][:authorization_url], 
                donation: donation,
                total_donors: total_donors 
              }, status: :created
            else
              render json: { error: donation.errors.full_messages.join(", ") }, status: :unprocessable_entity
            end
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end         
  
        def verify
          donation = Donation.find_by(transaction_reference: params[:id])
          if donation.nil?
            return render json: { error: 'Donation not found' }, status: :not_found
          end
          
          response = verify_paystack_transaction(donation.transaction_reference)
          
          if response[:status] == true && response[:data][:status] == 'success'
            donation.update(status: 'successful', amount: response[:data][:amount] / 100.0)
            campaign = donation.campaign
            total_donations = campaign.donations.where(status: 'successful').sum(:amount)
            campaign.update(current_amount: total_donations)
            fundraiser = campaign.fundraiser
            total_donors = campaign.total_donors  # Fetch the total donors here

            render json: {
              message: 'Donation successful',
              donation: donation,
              total_donors: total_donors,  # Return total donors
              campaign: campaign,
              total_donations: total_donations,
              fundraiser: { id: fundraiser.id, name: fundraiser.full_name, profile: fundraiser.profile }
            }, status: :ok
          else
            donation.update(status: 'failed')
            render json: { error: 'Donation verification failed' }, status: :unprocessable_entity
          end
        end          
                         
  
          private
  
          def donation_params
            params.require(:donation).permit(:amount, :transaction_reference, :email, :full_name, :phone, metadata: {})
          end          
  
          def initialize_paystack_transaction(donation)
            # Get the donor's email either from the authenticated user or from the provided email
            donor_email = donation.email
  
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
  