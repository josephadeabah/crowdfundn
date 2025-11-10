# app/controllers/api/v1/investment_clubs/dashboard_controller.rb
module Api
  module V1
    module InvestmentClubs
      class DashboardController < ApplicationController
        before_action :authenticate_request
        before_action :set_club
        before_action :verify_membership

        def show
          dashboard_data = {
            club: club_basic_info,
            financials: club_financials,
            recent_contributions: recent_contributions,
            recent_investments: recent_investments,
            membership_stats: membership_stats
          }
          
          render json: { success: true, dashboard: dashboard_data }
        end

        private

        def set_club
          @club = InvestmentClub.find_by(slug: params[:investment_club_id])
          render json: { error: 'Club not found' }, status: :not_found unless @club
        end

        def verify_membership
          render json: { error: 'Club membership required' }, status: :forbidden unless @club.is_member?(@current_user)
        end

        def club_basic_info
          {
            id: @club.id,
            name: @club.name,
            slug: @club.slug,
            description: @club.description,
            club_type: @club.club_type,
            status: @club.status,
            created_at: @club.created_at
          }
        end

        def club_financials
          roi_metrics = @club.roi_metrics
          
          {
            total_contributions: roi_metrics[:total_contributions],
            total_invested: roi_metrics[:total_invested],
            current_balance: roi_metrics[:current_balance],
            total_return: roi_metrics[:total_return],
            roi_percentage: roi_metrics[:roi_percentage],
            active_investments: roi_metrics[:active_investments],
            completed_investments: roi_metrics[:completed_investments],
            currency: @club.currency || 'USD'
          }
        end

        def recent_contributions
          @club.investment_club_contributions
               .completed
               .order(created_at: :desc)
               .limit(10)
               .map do |contribution|
            {
              id: contribution.id,
              amount: contribution.amount,
              user_name: contribution.user.full_name,
              date: contribution.created_at,
              status: contribution.status
            }
          end
        end

        def recent_investments
          @club.club_investments
               .executed
               .order(created_at: :desc)
               .limit(10)
               .map do |investment|
            {
              id: investment.id,
              campaign_name: investment.campaign.title,
              investment_amount: investment.investment_amount,
              current_value: investment.current_value,
              date: investment.created_at,
              status: investment.status
            }
          end
        end

        def membership_stats
          {
            total_members: @club.current_members_count,
            active_members: @club.investment_club_memberships.active.count,
            pending_members: @club.investment_club_memberships.pending.count,
            max_members: @club.max_members
          }
        end
      end
    end
  end
end