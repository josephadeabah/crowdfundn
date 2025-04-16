# app/controllers/api/v1/fundraisers/campaigns_controller.rb
module Api
  module V1
    module Fundraisers
      class CampaignsController < BaseCampaignsController
        private

        def campaign_params
          params.require(:campaign).permit(
            :title, :description, :goal_amount, :current_amount, :start_date, :end_date,
            :category, :location, :currency, :currency_code, :currency_symbol, :status, :media,
            :accept_donations, :leave_words_of_support, :appear_in_search_results,
            :suggested_fundraiser_lists, :receive_donation_email, :receive_daily_summary,
            :is_public, :enable_promotions, :schedule_promotion, :promotion_frequency,
            :promotion_duration
          )
        end
      end
    end
  end
end