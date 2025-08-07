module Api
  module V1
    module Equity
      class CampaignsController < Api::V1::BaseCampaignsController
        before_action :set_campaign, only: [:submit_for_approval, :approve, :reject, :launch, :close]
        
        def submit_for_approval
          if @campaign.submit_for_approval
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot submit campaign for approval",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def approve
          if @campaign.approve
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot approve campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end

        def reject
          if @campaign.reject
            render json: campaign_json(@campaign), status: :ok
          else
            render json: { 
              error: "Cannot reject campaign",
              errors: @campaign.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
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