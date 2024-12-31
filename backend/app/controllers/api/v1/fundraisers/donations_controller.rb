module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index create]
        before_action :set_campaign, only: [:public_donations]

        # Public donations list for a campaign
        def public_donations
          # Fetch donations related to the specified campaign and filter by successful status
          donations = @campaign.donations.successful

          # Format donation data with user info or 'Anonymous' for anonymous donations
          donors = donations.map do |donation|
            {
              full_name: donation.full_name || "Anonymous",  # If user exists, show their name; otherwise show 'Anonymous'
              amount: donation.gross_amount,
              email: donation.email,
              date: donation.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
          end

          # Paginate the donations
          page = params[:page] || 1
          per_page = params[:per_page] || 10
          paginated_donors = Kaminari.paginate_array(donors).page(page).per(per_page)

          # Prepare pagination info
          pagination = {
            current_page: paginated_donors.current_page,
            total_pages: paginated_donors.total_pages,
            per_page: paginated_donors.limit_value,
            total_count: paginated_donors.total_count
          }

          # Render donations along with pagination data
          render json: { donations: paginated_donors, pagination: pagination }, status: :ok
        end

        # fetch donations for a fundraiser
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

          subaccount = Subaccount.find_by(user_id: campaign.fundraiser_id)
          Rails.logger.info "Subaccount: #{subaccount.inspect}"
        
          # Ensure subaccount exists and has a valid subaccount code
          if subaccount.nil? || subaccount.subaccount_code.blank?
            return render json: { error: 'Fundraiser does not meet requirememnts for raising funds.' }, status: :unprocessable_entity
          end
        
          subaccount_code = subaccount.subaccount_code
        
          # Create a new donation
          donation = Donation.new(donation_params)
          donation.campaign_id = campaign.id
          donation.status = 'pending'
        
          if @current_user
            donation.user_id = @current_user.id
          else
            donation.metadata[:session_token] = request.session.id  # Use Rails session ID
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
            fundraiser_name: campaign.fundraiser.full_name
          }

          redirect_url = Rails.application.routes.url_helpers.campaign_url(campaign.id, host: 'bantuhive.com')
          donation.email = params[:donation][:email]
          donation.amount = params[:donation][:amount]
          donation.full_name = params[:donation][:full_name]
          donation.phone = params[:donation][:phone]
        
          metadata = { 
            user_id: donation.user_id, # ID of the authenticated donor
            campaign_id: donation.campaign_id,
            session_token: donation.metadata[:session_token], # Only for anonymous users
            donor_name: donation.full_name,
            redirect_url: redirect_url,
            campaign_metadata: donation.metadata[:campaign],
            phone: donation.phone
          }
        
          donation.plan = params[:donation][:plan]
        
          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            plan: donation.plan,
            metadata: metadata, # metadata that has the donor info
            subaccount: subaccount_code # subaccount code of fundraiser
          )
        
          if response[:status] == true
            donation.transaction_reference = response[:data][:reference]
            donation.subscription_code = donation.plan if donation.plan.present?
        
            if donation.save
              render json: {
                authorization_url: response[:data][:authorization_url],
                redirect_url: redirect_url,  # Include the redirect URL
                donation: donation,
                total_donors: campaign.total_donors
              }, status: :created
            else
              Rails.logger.info "Donation creation failed: #{donation.errors.full_messages.join(', ')}"
              render json: { error: 'Donation creation failed: ' + donation.errors.full_messages.join(', ') }, status: :unprocessable_entity
            end
          else
            Rails.logger.info "Payment initialization failed: #{response[:message]}"
            render json: { error: 'Payment initialization failed: ' + response[:message] }, status: :unprocessable_entity
          end
        end      
        
        private

        def donation_params
          params.require(:donation).permit(:amount, :transaction_reference, :email, :full_name, :phone, :plan, metadata: {})
        end
        
        # Set the campaign based on the campaign_id parameter
        def set_campaign
          @campaign = Campaign.find_by(id: params[:campaign_id])
          if @campaign.nil?
            render json: { error: 'Campaign not found' }, status: :not_found
          end
        end
      end
    end
  end
end