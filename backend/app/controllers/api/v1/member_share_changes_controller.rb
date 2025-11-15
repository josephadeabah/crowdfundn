# app/controllers/api/v1/member_share_changes_controller.rb
module Api
  module V1
    class MemberShareChangesController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership

      # GET /api/v1/investment_clubs/:investment_club_id/share_changes
      def index
        # Get share changes for all members (admin only)
        if @club.is_admin?(@current_user)
          share_changes = MemberShareChange.joins(:investment_club_membership)
                                          .where(investment_club_memberships: { investment_club_id: @club.id })
                                          .includes(:investment_club_membership, :investment_club_contribution)
                                          .order(created_at: :desc)
                                          .page(params[:page])
                                          .per(params[:per_page] || 5)
        else
          # Regular members can only see their own changes
          membership = @club.membership_for(@current_user)
          share_changes = membership.member_share_changes
                                   .includes(:investment_club_contribution)
                                   .order(created_at: :desc)
                                   .page(params[:page])
                                   .per(params[:per_page] || 5)
        end

        render json: {
          share_changes: share_changes.map { |sc| MemberShareChangeSerializer.new(sc, include_details: true).as_json },
          pagination: {
            current_page: share_changes.current_page,
            total_pages: share_changes.total_pages,
            total_count: share_changes.total_count,
            per_page: share_changes.limit_value
          }
        }
      end

      # GET /api/v1/investment_clubs/:investment_club_id/share_changes/my_changes
      def my_changes
        membership = @club.membership_for(@current_user)
        
        share_changes = membership.member_share_changes
                                 .includes(:investment_club_contribution)
                                 .order(created_at: :desc)
                                 .page(params[:page])
                                 .per(params[:per_page] || 5)

        render json: {
          share_changes: share_changes.map { |sc| MemberShareChangeSerializer.new(sc, include_details: true).as_json },
          pagination: {
            current_page: share_changes.current_page,
            total_pages: share_changes.total_pages,
            total_count: share_changes.total_count,
            per_page: share_changes.limit_value
          },
          summary: {
            total_changes: share_changes.total_count,
            current_share: membership.contributed_share,
            total_contributed: membership.total_contributed
          }
        }
      end

      private

      def set_club
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        render json: { error: 'Club not found' }, status: :not_found unless @club
      end

      def verify_membership
        render json: { error: 'Club membership required' }, status: :forbidden unless @club.is_member?(@current_user)
      end
    end
  end
end