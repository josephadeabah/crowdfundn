module Api
    module V1
      module Fundraisers
        class CampaignSharesController < ApplicationController
          before_action :authenticate_request # Ensure user is authenticated
          before_action :set_campaign, only: [:create]
  
          def create
            # Create a new CampaignShare record (no points_awarded needed)
            @current_user.campaign_shares.create!(campaign: @campaign)
  
            # Return updated share count & user points
            render json: {
              message: "Campaign shared successfully!",
              total_shares: @campaign.total_shares, # Counts all shares for this campaign
              user_points: @current_user.total_points # User's total points
            }, status: :ok
          rescue ActiveRecord::RecordInvalid => e
            render json: { error: e.message }, status: :unprocessable_entity
          end
  
          private
  
          def set_campaign
            @campaign = Campaign.find(params[:campaign_id])
          rescue ActiveRecord::RecordNotFound
            render json: { error: "Campaign not found" }, status: :not_found
          end
        end
      end
    end
end
  