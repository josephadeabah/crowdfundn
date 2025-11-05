# app/controllers/api/v1/club_memberships_controller.rb
module Api
  module V1
    class ClubMembershipsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_admin_access, only: [:update, :destroy]

      def index
        memberships = @club.investment_club_memberships.includes(:user)
        
        render json: {
          members: memberships.map { |m| ClubMembershipSerializer.new(m).as_json }
        }
      end

      def create
        # For public clubs, users can join directly
        # For private clubs, users need invitation/approval
        
        if @club.private? && !params[:invitation_token]
          return render json: { error: 'Invitation required for private club' }, status: :forbidden
        end

        membership = @club.investment_club_memberships.new(
          user: @current_user,
          role: 'member',
          status: @club.public? ? 'active' : 'pending'
        )

        if membership.save
          # Send notification to club admins for pending memberships
          notify_admins_of_pending_member(membership) if membership.pending?
          
          render json: { 
            success: true, 
            membership: ClubMembershipSerializer.new(membership).as_json 
          }, status: :created
        else
          render json: { 
            success: false, 
            errors: membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      def update
        membership = @club.investment_club_memberships.find(params[:id])
        
        if membership.update(membership_params)
          # Notify user of status change
          notify_member_of_status_change(membership) if membership.saved_change_to_status?
          
          render json: { 
            success: true, 
            membership: ClubMembershipSerializer.new(membership).as_json 
          }
        else
          render json: { 
            success: false, 
            errors: membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      def destroy
        membership = @club.investment_club_memberships.find(params[:id])
        
        # Prevent creator from leaving without transferring ownership
        if membership.creator? && @club.investment_club_memberships.admin.count == 1
          return render json: { 
            error: 'Cannot leave club as the only admin. Transfer ownership first.' 
          }, status: :unprocessable_entity
        end

        if membership.destroy
          # Handle member's investment shares redistribution
          redistribute_member_shares(membership.user) if membership.active?
          
          render json: { success: true }
        else
          render json: { 
            success: false, 
            errors: membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def set_club
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        render json: { error: 'Club not found' }, status: :not_found unless @club
      end

      def verify_admin_access
        render json: { error: 'Admin access required' }, status: :forbidden unless @club.is_admin?(@current_user)
      end

      def membership_params
        params.require(:membership).permit(:role, :status)
      end

      def notify_admins_of_pending_member(membership)
        @club.admin_members.each do |admin|
          ClubMailer.pending_member_notification(admin, membership).deliver_later
        end
      end

      def notify_member_of_status_change(membership)
        ClubMailer.membership_status_changed(membership.user, membership).deliver_later
      end

      def redistribute_member_shares(user)
        # Redistribute the leaving member's investment shares to remaining members
        member_shares = MemberInvestmentShare.where(user: user)
        
        member_shares.each do |share|
          club_investment = share.club_investment
          remaining_members = @club.active_members.where.not(id: user.id)
          
          if remaining_members.any?
            share_per_member = share.share_percentage / remaining_members.count
            
            remaining_members.each do |member|
              existing_share = MemberInvestmentShare.find_or_initialize_by(
                user: member,
                club_investment: club_investment
              )
              
              new_share_percentage = existing_share.share_percentage.to_f + share_per_member
              existing_share.update!(
                share_percentage: new_share_percentage,
                effective_shares: (new_share_percentage / 100) * club_investment.shares_acquired.to_f
              )
            end
          end
          
          share.destroy
        end
      end
    end
  end
end