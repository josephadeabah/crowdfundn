module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index]

        def index
          if @current_user.nil?
            return render json: { error: 'User not authenticated' }, status: :unauthorized
          end
        
          # Get the page number from params[:page], default to 1 if not present
          page = params[:page] || 1
        
          # Get the number of items per page, default to 10 if not provided
          per_page = params[:per_page] || 10
        
          # Fetch all campaigns run by the current user
          campaigns = Campaign.where(fundraiser_id: @current_user.id)
        
          # Fetch donations for those campaigns with status 'successful' and where user_id is either null or matches the current user's id
          donations = Donation.where(status: 'successful')
                              .where('user_id IS NULL OR user_id = ?', @current_user.id)
                              .where(campaign_id: campaigns.pluck(:id)) # Filter by campaigns run by the current user
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

          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            metadata: { user_id: donation.user_id, campaign_id: donation.campaign_id }
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
        
          paystack_service = PaystackService.new
          response = paystack_service.verify_transaction(donation.transaction_reference)
        
          if response[:status] == true && response[:data][:status] == 'success'
            gross_amount = response[:data][:amount] / 100.0
            net_amount = gross_amount * 0.985 # Deducting 1.5% platform fee
        
            donation.update(
              status: 'successful',
              gross_amount: gross_amount,
              net_amount: net_amount,
              amount: net_amount # Keep this if `amount` needs to reflect net for display
            )
            
            # Add platform fee to the Balance table after successful verification
            Balance.create(
              amount: gross_amount - net_amount,
              description: "Platform fee for donation #{donation.id}",
              status: "pending"
            )

        
            campaign = donation.campaign
            total_donations = campaign.donations.where(status: 'successful').sum(:net_amount)
            campaign.update(current_amount: total_donations)
        
            render json: {
              message: 'Donation successful',
              donation: donation,
              total_donations: total_donations,
              campaign: campaign
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
      end
    end
  end
end