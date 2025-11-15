module Api
  module V1
    class MemberShareChangesController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership

      # GET /api/v1/investment_clubs/:investment_club_id/share_changes
      def index
        # All members can see changes for all members
        share_changes = MemberShareChange.joins(:investment_club_membership)
                                        .where(investment_club_memberships: { investment_club_id: @club.id })
                                        .includes(:investment_club_membership, :investment_club_contribution)
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