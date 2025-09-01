# app/controllers/api/v1/fundraisers/donations_controller.rb
module Api
  module V1
    module Fundraisers
      class DonationsController < ApplicationController
        before_action :authenticate_request, only: %i[index create send_thank_you_emails]
        before_action :set_campaign, only: [:public_donations, :create]

        def public_donations
          donations = @campaign.donations.successful

          donors = donations.map do |donation|
            {
              full_name: donation.full_name || 'Anonymous',
              amount: donation.gross_amount,
              email: donation.email,
              date: donation.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              status: donation.status
            }
          end

          paginated_donors = Kaminari.paginate_array(donors)
                                     .page(params[:page] || 1)
                                     .per(params[:per_page] || 10)

          render json: {
            donations: paginated_donors,
            pagination: pagination_data(paginated_donors)
          }, status: :ok
        end

        def index
          campaigns = Campaign.where(fundraiser_id: @current_user.id)
          donations = Donation.where(campaign_id: campaigns.pluck(:id))
                              .order(created_at: :desc)
                              .page(params[:page] || 1)
                              .per(params[:per_page] || 10)

          render json: {
            donations: donations,
            pagination: pagination_data(donations)
          }, status: :ok
        end

        def create
          validation_result = validate_donation
          unless validation_result[:valid]
            return render json: {
              success: false,
              error: validation_result[:message],
              validationErrors: validation_result[:errors]
            }, status: :unprocessable_entity
          end

          ActiveRecord::Base.transaction do
            donation = @campaign.donations.new(donation_params)
            donation.status = Donation::STATUS_PENDING
            donation.full_name = donation.full_name.presence || 'Anonymous'
            donation.user_id = @current_user&.id

            if donation.user_id.nil?
              anonymous_token = SecureRandom.uuid
              donation.metadata[:anonymous_token] = anonymous_token
            end

            secure_random_uuid = SecureRandom.uuid
            campaign_identifier = @campaign.slug || @campaign.id
            redirect_url = Rails.application.routes.url_helpers.campaign_url(
              campaign_identifier, host: 'bantuhive.com'
            ) + "?#{secure_random_uuid}"

            metadata = build_metadata(donation, redirect_url)

            initialize_payment(donation, metadata, redirect_url)
          end
        rescue StandardError => e
          render json: { success: false, error: e.message }, status: :unprocessable_entity
        end

        def send_thank_you_emails
          campaign = Campaign.find_by(id: params[:campaign_id])
          return render json: { error: 'Campaign not found' }, status: :not_found unless campaign

          donations = if params[:filter] == 'all'
                        campaign.donations.successful
                      else
                        campaign.donations.successful.where(id: params[:donor_ids])
                      end

          donations.each do |donation|
            ThankYouEmailService.send_thank_you_email(
              donation.email,
              donation.full_name || 'Anonymous',
              campaign.fundraiser.full_name,
              campaign.fundraiser.profile.avatar_url,
              campaign.title,
              campaign.currency.upcase,
              donation.gross_amount.to_f.round(2)
            )
          end

          render json: { message: 'Thank you emails sent successfully' }, status: :ok
        end

        private

        def donation_params
          params.require(:donation).permit(
            :amount, :transaction_reference, :email, :full_name, :phone, :plan,
            metadata: {}
          )
        end

        def validate_donation
          return { valid: false, message: 'Invalid campaign', errors: { base: ['Invalid campaign'] } } unless @campaign

          subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)
          unless subaccount&.subaccount_code.present?
            return {
              valid: false,
              message: 'Fundraiser does not meet requirements for raising funds',
              errors: { base: ['Missing subaccount'] },
              code: 'MISSING_ACCOUNT_NUMBER'
            }
          end

          { valid: true }
        end

        def build_metadata(donation, redirect_url)
          {
            user_id: donation.user_id,
            campaign_id: donation.campaign_id,
            anonymous_token: donation.metadata[:anonymous_token],
            donor_name: donation.full_name,
            redirect_url: redirect_url,
            title: @campaign.title,
            goal_amount: @campaign.goal_amount,
            current_amount: @campaign.current_amount,
            currency: @campaign.currency,
            currency_symbol: @campaign.currency_symbol,
            fundraiser_id: @campaign.fundraiser_id,
            fundraiser_name: @campaign.fundraiser.full_name,
            phone: donation.phone,
            email: donation.email,
            plan: donation.plan,
            extra_metadata: params[:donation][:metadata]
          }
        end

        def initialize_payment(donation, metadata, redirect_url)
          subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)

          paystack_service = PaystackService.new
          response = paystack_service.initialize_transaction(
            email: donation.email,
            amount: (donation.amount.to_f * 100).to_i, # ✅ Paystack requires amount in kobo/pesewas
            plan: donation.plan,
            callback_url: redirect_url,
            metadata: metadata,
            subaccount: subaccount.subaccount_code,
            currency: @campaign.currency.upcase
          )

          if response[:status]
            donation.update!(
              transaction_reference: response[:data][:reference],
              status: Donation::STATUS_INITIALIZED,
              metadata: metadata
            )

            render json: {
              success: true,
              data: {
                authorization_url: response[:data][:authorization_url],
                redirect_url: redirect_url,
                donation: donation,
                total_donors: @campaign.total_donors
              }
            }, status: :created
          else
            donation.update!(status: Donation::STATUS_FAILED)
            render json: { success: false, error: response[:message] }, status: :unprocessable_entity
          end
        end

        def set_campaign
          campaign_identifier = params[:campaign_id] || params[:id]
          @campaign = if campaign_identifier&.match?(/[a-zA-Z\-]/)
                        Campaign.find_by(slug: campaign_identifier)
                      else
                        Campaign.find_by(id: campaign_identifier)
                      end
          render json: { error: 'Campaign not found' }, status: :not_found unless @campaign
        end

        def pagination_data(paginated_records)
          {
            current_page: paginated_records.current_page,
            total_pages: paginated_records.total_pages,
            per_page: paginated_records.limit_value,
            total_count: paginated_records.total_count
          }
        end
      end
    end
  end
end
