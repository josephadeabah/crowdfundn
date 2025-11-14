# app/controllers/api/v1/approved_campaigns_controller.rb
module Api
  module V1
    class ApprovedCampaignsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club

      # GET /api/v1/investment_clubs/:investment_club_id/approved_campaigns
      def index
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          approved_campaigns = portfolio_service.approved_campaigns
          
          render json: {
            success: true,
            approved_campaigns: approved_campaigns
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # GET /api/v1/investment_clubs/:investment_club_id/approved_campaigns/:id
      def show
        approved_campaign = ApprovedCampaign.find_by(
          id: params[:id],
          investment_club: @club
        )
        
        if approved_campaign && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          
          render json: {
            success: true,
            approved_campaign: portfolio_service.approved_campaigns.find { |ac| ac[:id] == approved_campaign.id }
          }
        else
          render json: { 
            success: false,
            error: 'Approved campaign not found or access denied' 
          }, status: :not_found
        end
      end

      private

      def set_club
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        unless @club
          render json: { 
            success: false,
            error: 'Club not found' 
          }, status: :not_found
        end
      end
    end
  end
end