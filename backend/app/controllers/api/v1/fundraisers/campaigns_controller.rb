module Api
  module V1
    module Fundraisers
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: [:create, :update, :destroy, :my_campaigns]
        before_action :set_campaign, only: [:show, :update, :destroy]

        def index
          @campaigns = Campaign.all
          render json: @campaigns, status: :ok
        end

        def show
          render json: @campaign.as_json(include: [:updates, :comments]).merge(media: @campaign.media), status: :ok
        end

        def my_campaigns
          @campaigns = @current_user.campaigns
          render json: @campaigns, status: :ok
        end
        
        # POST /api/v1/fundraisers/campaigns
        def create
          @campaign = @current_user.campaigns.new(campaign_params)
          # Attach media if present
          @campaign.media.attach(params[:media]) if params[:media].present?

          if @campaign.save
            render json: {
              message: 'Campaign created successfully',
              campaign: @campaign.as_json(include: [:updates, :comments]).merge(media: @campaign.media_url)
            }, status: :created
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/fundraisers/campaigns/:id
        def update
          if @campaign.update(campaign_params)
            render json: @campaign.as_json(include: [:updates, :comments]).merge(media: @campaign.media), status: :ok
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @campaign.destroy
          head :no_content
        end

        private

        def set_campaign
          @campaign = Campaign.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
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
