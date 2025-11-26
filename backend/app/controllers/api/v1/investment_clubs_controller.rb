module Api
  module V1
    class InvestmentClubsController < ApplicationController
      before_action :authenticate_request
      before_action :verify_kyc_requirements, only: [:create] # ADDED: KYC verification for club creation
      before_action :set_club, only: [:show, :update, :portfolio, :analytics, :member_portfolio, :join, :leave, :my_membership_status, :transfer_ownership, :destroy]
      
      # GET /api/v1/investment_clubs
      def index
        clubs = InvestmentClub.active.includes(:creator, investment_club_memberships: :user)
                             .order(created_at: :desc)
                             .page(params[:page] || 1)
                             .per(params[:per_page] || 10)

        render json: {
          success: true,
          clubs: clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json },
          pagination: pagination_data(clubs)
        }
      end

      # GET /api/v1/investment_clubs/my_clubs
      def my_clubs
        user_clubs = InvestmentClub.joins(:investment_club_memberships)
                                  .where(investment_club_memberships: { user_id: @current_user.id, status: 'active' })
                                  .includes(:creator, investment_club_memberships: :user)
                                  .order(created_at: :desc)
                                  .page(params[:page] || 1)
                                  .per(params[:per_page] || 10)
        
        render json: {
          success: true,
          clubs: user_clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json },
          pagination: pagination_data(user_clubs)
        }
      end

      # GET /api/v1/investment_clubs/discover
      def discover
        # Clubs that user is not a member of
        user_club_ids = @current_user.investment_club_memberships.pluck(:investment_club_id)
        discover_clubs = InvestmentClub.active
                                      .where.not(id: user_club_ids)
                                      .includes(:creator, investment_club_memberships: :user)
                                      .order(created_at: :desc)
                                      .page(params[:page] || 1)
                                      .per(params[:per_page] || 10)
        
        render json: {
          success: true,
          clubs: discover_clubs.map { |club| InvestmentClubSerializer.new(club, current_user: @current_user).as_json },
          pagination: pagination_data(discover_clubs)
        }
      end

      # POST /api/v1/investment_clubs
      def create
        # KYC verification is handled by before_action :verify_kyc_requirements
        
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
            
            # Send notifications using new email service
            if membership.pending?
              notify_admins_of_pending_member(membership)
            end
            
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

        # Enhanced error handling for creator leaving
        if membership.creator?
          # Check if there are other admins who can take over
          other_admins = @club.investment_club_memberships.active.admin.where.not(user_id: @current_user.id)
          
          if other_admins.empty?
            return render json: { 
              success: false,
              error: 'Cannot leave club as the only admin. You must transfer ownership to another member first.',
              error_type: 'creator_cannot_leave',
              requires_transfer: true,
              available_members: @club.active_members.where.not(id: @current_user.id).map { |m| { id: m.id, name: m.full_name } }
            }, status: :unprocessable_entity
          end
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

      # POST /api/v1/investment_clubs/:id/refresh
      def refresh
        club = InvestmentClub.find_by(slug: params[:id])
        
        if club
          # Force refresh all counts and financials
          club.refresh_all_counts!
          
          render json: {
            success: true,
            club: ClubSerializer.new(club).as_json
          }
        else
          render json: {
            success: false,
            error: 'Club not found'
          }, status: :not_found
        end
      end

      # DELETE /api/v1/investment_clubs/:id
      def destroy
        # SIMPLIFIED: Only check if user is creator
        unless @club.deletion_errors?(@current_user)
          return render json: { 
            success: false,
            error: 'Only club creator can delete the club' 
          }, status: :forbidden
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

      # NEW: Portfolio Insights endpoint
      # GET /api/v1/investment_clubs/:id/portfolio_insights
      def portfolio_insights
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          insights_data = portfolio_service.portfolio_insights
          
          render json: {
            success: true,
            insights: insights_data
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # NEW: Financial Health endpoint
      # GET /api/v1/investment_clubs/:id/financial_health
      def financial_health
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          health_metrics = portfolio_service.financial_health_metrics
          
          render json: {
            success: true,
            financial_health: health_metrics
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # NEW: Predictive Analytics endpoint
      # GET /api/v1/investment_clubs/:id/predictive_analytics
      def predictive_analytics
        if @club && @club.is_member?(@current_user)
          portfolio_service = ClubPortfolioService.new(@club)
          predictive_data = portfolio_service.predictive_analytics
          
          render json: {
            success: true,
            predictive_analytics: predictive_data
          }
        else
          render json: { 
            success: false,
            error: 'Access denied' 
          }, status: :forbidden
        end
      end

      # NEW: Comprehensive Analytics endpoint - FIXED VERSION
      # GET /api/v1/investment_clubs/:id/comprehensive_analytics
      def comprehensive_analytics
        # FIXED: Use club ID instead of slug for lookup
        @club = InvestmentClub.find_by(id: params[:id])
        
        unless @club
          Rails.logger.error "DEBUG: Club not found with ID: #{params[:id]}"
          return render json: { 
            success: false,
            error: 'Club not found' 
          }, status: :not_found
        end

        # FIXED: Use existing method instead of non-existent method
        membership = @club.membership_for(@current_user)
        membership_status = membership&.status || 'not_member'
        
        Rails.logger.info "DEBUG: User #{@current_user.id} membership status: #{membership_status}"
        Rails.logger.info "DEBUG: Club found: #{@club.name} (ID: #{@club.id}, Slug: #{@club.slug})"
        
        unless @club.is_member?(@current_user)
          Rails.logger.warn "DEBUG: Access denied to comprehensive_analytics for user #{@current_user.id} in club #{@club.slug}"
          Rails.logger.warn "DEBUG: Membership status: #{membership_status}"
          Rails.logger.warn "DEBUG: User roles: #{@current_user.roles.pluck(:name) if @current_user.respond_to?(:roles)}"
          
          return render json: { 
            success: false,
            error: 'Access denied. You must be a member of this club to access analytics.',
            details: {
              club_id: @club.id,
              club_slug: @club.slug,
              user_id: @current_user.id,
              membership_status: membership_status,
              is_admin: @current_user.admin? # If you have an admin flag on user
            }
          }, status: :forbidden
        end

        begin
          portfolio_service = ClubPortfolioService.new(@club)
          comprehensive_data = portfolio_service.comprehensive_analytics
          
          Rails.logger.info "DEBUG: Successfully generated comprehensive analytics for club #{@club.id}"
          
          render json: {
            success: true,
            analytics: comprehensive_data,
            generated_at: Time.current.iso8601
          }
        rescue => e
          Rails.logger.error "Error generating comprehensive analytics: #{e.message}\n#{e.backtrace.join("\n")}"
          # Return safe fallback data instead of error
          portfolio_service = ClubPortfolioService.new(@club)
          fallback_data = {
            portfolio_overview: portfolio_service.safe_portfolio_overview,
            performance_analytics: portfolio_service.safe_performance_analytics,
            portfolio_insights: portfolio_service.safe_portfolio_insights,
            financial_health: portfolio_service.safe_financial_health,
            predictive_analytics: portfolio_service.safe_predictive_analytics,
            member_portfolio: portfolio_service.safe_member_portfolio,
            generated_at: Time.current.iso8601,
            note: "Analytics generated with fallback data due to calculation errors"
          }
          
          render json: {
            success: true,
            analytics: fallback_data,
            generated_at: Time.current.iso8601,
            warning: "Some analytics data may be incomplete"
          }
        end
      end

      private

      # NEW: KYC verification method for club creation
      def verify_kyc_requirements
        # For club creation, check if the user has KYC verification
        unless @current_user.verified_investor?
          render json: { 
            success: false, 
            error: 'You must complete KYC verification before creating investment clubs',
            code: 'KYC_VERIFICATION_REQUIRED',
            kyc_status: @current_user.kyc_status_info
          }, status: :forbidden
          return false
        end

        # Additional check: ensure KYC is not expired
        if @current_user.latest_kyc&.expired?
          render json: { 
            success: false, 
            error: 'Your KYC verification has expired. Please renew your verification before creating investment clubs.',
            code: 'KYC_EXPIRED'
          }, status: :forbidden
          return false
        end

        true
      end
      
      def set_club
        # FIXED: Try to find by ID first, then by slug for backward compatibility
        @club = InvestmentClub.find_by(id: params[:id]) || InvestmentClub.find_by(slug: params[:id])
        
        unless @club
          Rails.logger.error "DEBUG: Club not found with ID/slug: #{params[:id]}"
          render json: { 
            success: false,
            error: 'Club not found' 
          }, status: :not_found
          return false
        end
        
        Rails.logger.info "DEBUG: Club found: #{@club.name} (ID: #{@club.id}, Slug: #{@club.slug})"
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
          ClubEmailService.send_pending_member_notification(
            admin: admin,
            membership: membership
          )
        end
      end

      # Add pagination data method (same as in EquityInvestmentsController)
      def pagination_data(paginated_records)
        {
          current_page: paginated_records.current_page,
          total_pages: paginated_records.total_pages,
          per_page: paginated_records.limit_value,
          total_count: paginated_records.total_count
        }
      end
    end
  end
end