module Api
    module V1
      module Fundraisers
        class CampaignSharesController < ApplicationController
          before_action :authenticate_request, except: [:create] # Skip authentication for anonymous shares
          before_action :set_campaign, only: [:create]
  
          def create
            if @current_user
              # Authenticated user share
              @current_user.campaign_shares.create!(campaign: @campaign)
            else
              # Anonymous user share
              CampaignShare.create!(campaign: @campaign) # No user association
            end
  
            # Return updated share count & points (if applicable)
            render json: {
              message: "Campaign shared successfully!",
              total_shares: @campaign.total_shares, # Counts all shares for this campaign
              user_points: @current_user.total_points # Only send points for authenticated users
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
  