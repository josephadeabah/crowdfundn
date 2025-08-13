module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index create send_thank_you_emails]
        before_action :set_campaign, only: [:public_donations]

        def public_donations
          donations = @campaign.donations.successful

          donors = donations.map do |donation|
            {
              full_name: donation.full_name || 'Anonymous',
              amount: donation.gross_amount,
              email: donation.email,
              date: donation.created_at.strftime('%Y-%m-%d %H:%M:%S')
            }
          end

          paginated_donors = Kaminari.paginate_array(donors).page(params[:page]).per(params[:per_page] || 10)

          render json: { 
            donations: paginated_donors, 
            pagination: pagination_data(paginated_donors) 
          }, status: :ok
        end

        def create
          campaign = Campaign.find_by(id: params[:campaign_id])
          return render_not_found('Campaign') unless campaign

          subaccount = Subaccount.find_by(user_id: campaign.fundraiser_id)
          return render_subaccount_error unless valid_subaccount?(subaccount)

          donation = initialize_donation(campaign)
          return render_donation_error(donation) unless donation.save

          response = initialize_payment(donation, subaccount.subaccount_code)
          handle_payment_response(response, donation, campaign)
        end

        def send_thank_you_emails
          campaign = Campaign.find_by(id: params[:campaign_id])
          return render json: { error: 'Campaign not found' }, status: :not_found unless campaign

          # Fetch donations based on the filter
          donations = if params[:filter] == 'all'
                        campaign.donations.successful
                      else
                        campaign.donations.successful.where(id: params[:donor_ids])
                      end

          # Send thank you emails to donors
          donations.each do |donation|
            ThankYouEmailService.send_thank_you_email(
              donation.email,
              donation.full_name || 'Anonymous',
              campaign.fundraiser.full_name,
              campaign.fundraiser.profile.avatar_url,
              campaign.title,
              campaign.currency.upcase,
              donation.gross_amount.to_f.round(2))
          end

          render json: { message: 'Thank you emails sent successfully' }, status: :ok
        end

        private

        def initialize_donation(campaign)
          Donation.new(donation_params).tap do |d|
            d.campaign_id = campaign.id
            d.status = 'pending'
            d.full_name = params[:donation][:full_name].presence || 'Anonymous'
            d.user_id = @current_user.id if @current_user
            set_anonymous_token(d) unless @current_user
            set_donation_attributes(d, campaign)
          end
        end

        def set_anonymous_token(donation)
          donation.metadata[:anonymous_token] = SecureRandom.uuid
        end

        def set_donation_attributes(donation, campaign)
          donation.email = params[:donation][:email]
          donation.amount = params[:donation][:amount]
          donation.phone = params[:donation][:phone]
          donation.metadata = params[:donation][:metadata] || {}
          donation.metadata[:type] = 'donation' # Explicit type
        end

        def initialize_payment(donation, subaccount_code)
          metadata = build_metadata(donation)
          PaystackService.new.initialize_transaction(
            email: donation.email,
            amount: donation.amount,
            callback_url: generate_redirect_url(donation.campaign),
            metadata: metadata,
            subaccount: subaccount_code
          )
        end

        def build_metadata(donation)
          {
            user_id: donation.user_id,
            campaign_id: donation.campaign_id,
            anonymous_token: donation.metadata[:anonymous_token],
            donor_name: donation.full_name,
            title: donation.campaign.title,
            type: 'donation', # Explicit type for webhook routing
            currency: donation.campaign.currency,
            fundraiser_id: donation.campaign.fundraiser_id
          }.merge(donation.metadata)
        end

        def generate_redirect_url(campaign)
          "#{Rails.application.routes.url_helpers.campaign_url(campaign.slug || campaign.id, host: 'bantuhive.com')}?#{SecureRandom.uuid}"
        end

        def handle_payment_response(response, donation, campaign)
          if response[:status]
            donation.update(transaction_reference: response[:data][:reference])
            render json: payment_success_response(response, donation, campaign), status: :created
          else
            render json: { error: "Payment initialization failed: #{response[:message]}" }, 
                   status: :unprocessable_entity
          end
        end

        def payment_success_response(response, donation, campaign)
          {
            authorization_url: response[:data][:authorization_url],
            redirect_url: generate_redirect_url(campaign),
            donation: donation,
            total_donors: campaign.total_donors
          }
        end

        def render_not_found(resource)
          render json: { error: "#{resource} not found" }, status: :not_found
        end

        def render_subaccount_error
          render json: { error: 'Fundraiser does not meet requirements for raising funds' }, 
                 status: :unprocessable_entity
        end

        def render_donation_error(donation)
          render json: { error: donation.errors.full_messages.join(', ') }, 
                 status: :unprocessable_entity
        end

        def valid_subaccount?(subaccount)
          subaccount&.subaccount_code.present?
        end

        def donation_params
          params.require(:donation).permit(:amount, :email, :full_name, :phone, :plan, metadata: {})
        end

        def set_campaign
          @campaign = Campaign.find_by(id: params[:campaign_id] || params[:id])
          render_not_found('Campaign') unless @campaign
        end

        def pagination_data(paginated_data)
          {
            current_page: paginated_data.current_page,
            total_pages: paginated_data.total_pages,
            per_page: paginated_data.limit_value,
            total_count: paginated_data.total_count
          }
        end
      end
    end
  end
end