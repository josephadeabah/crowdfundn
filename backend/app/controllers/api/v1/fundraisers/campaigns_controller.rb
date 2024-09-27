module Api
  module V1
    module Fundraisers
      class CampaignsController < ApplicationController
        before_action :authenticate_request, only: [:create, :update, :destroy]
        before_action :set_campaign, only: [:show, :update, :destroy]

        def index
          @campaigns = Campaign.all
          render json: @campaigns, status: :ok
        end

        def show
          render json: @campaign.as_json(include: [:updates, :comments]).merge(media: @campaign.media), status: :ok
        end

        # POST /api/v1/fundraisers/campaigns
        def create
          @campaign = @current_user.campaigns.new(campaign_params)
          if @campaign.save
            render json: @campaign.as_json.merge(media: @campaign.media), status: :created
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/fundraisers/campaigns/:id
        def update
          if @campaign.update(campaign_params)
            render json: @campaign.as_json.merge(media: @campaign.media), status: :ok
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
          )
        end
      end
    end
  end
end
