module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index send_thank_you_emails]
        before_action :set_campaign, only: [:public_donations, :create]
        before_action :validate_subaccount, only: [:create]

        # Public donations list for a campaign
        def public_donations
          donations = @campaign.donations.successful
                              .order(created_at: :desc)
          
          formatted_donations = donations.map do |donation|
            {
              id: donation.id,
              full_name: donation.anonymous? ? 'Anonymous' : donation.full_name,
              amount: donation.gross_amount,
              email: donation.anonymous? ? '' : donation.email,
              date: donation.created_at.iso8601,
              status: donation.status,
              anonymous: donation.anonymous?
            }
          end

          paginate_donations(formatted_donations)
        end

        # Fetch donations for a fundraiser
        def index
          return unauthorized_error unless @current_user

          campaigns = Campaign.where(fundraiser_id: @current_user.id)
          donations = Donation.where(campaign_id: campaigns.pluck(:id))
                              .order(created_at: :desc)
          
          paginate_donations(donations)
        end

        def create
          # Build donation but don't save it yet (transaction_reference is required)
          donation = build_donation
          
          # Initialize payment first to get transaction reference
          payment_response = initialize_payment(donation)
          
          if payment_response[:status]
            # Now we have transaction_reference, update donation and save
            update_donation_for_success(donation, payment_response)
            
            if donation.save
              render_success_response(donation, payment_response)
            else
              render json: { 
                error: 'Donation creation failed after payment initialization', 
                details: donation.errors.full_messages 
              }, status: :unprocessable_entity
            end
          else
            # Payment initialization failed, create a failed donation record
            donation.status = Donation::STATUS_FAILED
            donation.save(validate: false) # Skip validation for failed donations
            
            render_payment_error(payment_response)
          end
        end

        def send_thank_you_emails
          campaign = Campaign.find_by(id: params[:campaign_id])
          return not_found_error('Campaign') unless campaign

          donations = fetch_donations_for_thank_you(campaign)
          
          donations.each do |donation|
            ThankYouEmailService.send_thank_you_email(
              donation.email,
              donation.full_name || 'Anonymous',
              campaign.fundraiser.full_name,
              campaign.fundraiser.profile&.avatar_url,
              campaign.title,
              campaign.currency.upcase,
              donation.gross_amount.to_f.round(2)
            )
          end

          render json: { message: 'Thank you emails sent successfully' }, status: :ok
        end

        private

        def build_donation
          donation = Donation.new(donation_params)
          donation.campaign = @campaign
          donation.status = Donation::STATUS_PENDING
          
          # Handle anonymous donation
          if params[:donation][:anonymous] == true || params[:donation][:anonymous] == 'true'
            donation.anonymous = true
            donation.full_name = 'Anonymous'
            anonymous_token = SecureRandom.uuid
            donation.metadata = (donation.metadata || {}).merge(anonymous_token: anonymous_token)
          else
            donation.full_name = params[:donation][:full_name].presence
            donation.anonymous = false
          end
          # ADD THIS LINE: Associate user if logged in (for non-anonymous donations)
          donation.user = @current_user if @current_user && !donation.anonymous?
          
          donation.email = params[:donation][:email]
          donation.amount = params[:donation][:amount]
          donation.phone = params[:donation][:phone]
          donation.plan = params[:donation][:plan]
          
          donation
        end

        def initialize_payment(donation)
          paystack_service = PaystackService.new
          
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            plan: donation.plan,
            callback_url: generate_redirect_url(donation.campaign),
            metadata: build_metadata(donation),
            subaccount: @subaccount.subaccount_code, # Use the subaccount code from the validated subaccount
            currency: donation.campaign.currency.upcase
          )
        end

        def build_metadata(donation)
          campaign = donation.campaign
          fundraiser = campaign.fundraiser
          
          # Build comprehensive metadata like the original version
          metadata = {
            user_id: donation.user_id,
            campaign_id: donation.campaign_id,
            donor_name: donation.full_name,
            redirect_url: generate_redirect_url(campaign),
            title: campaign.title,
            goal_amount: campaign.goal_amount,
            current_amount: campaign.current_amount,
            currency: campaign.currency,
            currency_symbol: campaign.currency_symbol,
            fundraiser_id: campaign.fundraiser_id,
            fundraiser_name: campaign.fundraiser.full_name,
            phone: donation.phone,
            anonymous: donation.anonymous?,
            anonymous_token: donation.metadata&.[]('anonymous_token')
          }
          
          # Merge with existing metadata if any, but avoid deep nesting
          if donation.metadata.is_a?(Hash)
            metadata = metadata.merge(donation.metadata)
          end

          metadata
        end

        def generate_redirect_url(campaign)
          secure_random_uuid = SecureRandom.uuid
          campaign_identifier = campaign.slug || campaign.id
          Rails.application.routes.url_helpers.campaign_url(
            campaign_identifier, 
            host: 'bantuhive.com'
          ) + "?#{secure_random_uuid}"
        end

        def update_donation_for_success(donation, response)
          donation.transaction_reference = response[:data][:reference]
          donation.subscription_code = donation.plan if donation.plan.present?
          donation.status = Donation::STATUS_INITIALIZED
        end

        def update_donation_for_failure(donation)
          donation.status = Donation::STATUS_FAILED
        end

        def render_success_response(donation, response)
          render json: {
            authorization_url: response[:data][:authorization_url],
            redirect_url: generate_redirect_url(donation.campaign),
            donation: donation.as_json(except: [:created_at, :updated_at]),
            total_donors: donation.campaign.total_donors
          }, status: :created
        end

        def render_payment_error(response)
          render json: { 
            error: 'Payment initialization failed', 
            message: response[:message] 
          }, status: :unprocessable_entity
        end

        def set_campaign
          campaign_identifier = params[:campaign_id] || params[:id]
          
          if campaign_identifier && campaign_identifier.match?(/[a-zA-Z\-]/)
            @campaign = Campaign.find_by(slug: campaign_identifier)
          else
            @campaign = Campaign.find_by(id: campaign_identifier)
          end
          
          not_found_error('Campaign') unless @campaign
        end

        def validate_subaccount
          @subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)
          return if @subaccount&.subaccount_code.present?

          render json: { 
            error: 'Fundraiser does not meet requirements for raising funds.' 
          }, status: :unprocessable_entity
        end

        def donation_params
          params.require(:donation).permit(
            :amount, 
            :email, 
            :full_name, 
            :phone, 
            :plan,
            :anonymous,
            metadata: {}
          )
        end

        def paginate_donations(donations)
          page = params[:page] || 1
          per_page = params[:per_page] || 10
          
          paginated = Kaminari.paginate_array(donations).page(page).per(per_page)
          
          render json: {
            donations: paginated,
            pagination: {
              current_page: paginated.current_page,
              total_pages: paginated.total_pages,
              per_page: paginated.limit_value,
              total_count: paginated.total_count
            }
          }, status: :ok
        end

        def fetch_donations_for_thank_you(campaign)
          if params[:filter] == 'all'
            campaign.donations.successful
          else
            campaign.donations.successful.where(id: params[:donor_ids])
          end
        end

        def not_found_error(resource)
          render json: { error: "#{resource} not found" }, status: :not_found
        end

        def unauthorized_error
          render json: { error: 'You need to log in to access donations.' }, status: :unauthorized
        end
      end
    end
  end
end