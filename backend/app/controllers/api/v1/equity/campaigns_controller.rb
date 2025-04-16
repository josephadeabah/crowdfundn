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

        private

        def campaign_params
          params.require(:equity_campaign).permit(
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date, 
            :category, :location, :currency, :valuation, :equity_offered, :minimum_investment,
            :media, :equity_status
          )
        end

        def campaign_json(campaign)
          super.merge(
            shares_available: campaign.shares_available,
            percentage_raised: campaign.percentage_raised,
            total_investors: campaign.equity_investments.count,
            equity_status: campaign.equity_status
          )
        end
      end
    end
  end
end