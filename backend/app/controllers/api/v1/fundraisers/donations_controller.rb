module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index create]

        def index
          if @current_user.nil?
            return render json: { error: 'You need to log in to access donations.' }, status: :unauthorized
          end
          
          page = params[:page] || 1
          per_page = params[:per_page] || 10
          
          campaigns = Campaign.where(fundraiser_id: @current_user.id)
          
          donations = Donation.where(status: 'successful')
                              .where('user_id IS NULL OR user_id = ?', @current_user.id)
                              .where(campaign_id: campaigns.pluck(:id))
                              .order(created_at: :desc)
                              .page(page)
                              .per(per_page)
          
          pagination = {
            current_page: donations.current_page,
            total_pages: donations.total_pages,
            per_page: donations.limit_value,
            total_count: donations.total_count
          }
          
          render json: { donations: donations, pagination: pagination }, status: :ok
        end

        def create
          campaign = Campaign.find_by(id: params[:campaign_id])
          unless campaign
            return render json: { error: 'The campaign you are trying to donate to no longer exists.' }, status: :not_found
          end

          # Create a new donation
          donation = Donation.new(donation_params)
          donation.campaign_id = campaign.id
          donation.status = 'pending'

          # Assign user_id if authenticated, otherwise generate a session token for anonymous users
          if @current_user
            donation.user_id = @current_user.id
          else
            session_token = SecureRandom.hex(16) # Generate session token for anonymous users
            donation.metadata[:session_token] = session_token
          end

          # Add campaign details to donation metadata
          donation.metadata[:campaign] = {
            id: campaign.id,
            title: campaign.title,
            description: campaign.description.to_plain_text,
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            currency: campaign.currency,
            currency_symbol: campaign.currency_symbol,
            fundraiser_id: campaign.fundraiser_id,
            fundraiser_name: campaign.fundraiser.full_name,
            campaign: campaign # Include the full campaign object for email notifications
          }

          # Prepare metadata for Paystack initialization
          metadata = { 
            user_id: donation.metadata[:campaign][:fundraiser_id], 
            campaign_id: donation.campaign_id,
            session_token: donation.metadata[:session_token], # Only for anonymous users
            campaign: donation.metadata[:campaign]
          }

          donation.plan = params[:donation][:plan]

          # Initialize transaction with Paystack
          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            plan: donation.plan,
            metadata: metadata
          )

          if response[:status] == true
            donation.transaction_reference = response[:data][:reference]
            if donation.save
              total_donors = campaign.total_donors
              render json: {
                authorization_url: response[:data][:authorization_url],
                donation: donation,
                total_donors: total_donors
              }, status: :created
            else
              render json: { error: 'Donation creation failed: ' + donation.errors.full_messages.join(', ') }, status: :unprocessable_entity
            end
          else
            render json: { error: 'Payment initialization failed: ' + response[:message] }, status: :unprocessable_entity
          end
        end        
        
        private

        def donation_params
          params.require(:donation).permit(:amount, :transaction_reference, :email, :full_name, :phone, :plan, metadata: {})
        end        
      end
    end
  end
end