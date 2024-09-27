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
          render json: @campaign, include: [:updates, :comments], status: :ok
        end

        # POST /api/v1/fundraisers/campaigns
        def create
          @campaign = Campaign.new(campaign_params)
          if @campaign.save
            attach_media_files
            render json: @campaign, status: :created
          else
            render json: { errors: @campaign.errors.full_messages }, status: :unprocessable_entity
          end
        end

          # PUT /api/v1/fundraisers/campaigns/:id
        def update
          if @campaign.update(campaign_params)
            attach_media_files
            render json: @campaign, status: :ok
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
            :category, :fundraiser_id, :fundraiser_name, :contact_information, :location,
            :payment_methods, :currency, :currency_code, :currency_symbol, :status,
            media_files: [] # Allows multiple media files to be uploaded
          )
        end
      # Attach media files to the campaign
      def attach_media_files
        if params[:campaign][:media_files].present?
          params[:campaign][:media_files].each do |media|
            @campaign.media_files.attach(media)
          end
      end

      end
    end
  end
end
