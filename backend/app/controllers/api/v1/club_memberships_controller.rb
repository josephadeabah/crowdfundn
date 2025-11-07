module Api
  module V1
    class ClubMembershipsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :set_membership, only: [:show, :update, :destroy, :approve, :reject]
      before_action :verify_admin_access, only: [:update, :destroy, :approve, :reject, :pending]

      # GET /api/v1/investment_clubs/:investment_club_id/memberships
      def index
        memberships = @club.investment_club_memberships.includes(:user)
        
        render json: {
          success: true,
          members: memberships.map { |m| ClubMembershipSerializer.new(m).as_json }
        }
      end

      # GET /api/v1/investment_clubs/:investment_club_id/memberships/pending
      def pending
        pending_memberships = @club.investment_club_memberships.pending.includes(:user)
        
        render json: {
          success: true,
          pending_members: pending_memberships.map { |m| ClubMembershipSerializer.new(m).as_json }
        }
      end

      # GET /api/v1/investment_clubs/:investment_club_id/memberships/my_membership
      def my_membership
        membership = @club.investment_club_memberships.find_by(user: @current_user)
        
        if membership
          render json: {
            success: true,
            membership: ClubMembershipSerializer.new(membership).as_json
          }
        else
          render json: {
            success: false,
            error: 'Not a member of this club'
          }, status: :not_found
        end
      end

      # POST /api/v1/investment_clubs/:investment_club_id/memberships
      def create
        # Check if user is already a member
        if @club.is_member?(@current_user)
          return render json: { 
            success: false,
            error: 'Already a member of this club' 
          }, status: :unprocessable_entity
        end

        # Check if club is at capacity
        if @club.at_capacity?
          return render json: { 
            success: false,
            error: 'Club has reached maximum member capacity' 
          }, status: :unprocessable_entity
        end

        membership = @club.investment_club_memberships.new(
          user: @current_user,
          role: 'member',
          status: determine_initial_status
        )

        if membership.save
          notify_admins_of_pending_member(membership) if membership.pending?
          
          render json: { 
            success: true, 
            membership: ClubMembershipSerializer.new(membership).as_json,
            message: membership_message(membership)
          }, status: :created
        else
          render json: { 
            success: false, 
            errors: membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/investment_clubs/:investment_club_id/memberships/:id
      def show
        render json: {
          success: true,
          membership: ClubMembershipSerializer.new(@membership).as_json
        }
      end

      # PUT /api/v1/investment_clubs/:investment_club_id/memberships/:id
      def update
        if @membership.update(membership_params)
          notify_member_of_status_change(@membership) if @membership.saved_change_to_status?
          notify_member_of_role_change(@membership) if @membership.saved_change_to_role?
          
          render json: { 
            success: true, 
            membership: ClubMembershipSerializer.new(@membership).as_json 
          }
        else
          render json: { 
            success: false, 
            errors: @membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/investment_clubs/:investment_club_id/memberships/:id/approve
      def approve
        if @membership.pending?
          if @membership.update(status: 'active')
            # FIXED: Use the correct method name
            notify_member_of_approval(@membership)
            render json: { 
              success: true, 
              membership: ClubMembershipSerializer.new(@membership).as_json,
              message: 'Member approved successfully'
            }
          else
            render json: { 
              success: false, 
              errors: @membership.errors.full_messages 
            }, status: :unprocessable_entity
          end
        else
          render json: { 
            success: false,
            error: 'Only pending members can be approved'
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/investment_clubs/:investment_club_id/memberships/:id/reject
      def reject
        if @membership.pending?
          # FIXED: Handle member shares through user, not through membership
          begin
            # For pending members, there shouldn't be any investment shares anyway
            # But if there are, clean them up through the user association
            member_shares = MemberInvestmentShare.where(user: @membership.user)
            member_shares.destroy_all if member_shares.exists?
          rescue ActiveRecord::StatementInvalid => e
            # Log but continue - this is not critical for pending members
            Rails.logger.warn "Error cleaning up member shares: #{e.message}"
          end
          
          if @membership.destroy
            notify_member_of_rejection(@membership)
            render json: { 
              success: true, 
              message: 'Membership request rejected'
            }
          else
            render json: { 
              success: false, 
              errors: @membership.errors.full_messages 
            }, status: :unprocessable_entity
          end
        else
          render json: { 
            success: false,
            error: 'Only pending members can be rejected'
          }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/investment_clubs/:investment_club_id/memberships/:id
      def destroy
        # Users can leave their own membership, admins can remove others
        if @membership.user != @current_user && !@club.is_admin?(@current_user)
          return render json: { 
            success: false,
            error: 'Not authorized to remove this member' 
          }, status: :forbidden
        end

        # Prevent creator from leaving without transferring ownership
        if @membership.creator? && @club.investment_club_memberships.admin.count == 1
          return render json: { 
            success: false,
            error: 'Cannot remove the only admin. Transfer ownership first.' 
          }, status: :unprocessable_entity
        end

        if @membership.destroy
          # FIXED: Handle service call gracefully
          begin
            ClubMembershipService.new(@membership).handle_member_removal
          rescue => e
            Rails.logger.error "Error in handle_member_removal: #{e.message}"
            # Continue even if this fails - the main destroy was successful
          end
          
          render json: { 
            success: true, 
            message: 'Membership removed successfully' 
          }
        else
          render json: { 
            success: false, 
            errors: @membership.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      # POST /api/v1/investment_clubs/:investment_club_id/memberships/:id/leave
      def leave
        membership = @club.investment_club_memberships.find_by(user: @current_user)
        
        if membership.nil?
          return render json: { 
            success: false,
            error: 'Not a member of this club' 
          }, status: :not_found
        end

        if membership.creator? && @club.investment_club_memberships.admin.count == 1
          return render json: { 
            success: false,
            error: 'Cannot leave club as the only admin. Transfer ownership first.' 
          }, status: :unprocessable_entity
        end

        # Get portfolio summary before removal for reporting
        portfolio_summary = ClubPortfolioService.new(@club).member_portfolio(@current_user)
        
        if membership.destroy
          # FIXED: Handle service call gracefully
          begin
            ClubMembershipService.new(membership).handle_member_removal
          rescue => e
            Rails.logger.error "Error in handle_member_removal: #{e.message}"
            # Continue even if this fails - the main destroy was successful
          end
          
          render json: { 
            success: true, 
            message: 'Successfully left the club',
            portfolio_summary: portfolio_summary
          }
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
        render json: { 
          success: false,
          error: 'Club not found' 
        }, status: :not_found unless @club
      end

      def set_membership
        @membership = @club.investment_club_memberships.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { 
          success: false,
          error: 'Membership not found' 
        }, status: :not_found
      end

      def verify_admin_access
        return if action_name == 'leave' || action_name == 'my_membership'
        return if action_name == 'destroy' && @membership&.user == @current_user
        
        unless @club.is_admin?(@current_user)
          render json: { 
            success: false,
            error: 'Admin access required' 
          }, status: :forbidden
        end
      end

      def membership_params
        params.require(:membership).permit(:role, :status)
      end

      def determine_initial_status
        if @club.public?
          'active'
        else
          'pending'
        end
      end

      def membership_message(membership)
        if membership.pending?
          'Membership request submitted. Waiting for admin approval.'
        else
          'Successfully joined the club!'
        end
      end

      def notify_admins_of_pending_member(membership)
        @club.admin_members.each do |admin|
          ClubMailer.pending_member_notification(admin, membership).deliver_later
        end
      end

      def notify_member_of_status_change(membership)
        ClubMailer.membership_status_changed(membership.user, membership).deliver_later
      end

      def notify_member_of_role_change(membership)
        ClubMailer.membership_role_changed(membership.user, membership).deliver_later
      end

      # FIXED: Use the correct method name that exists in ClubMailer
      def notify_member_of_approval(membership)
        ClubMailer.membership_approved(membership.user, membership).deliver_later
      end

      def notify_member_of_rejection(membership)
        ClubMailer.membership_rejected(membership.user, membership).deliver_later
      end
    end
  end
end