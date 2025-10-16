module Api
  module V1
    module Fundraisers
      class CampaignsController < BaseCampaignsController
        private

        def campaign_params
          params_key = params[:equity_campaign] ? :equity_campaign : :campaign

          params.require(params_key).permit(
            # Add slug to common fields
            :title, :slug, :description, :goal_amount, :current_amount, :start_date, :end_date,
            :category, :location, :currency, :currency_code, :currency_symbol, :status, :media,
            :accept_donations, :leave_words_of_support, :appear_in_search_results,
            :suggested_fundraiser_lists, :receive_donation_email, :receive_daily_summary,
            :is_public, :enable_promotions, :schedule_promotion, :promotion_frequency,
            :promotion_duration,
            # Equity-specific fields
            :valuation, :equity_offered, :minimum_investment, :maximum_investment,
            :company_name, :company_description, :company_headquarters,
            :company_website, :contract_term, :total_shares,
            # New equity offering fields
            :minimum_target, :price_per_share, :min_shares, :max_shares,
            :shares_offered, :stock_type, :funding_round, :sec_filing_url,
            :offering_circular_url, :offering_memorandum,
            # Only offering_memorandum_document is a file attachment
            :offering_memorandum_document,
          ).tap do |whitelisted|
            # Set the type based on params key
            if action_name == 'create' || params[params_key][:type]
              whitelisted[:type] = params_key == :equity_campaign ? 'EquityCampaign' : 'Campaign'
            end

            # Convert numeric fields
            numeric_fields = %i[
              valuation equity_offered minimum_investment maximum_investment total_shares
              minimum_target price_per_share min_shares max_shares shares_offered
            ]
            
            numeric_fields.each do |field|
              if whitelisted[field]
                # For integer fields, convert to integer, for decimal fields convert to float
                if [:min_shares, :max_shares, :shares_offered].include?(field)
                  whitelisted[field] = whitelisted[field].to_i
                else
                  whitelisted[field] = whitelisted[field].to_f
                end
              end
            end
          end
        end
      end
    end
  end
end