module Api
  module V1
    module Fundraisers
      class CampaignsController < BaseCampaignsController
        private

        def campaign_params
          params_key = params[:equity_campaign] ? :equity_campaign : :campaign
          
          params.require(params_key).permit(
            # Common fields
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date,
            :category, :location, :currency, :currency_code, :currency_symbol, :status, :media,
            :accept_donations, :leave_words_of_support, :appear_in_search_results,
            :suggested_fundraiser_lists, :receive_donation_email, :receive_daily_summary,
            :is_public, :enable_promotions, :schedule_promotion, :promotion_frequency,
            :promotion_duration,
            
            # Equity-specific fields
            :valuation, :equity_offered, :minimum_investment, :maximum_investment,
            :company_name, :company_description, :company_headquarters, 
            :company_website, :contract_term
          ).tap do |whitelisted|
            # Set the type based on params key
            if action_name == 'create' || params[params_key][:type]
              whitelisted[:type] = params_key == :equity_campaign ? 'EquityCampaign' : 'Campaign'
            end
            
            # Convert numeric fields
            [:valuation, :equity_offered, :minimum_investment, :maximum_investment].each do |field|
              whitelisted[field] = whitelisted[field].to_f if whitelisted[field]
            end
          end
        end
      end
    end
  end
end