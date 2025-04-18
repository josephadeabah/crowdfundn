# app/controllers/api/v1/equity/campaigns_controller.rb
module Api
  module V1
    module Equity
      class CampaignsController < BaseCampaignsController
        def launch
          if @campaign.may_launch? && @campaign.launch!
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot launch campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def close
          if @campaign.may_close? && @campaign.close!
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot close campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end