module Api
    module V1
      module Fundraisers
        class CampaignSharesController < ApplicationController
          before_action :authenticate_request
          before_action :set_campaign, only: [:create]
  
          def create
            campaign_share = nil
          
            if @current_user
              # Authenticated user share
              campaign_share = @current_user.campaign_shares.create(campaign: @campaign)
              if campaign_share.errors.any?
                render json: { error: campaign_share.errors.full_messages.join(", ") }, status: :unprocessable_entity
                return
              end
            else
              # Anonymous user share
              campaign_share = CampaignShare.create!(campaign: @campaign, user_id: nil) # Ensure user_id is nil for anonymous shares
            end
          
            # Prepare response data
            response = {
              message: "Campaign shared successfully!",
              total_shares: @campaign.total_shares, # Counts all shares for this campaign
            }
          
            # Only include user_points if the share was created by a logged-in user
            if campaign_share.user.present?
              points_awarded = 0.25 # Make sure this matches the value in `award_share_points`
              response[:user_points] = points_awarded
            end
          
            render json: response, status: :ok
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
  