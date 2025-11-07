# app/controllers/api/v1/investment_clubs_controller.rb
module Api
  module V1
    class InvestmentClubsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club, only: [:show, :update, :portfolio, :analytics, :member_portfolio, :join, :leave, :my_membership_status, :transfer_ownership]
      
      # GET /api/v1/investment_clubs
      def index
        clubs = InvestmentClub.active.includes(:creator, investment_club_memberships: :user)
        
        render json: {
          success: true,
          clubs: clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json }
        }
      end

      # GET /api/v1/investment_clubs/my_clubs
      def my_clubs
        user_clubs = InvestmentClub.joins(:investment_club_memberships)
                                  .where(investment_club_memberships: { user_id: @current_user.id, status: 'active' })
                                  .includes(:creator, investment_club_memberships: :user)
        
        render json: {
          success: true,
          clubs: user_clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json }
        }
      end

      # GET /api/v1/investment_clubs/discover
      def discover
        # Clubs that user is not a member of
        user_club_ids = @current_user.investment_club_memberships.pluck(:investment_club_id)
        discover_clubs = InvestmentClub.active
                                      .where.not(id: user_club_ids)
                                      .includes(:creator, investment_club_memberships: :user)
        
        render json: {
          success: true,
          clubs: discover_clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json }
        }
      end

      # POST /api/v1/investment_clubs
      def create
        result = InvestmentClubCreationService.new(@current_user, club_params).create
        
        if result[:success]
          club = InvestmentClub.includes(:creator, investment_club_memberships: :user).find(result[:club].id)
          
          render json: { 
            success: true, 
            club: InvestmentClubSerializer.new(club, current_user: @current_user).as_json 
          }, status: :created
        else
          render json: { 
            success: false, 
            error: result[:errors] || result[:error] 
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/investment_clubs/:id
      def show
        if @club && (@club.public? || @club.is_member?(@current_user))
          render json: { 
            success: true,
            club: InvestmentClubSerializer.new(@club, current_user: @current_user).as_json 
          }
        else
          render json: { 
            success: false,
            error: 'Club not found or access denied' 
          }, status: :not_found
        end
      end

      # PUT /api/v1/investment_clubs/:id
      def update
        if @club && @club.is_admin?(@current_user)
          if @club.update(club_params)
            render json: { 
              success: true, 
              club: InvestmentClubSerializer.new(@club).as_json 
            }
          else
            render json: { 
              success: false, 
              errors: @club.errors.full_messages 
            }, status: :unprocessable_entity
          end
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # POST /api/v1/investment_clubs/:id/join
      def join
        Rails.logger.info "DEBUG: Join attempt for club: #{@club.slug} by user: #{@current_user.id}"
        Rails.logger.info "DEBUG: Club capacity: #{@club.current_members_count}/#{@club.max_members}"
        Rails.logger.info "DEBUG: User already member: #{@club.is_member?(@current_user)}"

        if @club.is_member?(@current_user)
          membership = @club.membership_for(@current_user)
          return render json: { 
            success: false,
            error: 'Already a member of this club',
            membership_status: membership.status,
            is_member: true
          }, status: :unprocessable_entity
        end

        if @club.at_capacity?
          return render json: { 
            success: false,
            error: 'Club has reached maximum member capacity',
            current_members: @club.current_members_count,
            max_members: @club.max_members,
            is_member: false
          }, status: :unprocessable_entity
        end

        begin
          membership = @club.investment_club_memberships.new(
            user: @current_user,
            role: 'member',
            status: @club.public? ? 'active' : 'pending'
          )

          if membership.save
            # Force update members count immediately
            @club.update_members_count
            
            Rails.logger.info "DEBUG: Membership created successfully: #{membership.id}, status: #{membership.status}"
            
            render json: { 
              success: true, 
              membership: ClubMembershipSerializer.new(membership).as_json,
              message: membership_message(membership),
              is_member: true
            }
          else
            Rails.logger.error "DEBUG: Failed to create membership: #{membership.errors.full_messages}"
            render json: { 
              success: false, 
              errors: membership.errors.full_messages,
              is_member: false
            }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "DEBUG: Error in join method: #{e.message}\n#{e.backtrace.join("\n")}"
          render json: { 
            success: false, 
            error: 'Internal server error',
            is_member: false
          }, status: :internal_server_error
        end
      end

      # POST /api/v1/investment_clubs/:id/leave
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

        # Get portfolio summary before removal
        portfolio_summary = ClubPortfolioService.new(@club).member_portfolio(@current_user)
        
        if membership.destroy
          # FIXED: Handle service call gracefully - use user-based approach
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

      # DELETE /api/v1/investment_clubs/:id
      def destroy
        unless @club.is_creator?(@current_user)
          return render json: { 
            success: false,
            error: 'Only club creator can delete the club' 
          }, status: :forbidden
        end

        # Check if club has active investments or members
        if @club.club_investments.executed.any?
          return render json: { 
            success: false,
            error: 'Cannot delete club with active investments. Transfer ownership first.' 
          }, status: :unprocessable_entity
        end

        if @club.investment_club_memberships.active.count > 1
          return render json: { 
            success: false,
            error: 'Cannot delete club with active members. Transfer ownership or remove members first.' 
          }, status: :unprocessable_entity
        end

        club_name = @club.name
        
        if @club.destroy
          render json: { 
            success: true, 
            message: "Club '#{club_name}' has been deleted successfully" 
          }
        else
          render json: { 
            success: false, 
            errors: @club.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/investment_clubs/:id/my_membership_status
      def my_membership_status
        membership = @club.investment_club_memberships.find_by(user: @current_user)
        
        if membership
          render json: {
            success: true,
            membership: ClubMembershipSerializer.new(membership).as_json,
            is_member: true,
            message: "Member status: #{membership.status}"
          }
        else
          render json: {
            success: false,
            is_member: false,
            message: 'Not a member of this club'
          }
        end
      end
      # POST /api/v1/investment_clubs/:id/transfer_ownership
      def transfer_ownership
        unless @club.is_creator?(@current_user)
          return render json: { 
            success: false,
            error: 'Only club creator can transfer ownership' 
          }, status: :forbidden
        end

        new_admin_id = params[:new_admin_id]
        service = ClubMembershipService.new(@club.membership_for(@current_user))
        result = service.transfer_ownership(new_admin_id)

        if result[:success]
          render json: { 
            success: true, 
            message: result[:message] 
          }
        else
          render json: { 
            success: false, 
            error: result[:error] 
          }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/investment_clubs/:id/portfolio
      def portfolio
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          portfolio_data = portfolio_service.portfolio_overview
          
          render json: {
            success: true,
            portfolio: portfolio_data
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # GET /api/v1/investment_clubs/:id/analytics
      def analytics
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          analytics_data = portfolio_service.performance_analytics
          
          render json: {
            success: true,
            analytics: analytics_data
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # GET /api/v1/investment_clubs/:id/member_portfolio
      def member_portfolio
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          member_portfolio_data = portfolio_service.member_portfolio(@current_user)
          
          render json: {
            success: true,
            member_portfolio: member_portfolio_data
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      private
      
      def set_club
        @club = InvestmentClub.find_by(slug: params[:id])
        render json: { 
          success: false,
          error: 'Club not found' 
        }, status: :not_found unless @club
      end

      def membership_message(membership)
        if membership.pending?
          'Membership request submitted. Waiting for admin approval.'
        else
          'Successfully joined the club!'
        end
      end
      
      def club_params
        params.require(:investment_club).permit(
          :name, :mission, :minimum_monthly_contribution, 
          :investment_focus, :max_members, :club_type,
          :constitution_data
        )
      end

      def notify_admins_of_pending_member(membership)
        @club.admin_members.each do |admin|
          ClubMailer.pending_member_notification(admin, membership).deliver_later
        end
      end
    end
  end
end