module Api
  module V1
    class ApprovedCampaignsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :set_approved_campaign, only: [:show, :destroy]

      # GET /api/v1/investment_clubs/:investment_club_id/approved_campaigns
      def index
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          
          # Get paginated approved campaigns (3 per page)
          approved_campaigns_data = portfolio_service.approved_campaigns
          page = params[:page]&.to_i || 1
          per_page = 3
          
          # Manual pagination since we're working with array data
          paginated_campaigns = Kaminari.paginate_array(approved_campaigns_data)
                                       .page(page)
                                       .per(per_page)
          
          render json: {
            success: true,
            approved_campaigns: paginated_campaigns,
            pagination: {
              current_page: paginated_campaigns.current_page,
              total_pages: paginated_campaigns.total_pages,
              per_page: paginated_campaigns.limit_value,
              total_count: paginated_campaigns.total_count
            }
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
        if @approved_campaign && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          approved_campaign_data = portfolio_service.approved_campaigns.find { |ac| ac[:id] == @approved_campaign.id }
          
          render json: {
            success: true,
            approved_campaign: approved_campaign_data
          }
        else
          render json: { 
            success: false,
            error: 'Approved campaign not found or access denied' 
          }, status: :not_found
        end
      end

      # DELETE /api/v1/investment_clubs/:investment_club_id/approved_campaigns/:id
      def destroy
        if @approved_campaign && @club.is_admin?(@current_user)
          begin
            @approved_campaign.destroy!
            
            render json: {
              success: true,
              message: 'Approved campaign removed successfully'
            }
          rescue => e
            Rails.logger.error "Failed to delete approved campaign: #{e.message}"
            render json: {
              success: false,
              error: 'Failed to remove approved campaign'
            }, status: :unprocessable_entity
          end
        else
          render json: { 
            success: false,
            error: 'Approved campaign not found or admin access required' 
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

      def set_approved_campaign
        @approved_campaign = ApprovedCampaign.find_by(
          id: params[:id],
          investment_club: @club
        )
      end
    end
  end
end