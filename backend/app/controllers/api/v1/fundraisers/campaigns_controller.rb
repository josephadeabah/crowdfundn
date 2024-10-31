module Api
  module V1
    module Fundraisers
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: %i[create update destroy my_campaigns]
        before_action :set_campaign, only: %i[show update destroy]
        before_action :authorize_campaign_user!, only: %i[update destroy]  # Ensure user authorization for these actions

        def index
          @campaigns = Campaign.all
          render json: @campaigns, status: :ok
        end

        def show
          render json: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media_url), status: :ok
        end

        def my_campaigns
          @campaigns = @current_user.campaigns
          render json: @campaigns, status: :ok
        end

        # POST /api/v1/fundraisers/campaigns
        def create
          @campaign = @current_user.campaigns.new(campaign_params)
          if params[:media].present?
            @campaign.media.attach(params[:media])
            set_media_content_disposition(@campaign.media)
          end

          if @campaign.save
            render json: {
              message: 'Campaign created successfully',
              campaign: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media_url)
            }, status: :created
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/fundraisers/campaigns/:id
        def update
          if @campaign.update(campaign_params)
            # Update media if a new file is provided
            if params[:media].present?
              @campaign.media.attach(params[:media])
              set_media_content_disposition(@campaign.media)
            end
            render json: @campaign.as_json(include: %i[rewards updates comments]).merge(media: @campaign.media), status: :ok
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @campaign.destroy
          head :no_content
        end

        private

        def set_media_content_disposition(media)
          s3 = Aws::S3::Resource.new
          object = s3.bucket(Rails.application.credentials.dig(:digitalocean, :bucket)).object(media.key)
          object.copy_from(object.bucket.name + '/' + object.key, {
                             metadata_directive: 'REPLACE',
                             content_disposition: 'inline',
                             acl: 'public-read'
                           })
        end

        def set_campaign
          @campaign = Campaign.includes(:rewards, :updates, :comments, fundraiser: :profile).find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end
        

        def authorize_campaign_user!
          authorize_user!(@campaign)  # Call the authorization method
        end

        def campaign_params
          params.require(:campaign).permit(
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date,
            :category, :location, :currency, :currency_code, :currency_symbol, :status, :media,
            :accept_donations, :leave_words_of_support, :appear_in_search_results,
            :suggested_fundraiser_lists, :receive_donation_email, :receive_daily_summary,
            :is_public, :enable_promotions, :schedule_promotion, :promotion_frequency,
            :promotion_duration
          )
        end
      end
    end
  end
end
