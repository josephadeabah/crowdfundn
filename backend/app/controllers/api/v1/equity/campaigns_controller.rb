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
            :title, :media, :description, :goal_amount, 
            :start_date, :end_date, :category, :location,
            :current_amount, :currency, :valuation, 
            :equity_offered, :minimum_investment, :maximum_investment,
            :company_name, :company_description, 
            :company_headquarters, :company_website, :contract_term
          ).tap do |whitelisted|
            whitelisted[:valuation] = whitelisted[:valuation].to_f if whitelisted[:valuation]
            whitelisted[:equity_offered] = whitelisted[:equity_offered].to_f if whitelisted[:equity_offered]
            whitelisted[:minimum_investment] = whitelisted[:minimum_investment].to_f if whitelisted[:minimum_investment]
            whitelisted[:maximum_investment] = whitelisted[:maximum_investment].to_f if whitelisted[:maximum_investment]
          end
        end
      end
    end
  end
end