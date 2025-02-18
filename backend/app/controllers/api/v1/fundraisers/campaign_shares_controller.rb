module Api
  module V1
    module Fundraisers
      class CampaignSharesController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: [:create]

        def create
          if @current_user
            campaign_share = @current_user.campaign_shares.create(campaign: @campaign)
            if campaign_share.errors.any?
              render json: { error: campaign_share.errors.full_messages.join(', ') }, status: :unprocessable_entity
              return
            end
          else
            CampaignShare.create!(campaign: @campaign, user_id: nil) # Anonymous share
          end

          render json: {
            message: 'Campaign shared successfully!',
            total_shares: @campaign.total_shares # Counts all shares for this campaign
          }, status: :ok
        rescue ActiveRecord::RecordInvalid => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        private

        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end
      end
    end
  end
end
