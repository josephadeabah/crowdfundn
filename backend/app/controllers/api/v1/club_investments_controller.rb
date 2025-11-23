module Api
  module V1
    class ClubInvestmentsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership
      before_action :verify_kyc_requirements, only: [:create] # ADDED: KYC verification
      before_action :set_investment, only: [:show, :update, :vote, :certificate_status, :generate_certificate, :download_certificate, :cancel]

      # ADD THESE REQUIRE STATEMENTS
      require Rails.root.join('app/services/ai/club_recommendation_service')
      require Rails.root.join('app/services/ai/club_investment_proposal_service')
      
      def index
        # Filter by status if provided
        investments = @club.club_investments.includes(:campaign).order(created_at: :desc)
        
        if params[:status].present?
          investments = investments.where(status: params[:status])
        end
        
        # Paginate investments
        paginated_investments = investments.page(params[:page] || 1).per(params[:per_page] || 5)
        
        # Transform investments for frontend
        transformed_investments = paginated_investments.map do |investment|
          transform_investment_for_frontend(investment)
        end
        
        render json: {
          success: true,
          investments: transformed_investments,
          pagination: {
            current_page: paginated_investments.current_page,
            total_pages: paginated_investments.total_pages,
            per_page: paginated_investments.limit_value,
            total_count: paginated_investments.total_count
          }
        }
      end
      
      def show
        render json: {
          success: true,
          investment: transform_investment_for_frontend(@investment)
        }
      end
      
      def create
        Rails.logger.info "=== ClubInvestmentsController#create ==="
        Rails.logger.info "Params: #{params.inspect}"
        Rails.logger.info "Club: #{@club.inspect}"
        Rails.logger.info "Current User: #{@current_user.inspect}"
        
        campaign = Campaign.find_by(id: params[:campaign_id])
        
        unless campaign
          return render json: { 
            success: false,
            error: 'Campaign not found',
            code: 'CAMPAIGN_NOT_FOUND'
          }, status: :not_found
        end
        
        # Validate admin access for investment creation
        unless @club.is_admin?(@current_user)
          return render json: { 
            success: false, 
            error: 'Only club admins can create investments',
            code: 'ADMIN_ACCESS_REQUIRED'
          }, status: :forbidden
        end

        # Validate investment amount and campaign requirements
        validation_result = validate_club_investment(params[:investment_amount].to_f, campaign)
        unless validation_result[:valid]
          Rails.logger.error "Investment validation failed: #{validation_result.inspect}"
          return render json: { 
            success: false, 
            error: validation_result[:message],
            validationErrors: validation_result[:errors],
            code: validation_result[:code]
          }, status: :unprocessable_entity
        end
        
        # Check club balance
        unless @club.can_invest?(params[:investment_amount].to_f)
          return render json: { 
            success: false, 
            error: "Insufficient club balance. Available: #{@club.currency_symbol}#{@club.current_balance.to_f}",
            code: 'INSUFFICIENT_BALANCE'
          }, status: :unprocessable_entity
        end
        
        ActiveRecord::Base.transaction do
          # NEW: Different flow for equity investments vs regular voting investments
          if campaign.is_a?(EquityCampaign)
            # Direct equity investment flow (no voting required for admins)
            club_investment = @club.club_investments.new(
              campaign: campaign,
              investment_amount: params[:investment_amount].to_f,
              status: ClubInvestment::STATUS_PENDING,
              created_by: @current_user,
              notes: params[:notes]
            )
            
            unless club_investment.valid?
              Rails.logger.error "Club investment validation failed: #{club_investment.errors.full_messages}"
              return render json: { 
                success: false, 
                error: "Investment validation failed: #{club_investment.errors.full_messages.join(', ')}",
                validationErrors: club_investment.errors.messages
              }, status: :unprocessable_entity
            end

            unless club_investment.save
              Rails.logger.error "Club investment save failed: #{club_investment.errors.full_messages}"
              return render json: { 
                success: false, 
                error: "Failed to create investment: #{club_investment.errors.full_messages.join(', ')}",
                validationErrors: club_investment.errors.messages
              }, status: :unprocessable_entity
            end

            Rails.logger.info "Club investment created successfully: #{club_investment.id}"

            # Execute the investment immediately for equity campaigns
            result = process_club_investment(club_investment)
            
            if result[:success]
              render json: { 
                success: true, 
                club_investment: transform_investment_for_frontend(club_investment.reload),
                authorization_url: result[:authorization_url],
                message: 'Equity investment initiated successfully'
              }, status: :created
            else
              club_investment.update(status: ClubInvestment::STATUS_FAILED)
              render json: { 
                success: false, 
                error: result[:error],
                code: result[:code]
              }, status: :unprocessable_entity
            end
          else
            # Regular voting-based investment flow
            club_investment = @club.club_investments.new(
              campaign: campaign,
              investment_amount: params[:investment_amount].to_f,
              proposed_share_percentage: params[:proposed_share_percentage],
              status: ClubInvestment::STATUS_VOTING,
              created_by: @current_user,
              voting_session_id: SecureRandom.uuid,
              notes: params[:notes]
            )
            
            if club_investment.save
              render json: { 
                success: true, 
                club_investment: ClubInvestmentSerializer.new(club_investment).as_json,
                voting_session_id: club_investment.voting_session_id
              }, status: :created
            else
              render json: { 
                success: false, 
                errors: club_investment.errors.full_messages,
                validationErrors: club_investment.errors.messages
              }, status: :unprocessable_entity
            end
          end
        end
      rescue ActiveRecord::StaleObjectError => e
        error_msg = 'Campaign was modified by another process. Please try again.'
        Rails.logger.error "#{error_msg}: #{e.message}"
        render json: { 
          success: false, 
          error: error_msg,
          code: 'STALE_OBJECT_ERROR',
          validationErrors: { base: [error_msg] }
        }, status: :conflict
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "Record validation failed: #{e.message}"
        render json: { 
          success: false, 
          error: e.message,
          validationErrors: e.record.errors.messages
        }, status: :unprocessable_entity
      rescue StandardError => e
        error_msg = "Unexpected error: #{e.message}"
        Rails.logger.error "#{error_msg}\n#{e.backtrace.join("\n")}"
        render json: { 
          success: false, 
          error: error_msg,
          code: e.try(:code),
          validationErrors: { base: [error_msg] }
        }, status: :unprocessable_entity
      end

      # NEW: Certificate endpoints for equity investments
      def certificate_status
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'Certificates only available for equity investments',
            code: 'INVALID_CAMPAIGN_TYPE'
          }, status: :unprocessable_entity
        end

        render json: {
          exists: @investment.certificate_present?,
          url: @investment.certificate_url,
          certificate_number: @investment.certificate_number
        }
      end

      def generate_certificate
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'Certificates only available for equity investments',
            code: 'INVALID_CAMPAIGN_TYPE'
          }, status: :unprocessable_entity
        end

        unless @investment.successful?
          render json: { 
            success: false, 
            error: 'Certificate can only be generated for successful investments',
            code: 'INVALID_INVESTMENT_STATUS'
          }, status: :unprocessable_entity
          return
        end

        if @investment.certificate_present?
          render json: { 
            success: true, 
            message: 'Certificate already exists',
            certificate_url: @investment.certificate_url
          }, status: :ok
          return
        end

        if ClubInvestmentCertificateService.generate_certificate(@investment)
          @investment.reload
          render json: { 
            success: true, 
            message: 'Certificate generated successfully',
            certificate_url: @investment.certificate_url
          }, status: :created
        else
          render json: { 
            success: false, 
            error: 'Failed to generate certificate',
            code: 'CERTIFICATE_GENERATION_FAILED'
          }, status: :unprocessable_entity
        end
      end

      def download_certificate
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'Certificates only available for equity investments',
            code: 'INVALID_CAMPAIGN_TYPE'
          }, status: :unprocessable_entity
        end

        unless @investment.certificate_present?
          render json: { 
            success: false, 
            error: 'Certificate not found',
            code: 'CERTIFICATE_NOT_FOUND'
          }, status: :not_found
          return
        end

        send_data @investment.certificate.download,
                  filename: "club_investment_certificate_#{@investment.certificate_number}.pdf",
                  type: 'application/pdf',
                  disposition: 'attachment'
      end
      
      def vote
        # Change this line from params[:investment_id] to params[:id]
        club_investment = @club.club_investments.find(params[:id])
        
        # Check if voting is still active
        unless club_investment.voting?
          return render json: { 
            success: false, 
            error: 'Voting period has ended for this investment',
            code: 'VOTING_PERIOD_ENDED'
          }, status: :unprocessable_entity
        end
        
        # Use your existing VotingService
        voting_service = VotingService.new(club_investment, @current_user, club_investment.voting_session_id)
        
        result = voting_service.cast_vote(params[:vote_type], params[:reason])
        
        if result[:success]
          render json: { 
            success: true, 
            vote: result[:vote],
            voting_stats: voting_service.voting_stats,
            approved: club_investment.approved?
          }
        else
          render json: { 
            success: false, 
            error: result[:error],
            code: result[:code]
          }, status: :unprocessable_entity
        end
      end
      
      # ENHANCED: Generate new proposals with better fallbacks
      def generate_proposals
        limit = params[:limit]&.to_i || 5
        
        proposal_service = AI::ClubInvestmentProposalService.new(@club, @current_user)
        result = proposal_service.generate_proposals_from_ai_recommendations(limit: limit)
        
        if result[:success] || result[:proposals].any?
          # Create actual investment records from proposals
          created_investments = create_investments_from_proposals(result[:proposals])
          
          render json: {
            success: true,
            proposals: transform_proposals_for_frontend(created_investments),
            message: "Generated #{created_investments.count} investment proposals",
            fallback_used: result[:fallback] || false
          }
        else
          render json: {
            success: false,
            error: result[:error] || 'No proposals could be generated',
            proposals: [],
            code: 'NO_PROPOSALS_GENERATED'
          }, status: :unprocessable_entity
        end
      end
      
      # Get AI recommendations (existing but updated)
      def ai_recommendations
        begin
          limit = params[:limit]&.to_i || 10
          force_refresh = params[:force_refresh] == 'true'
          
          # Use the enhanced ClubRecommendationService
          recommendation_service = AI::ClubRecommendationService.new(@club, @current_user)
          result = recommendation_service.recommend_campaigns(limit: limit, force_fresh: force_refresh)
          
          if result[:success] || result[:recommendations].any?
            # Transform recommendations into the format expected by the frontend
            recommendations = result[:recommendations].map do |rec|
              campaign = rec[:campaign]
              transform_recommendation_for_frontend(campaign, rec)
            end
            
            render json: {
              success: true,
              recommendations: recommendations,
              club_focus: @club.investment_focus,
              mission: @club.mission,
              total_recommendations: recommendations.count,
              fallback_used: result[:fallback] || false
            }
          else
            render json: {
              success: false,
              error: result[:error],
              recommendations: [],
              code: 'NO_RECOMMENDATIONS'
            }, status: :unprocessable_entity
          end
          
        rescue => e
          Rails.logger.error "AI recommendations error: #{e.message}"
          render json: {
            success: false,
            error: "Failed to generate recommendations",
            recommendations: [],
            code: 'RECOMMENDATION_SERVICE_ERROR'
          }, status: :internal_server_error
        end
      end

      def get_campaign_ai_analysis(campaign)
        if campaign.respond_to?(:ai_deal_score) && campaign.ai_deal_score.present?
          # Calculate risk level directly in controller
          risk_category = calculate_risk_level(campaign.ai_risk_score)
          
          {
            deal_score: campaign.ai_deal_score,
            risk_score: campaign.ai_risk_score,
            risk_category: risk_category,
            sentiment_analysis: 'positive',
            strengths: ['Strong market position', 'Experienced team']
          }
        else
          {
            deal_score: rand(60..90),
            risk_score: rand(20..50),
            risk_category: 'medium',
            sentiment_analysis: 'positive',
            strengths: ['Growing market', 'Innovative product']
          }
        end
      end

      def calculate_risk_level(risk_score)
        return 'Unknown' unless risk_score.present?
        
        case risk_score
        when 0..20 then 'Very Low'
        when 21..40 then 'Low'
        when 41..60 then 'Medium'
        when 61..80 then 'High'
        else 'Very High'
        end
      end

      # NEW: Cancel investment endpoint
      def cancel
        unless @investment.committed?
          return render json: {
            success: false,
            error: 'Only committed investments can be cancelled',
            code: 'INVALID_CANCELLATION_STATUS'
          }, status: :unprocessable_entity
        end

        # Check if cancellation window is still open
        unless @investment.can_be_cancelled?
          return render json: {
            success: false,
            error: 'Cancellation window has expired',
            code: 'CANCELLATION_WINDOW_EXPIRED'
          }, status: :unprocessable_entity
        end

        if @investment.cancel!(params[:reason])
          # Send cancellation notifications
          send_cancellation_notifications(@investment, params[:reason])
          
          render json: {
            success: true,
            message: 'Investment cancelled successfully',
            investment: transform_investment_for_frontend(@investment.reload)
          }
        else
          render json: {
            success: false,
            error: 'Failed to cancel investment',
            code: 'CANCELLATION_FAILED'
          }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Failed to cancel investment: #{e.message}"
        render json: {
          success: false,
          error: 'Failed to cancel investment',
          code: 'CANCELLATION_ERROR'
        }, status: :unprocessable_entity
      end

      private

      # NEW: KYC verification method (same as EquityInvestmentsController)
      def verify_kyc_requirements
        # For club investments, check if the club admin has KYC verification
        unless @current_user.verified_investor?
          render json: { 
            success: false, 
            error: 'You must complete verification before making investments',
            code: 'KYC_VERIFICATION_REQUIRED',
            kyc_status: @current_user.kyc_status_info
          }, status: :forbidden
          return false
        end

        # Additional check: ensure KYC is not expired
        if @current_user.latest_kyc&.expired?
          render json: { 
            success: false, 
            error: 'Your KYC verification has expired. Please renew your verification.',
            code: 'KYC_EXPIRED'
          }, status: :forbidden
          return false
        end

        true
      end

      # NEW: Enhanced validation method (similar to EquityInvestmentsController)
      def validate_club_investment(amount, campaign)
        Rails.logger.info "Validating club investment: amount=#{amount}, campaign_id=#{campaign.id}"
        
        result = { valid: true, errors: {} }
        
        # Basic validations
        if amount <= 0
          result[:valid] = false
          result[:message] = "Investment amount must be greater than 0"
          result[:errors][:amount] = ["must be greater than 0"]
          Rails.logger.error "Amount must be positive: #{amount}"
        end
        
        if campaign.is_a?(EquityCampaign)
          # Equity campaign specific validations
          if amount < campaign.minimum_investment
            result[:valid] = false
            result[:message] = "Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_investment}"
            result[:errors][:amount] = ["Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_investment}"]
            Rails.logger.error "Amount below minimum: #{amount} < #{campaign.minimum_investment}"
          end
          
          if campaign.maximum_investment > 0 && amount > campaign.maximum_investment
            result[:valid] = false
            result[:message] = "Maximum investment is #{campaign.currency_symbol}#{campaign.maximum_investment}"
            result[:errors][:amount] = ["Maximum investment is #{campaign.currency_symbol}#{campaign.maximum_investment}"]
            Rails.logger.error "Amount above maximum: #{amount} > #{campaign.maximum_investment}"
          end
          
          # Subaccount validation - with enhanced checking
          subaccount = Subaccount.find_by(user_id: campaign.fundraiser_id)
          unless subaccount&.subaccount_code.present?
            result[:valid] = false
            result[:message] = 'Fundraiser does not meet requirements for raising funds'
            result[:errors][:base] = ['Fundraiser does not meet requirements for raising funds']
            result[:code] = 'MISSING_ACCOUNT_NUMBER'
            Rails.logger.error "Missing subaccount for fundraiser: #{campaign.fundraiser_id}"
          else
            # Validate subaccount with Paystack
            subaccount_valid = validate_subaccount_with_paystack(subaccount.subaccount_code)
            unless subaccount_valid
              result[:valid] = false
              result[:message] = 'Fundraiser payment account is not properly configured'
              result[:errors][:base] = ['Fundraiser payment account is not properly configured']
              result[:code] = 'INVALID_SUBACCOUNT'
              Rails.logger.error "Invalid subaccount for fundraiser: #{campaign.fundraiser_id}, subaccount: #{subaccount.subaccount_code}"
            end
          end

          # Campaign status validation
          if result[:valid] && !campaign.live?
            result[:valid] = false
            result[:message] = "Campaign is not currently accepting investments"
            result[:errors][:base] = ["Campaign is not currently accepting investments (status: #{campaign.equity_status})"]
            result[:code] = 'CAMPAIGN_NOT_LIVE'
            Rails.logger.error "Campaign not live: status=#{campaign.equity_status}"
          end

          # Check if investment would exceed available shares (SOURCE OF TRUTH)
          if result[:valid] && campaign.shares_available <= 0
            result[:valid] = false
            result[:message] = "No shares available for investment"
            result[:errors][:base] = ["No shares available for investment"]
            result[:code] = 'NO_SHARES_AVAILABLE'
            Rails.logger.error "No shares available: #{campaign.shares_available}"
          end

          if result[:valid]
            price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
            requested_shares = (amount / price_per_share).round(4)
            
            if requested_shares > campaign.shares_available
              available_amount = (campaign.shares_available * price_per_share).floor
              result[:valid] = false
              result[:message] = "Not enough shares available. Maximum investment possible: #{campaign.currency_symbol}#{available_amount}"
              result[:errors][:amount] = ["Not enough shares available. Maximum: #{campaign.currency_symbol}#{available_amount}"]
              result[:code] = 'INSUFFICIENT_SHARES'
              Rails.logger.error "Shares exceeded: requested=#{requested_shares}, available=#{campaign.shares_available}"
            end
          end
        else
          # Regular campaign validations
          if amount < campaign.minimum_donation
            result[:valid] = false
            result[:message] = "Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_donation}"
            result[:errors][:amount] = ["Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_donation}"]
            Rails.logger.error "Amount below minimum: #{amount} < #{campaign.minimum_donation}"
          end
        end

        # Build error message from all errors
        unless result[:valid]
          result[:message] ||= result[:errors].map { |field, messages| 
            "#{field.to_s.humanize} #{messages.join(', ')}" 
          }.join('; ')
        end

        Rails.logger.info "Validation result: #{result.inspect}"
        result
      end

      # NEW: Subaccount validation (same as EquityInvestmentsController)
      def validate_subaccount_with_paystack(subaccount_code)
        return false unless subaccount_code.present?
        
        paystack_service = PaystackService.new
        begin
          # Try to fetch the subaccount to validate it exists
          response = paystack_service.fetch_subaccount(subaccount_code)
          response[:status] == true
        rescue => e
          Rails.logger.error "Error validating subaccount #{subaccount_code}: #{e.message}"
          false
        end
      end

      # NEW: Create actual investment records from proposals
      def create_investments_from_proposals(proposals)
        created_investments = []
        
        proposals.each do |proposal|
          campaign = proposal[:campaign]
          
          # Skip if campaign already has an active proposal
          next if @club.club_investments.where(campaign_id: campaign.id, status: ['pending', 'voting']).exists?
          
          investment = @club.club_investments.create(
            campaign: campaign,
            investment_amount: proposal[:investment_amount],
            proposed_share_percentage: proposal[:proposed_share_percentage],
            status: ClubInvestment::STATUS_VOTING,
            created_by: @current_user,
            voting_session_id: proposal[:voting_session_id],
            notes: "AI-generated proposal: #{proposal[:reasoning]}"
          )
          
          if investment.persisted?
            created_investments << investment
          else
            Rails.logger.warn "Failed to create investment for campaign #{campaign.id}: #{investment.errors.full_messages}"
          end
        end
        
        created_investments
      end

      # NEW: Transform proposals for frontend
      def transform_proposals_for_frontend(investments)
        investments.map do |investment|
          transform_investment_for_frontend(investment)
        end
      end

      # NEW: Transform recommendation for frontend
      def transform_recommendation_for_frontend(campaign, recommendation)
        {
          id: campaign.id.to_s,
          company: campaign.title,
          description: campaign.description.to_plain_text.truncate(200),
          amount: format_currency(campaign.goal_amount, campaign.currency_symbol),
          sector: campaign.category || 'General',
          votes: 0, # Start with 0 votes
          threshold: calculate_voting_threshold,
          match_score: recommendation[:match_score],
          reasoning: recommendation[:reasoning],
          ai_analysis: recommendation[:ai_analysis],
          campaign_id: campaign.id,
          status: 'recommendation',
          # Additional fields for better frontend display
          campaign_slug: campaign.slug,
          performance_percentage: campaign.performance_percentage,
          currency_symbol: campaign.currency_symbol,
          is_equity_investment: campaign.is_a?(EquityCampaign)
        }
      end

      # NEW: Send cancellation notifications
      def send_cancellation_notifications(investment, reason)
        # Notify club admins
        @club.admin_members.each do |admin|
          ClubEmailService.send_investment_cancellation_notification(
            admin: admin,
            club_investment: investment,
            reason: reason
          )
        end
      end

      # In your ClubInvestmentsController
      def transform_investment_for_frontend(investment)
        campaign = investment.campaign
        
        # Base campaign data structure
        campaign_data = if campaign
          base_campaign_data = {
            title: campaign.title,
            description: campaign.description&.to_plain_text&.truncate(200) || 'No description available',
            category: campaign.category,
            currency_symbol: campaign.currency_symbol,
            currency: campaign.currency,
            id: campaign.id,
            slug: campaign.slug,
            valuation: campaign.valuation,
            equity_offered: campaign.equity_offered,
            minimum_investment: campaign.minimum_investment,
            maximum_investment: campaign.maximum_investment
          }

          # Add equity-specific data if it's an equity campaign
          if campaign.is_a?(EquityCampaign)
            base_campaign_data.merge!({
              # Company info from equity campaign
              company_info: {
                name: campaign.company_name,
                description: campaign.company_description,
                headquarters: campaign.company_headquarters,
                website: campaign.company_website,
                contract_term: campaign.contract_term
              },
              # Team members from equity campaign
              team_members: campaign.campaign_team_members.includes(:user).map do |member|
                {
                  id: member.id,
                  name: member.name,
                  email: member.email,
                  role: member.role,
                  title: member.title,
                  equity_percentage: member.equity_percentage,
                  description: member.description,
                  avatar_url: member.avatar_url,
                  user: if member.user
                          {
                            id: member.user.id,
                            email: member.user.email,
                            profile: {
                              first_name: member.user.profile&.first_name,
                              last_name: member.user.profile&.last_name
                            }
                          }
                        end
                }
              end,
              # Equity offering details
              equity_offering_details: {
                minimum_target: campaign.minimum_target,
                price_per_share: campaign.price_per_share,
                min_shares: campaign.min_shares,
                max_shares: campaign.max_shares,
                shares_offered: campaign.shares_offered,
                stock_type: campaign.stock_type,
                stock_type_display: campaign.stock_type_display,
                funding_round: campaign.funding_round,
                funding_round_display: campaign.funding_round_display,
                sec_filing_url: campaign.sec_filing_url,
                offering_circular_url: campaign.offering_circular_url,
                offering_memorandum: campaign.offering_memorandum,
                offering_documents: {
                  sec_filing: {
                    present: campaign.sec_filing_url.present?,
                    url: campaign.sec_filing_url
                  },
                  offering_circular: {
                    present: campaign.offering_circular_url.present?,
                    url: campaign.offering_circular_url
                  },
                  offering_memorandum_document: { 
                    attached: campaign.offering_memorandum_document.attached?,
                    url: campaign.offering_memorandum_document_url,
                    filename: campaign.offering_memorandum_document.attached? ? campaign.offering_memorandum_document.filename.to_s : nil
                  }
                }
              },
              # Equity status and metrics
              equity_status: campaign.equity_status,
              shares_available: campaign.shares_available,
              shares_issued: campaign.shares_issued,
              total_equity_shares: campaign.total_shares,
              percentage_raised: campaign.percentage_raised,
              total_investors: campaign.total_investors
            })
          end

          base_campaign_data
        else
          {
            title: 'Unknown Company',
            description: 'No description available',
            category: 'General',
            currency_symbol: '$',
            currency: 'USD',
            id: nil,
            slug: nil,
            valuation: nil,
            equity_offered: nil,
            minimum_investment: nil,
            maximum_investment: nil
          }
        end
        
        voting_stats = investment.voting_stats || {}
        
        # Base investment data
        base_data = {
          id: investment.id.to_s,
          company: campaign_data[:title],
          description: campaign_data[:description],
          amount: format_currency(investment.investment_amount, campaign_data[:currency_symbol]),
          sector: campaign_data[:category],
          status: investment.status,
          club_investment_id: investment.id,
          campaign_id: campaign_data[:id],
          campaign_slug: campaign_data[:slug],
          proposed_amount: investment.investment_amount,
          currency_symbol: campaign_data[:currency_symbol],
          currency: campaign_data[:currency],
          is_equity_investment: campaign.is_a?(EquityCampaign),
          # Critical fields for cancellation
          can_be_cancelled: investment.can_be_cancelled?,
          cancel_window_expires_at: investment.cancel_window_expires_at,
          committed_at: investment.committed_at,
          time_remaining_for_cancellation: investment.time_remaining_for_cancellation,
          # Campaign valuation and equity data
          campaign_valuation: campaign_data[:valuation],
          campaign_equity_offered: campaign_data[:equity_offered],
          campaign_minimum_investment: campaign_data[:minimum_investment],
          campaign_maximum_investment: campaign_data[:maximum_investment]
        }

        # Add equity investment data if it's an equity campaign
        if campaign.is_a?(EquityCampaign)
          base_data.merge!({
            shares: investment.shares,
            percentage: investment.percentage,
            certificate_url: investment.certificate_url,
            certificate_number: investment.certificate_number,
            current_value: investment.current_value,
            total_returns: investment.total_returns,
            roi: investment.roi,
            investment_date: investment.investment_date,
            # Include the equity-specific campaign data
            company_info: campaign_data[:company_info],
            team_members: campaign_data[:team_members],
            equity_offering_details: campaign_data[:equity_offering_details],
            equity_status: campaign_data[:equity_status],
            shares_available: campaign_data[:shares_available],
            shares_issued: campaign_data[:shares_issued],
            total_equity_shares: campaign_data[:total_equity_shares],
            percentage_raised: campaign_data[:percentage_raised],
            total_investors: campaign_data[:total_investors]
          })
        else
          # Add voting data for non-equity investments
          base_data.merge!({
            votes: voting_stats[:yes_votes] || 0,
            threshold: calculate_voting_threshold,
            match_score: calculate_match_score(campaign),
            reasoning: "Investment proposal for #{campaign_data[:title]}",
            ai_analysis: get_campaign_ai_analysis(campaign),
            voting_stats: voting_stats
          })
        end
        
        base_data
      end

      def get_campaign_ai_analysis(campaign)
        # Handle nil campaign case
        return get_default_ai_analysis unless campaign
        
        if campaign.respond_to?(:ai_deal_score) && campaign.ai_deal_score
          {
            deal_score: campaign.ai_deal_score,
            risk_score: campaign.ai_risk_score,
            risk_category: campaign.respond_to?(:risk_level) ? campaign.risk_level : 'medium',
            sentiment_analysis: 'positive',
            strengths: ['Strong market position', 'Experienced team']
          }
        else
          get_default_ai_analysis
        end
      end

      def get_default_ai_analysis
        {
          deal_score: rand(60..90),
          risk_score: rand(20..50),
          risk_category: 'medium',
          sentiment_analysis: 'positive',
          strengths: ['Growing market', 'Innovative product']
        }
      end

      def format_currency(amount, currency_symbol = '$')
        if amount >= 1000
          "#{currency_symbol}#{(amount / 1000).round(1)}K"
        else
          "#{currency_symbol}#{amount.round(0)}"
        end
      end

      def calculate_voting_threshold
        # Use current_members_count from the club
        total_members = @club.current_members_count
        
        # For approval, we need majority (more than 50%) of members to vote YES
        # when all members have voted
        (total_members / 2) + 1 # Simple majority
      end

      def calculate_match_score(campaign)
        # Simple match score calculation
        score = 50 # Base score
        
        # Add points for category match
        if @club.investment_focus.present? && campaign.category.present?
          if @club.investment_focus.downcase.include?(campaign.category.downcase)
            score += 30
          end
        end
        
        # Add points for performance
        if campaign.respond_to?(:performance_percentage)
          score += (campaign.performance_percentage * 0.3)
        end
        
        score.clamp(0, 100).round(2)
      end
      
      def set_club
        # The route parameter is :investment_club_id, not :id
        club_identifier = params[:investment_club_id]
        
        # Try to find by slug first, then by ID
        @club = InvestmentClub.find_by(slug: club_identifier) || 
                InvestmentClub.find_by(id: club_identifier)
                
        unless @club
          Rails.logger.error "Club not found with identifier: #{club_identifier}"
          render json: { 
            success: false,
            error: 'Club not found',
            code: 'CLUB_NOT_FOUND',
            attempted_identifier: club_identifier
          }, status: :not_found 
          return
        end
        
        Rails.logger.info "Found club: #{@club.name} (ID: #{@club.id}, Slug: #{@club.slug})"
      end
      
      def verify_membership
        unless @club.is_member?(@current_user)
          render json: { 
            success: false,
            error: 'Not a club member',
            code: 'NOT_CLUB_MEMBER'
          }, status: :forbidden 
        end
      end

      def set_investment
        @investment = @club.club_investments.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { 
          success: false,
          error: 'Investment not found',
          code: 'INVESTMENT_NOT_FOUND'
        }, status: :not_found
      end

      # UPDATED: Renamed from execute_club_investment to process_club_investment
      def process_club_investment(club_investment)
        campaign = club_investment.campaign
        
        Rails.logger.info "Creating equity investment for club #{@club.id}"
        
        # Create investment using club information instead of user
        investment = campaign.equity_investments.new(
          amount: club_investment.investment_amount,
          email: @club.contact_email,
          full_name: @club.name,
          # Don't set user_id for club investments - this is the key fix
          metadata: {
            club_investment: true,
            club_id: @club.id,
            club_name: @club.name,
            created_by_user_id: @current_user.id,
            investor_type: 'club'
          }
        )

        Rails.logger.info "Investment attributes: #{investment.attributes}"
        Rails.logger.info "Investment valid?: #{investment.valid?}"
        
        unless investment.valid?
          Rails.logger.error "Equity investment validation failed: #{investment.errors.full_messages}"
          return { success: false, error: investment.errors.full_messages.join(', '), code: 'INVESTMENT_VALIDATION_FAILED' }
        end

        unless investment.save
          Rails.logger.error "FAILED to create equity investment: #{investment.errors.full_messages}"
          return { success: false, error: investment.errors.full_messages.join(', '), code: 'INVESTMENT_CREATION_FAILED' }
        end

        Rails.logger.info "Equity investment created successfully: #{investment.id}"

        # Generate callback URL
        secure_random_uuid = SecureRandom.uuid
        campaign_identifier = campaign.slug || campaign.id
        redirect_url = Rails.application.routes.url_helpers.campaign_url(campaign_identifier, host: 'bantuhive.com') + "?#{secure_random_uuid}"

        # Prepare metadata - include fee information for webhook
        metadata = build_metadata(investment, redirect_url, club_investment)

        # Initialize payment using existing logic
        initialize_payment_result = initialize_club_payment(investment, metadata, redirect_url)
        
        if initialize_payment_result[:success]
          # REMOVED: No immediate deduction from club balance
          # The balance will be deducted in the webhook handler after successful payment
          
          club_investment.update!(
            status: ClubInvestment::STATUS_PENDING, # Set to PENDING, not COMMITTED
            transaction_reference: investment.transaction_reference,
            equity_investment_id: investment.id,
            shares: investment.shares,
            percentage: investment.percentage
          )
          { success: true, authorization_url: initialize_payment_result[:authorization_url] }
        else
          investment.update!(status: 'failed')
          { success: false, error: initialize_payment_result[:error], code: initialize_payment_result[:code] }
        end
      end

      def build_metadata(investment, redirect_url, club_investment)
        {
          user_id: nil, # No individual user for club investments
          campaign_id: investment.campaign.id,
          investment_id: investment.id,
          club_investment_id: club_investment.id,
          club_id: @club.id,
          shares: investment.shares,
          percentage: investment.percentage,
          type: 'club_equity_investment',
          redirect_url: redirect_url,
          title: investment.campaign.title,
          currency: investment.campaign.currency,
          currency_symbol: investment.campaign.currency_symbol,
          valuation: investment.campaign.valuation,
          equity_offered: investment.campaign.equity_offered,
          investor_name: @club.name,
          investor_email: @club.creator.email, # Use club creator's email as fallback
          finalized: false,
          cancellation_window_ended: false,
          metadata: {
            club_investment: true,
            club_name: @club.name,
            club_slug: @club.slug,
            created_by: @current_user.full_name,
            investor_type: 'club'
          }
        }
      end

      def initialize_club_payment(investment, metadata, redirect_url)
        subaccount = Subaccount.find_by(user_id: investment.campaign.fundraiser_id)

        unless subaccount&.subaccount_code.present?
          Rails.logger.error "Missing subaccount for fundraiser: #{investment.campaign.fundraiser_id}"
          return { 
            success: false, 
            error: 'Fundraiser does not meet requirements for raising funds',
            code: 'MISSING_ACCOUNT_NUMBER'
          }
        end

        paystack_service = PaystackService.new
        
        Rails.logger.info "Initializing Paystack transaction for club investment #{investment.id}:"
        Rails.logger.info "  Email: #{metadata[:investor_email]}"
        Rails.logger.info "  Amount: #{investment.amount}"
        Rails.logger.info "  Currency: #{investment.campaign.currency.upcase}"
        Rails.logger.info "  Subaccount: #{subaccount.subaccount_code}"
        Rails.logger.info "  Callback URL: #{redirect_url}"
        
        begin
          response = paystack_service.initialize_transaction(
            email: metadata[:investor_email],
            amount: investment.amount,
            callback_url: redirect_url,
            metadata: metadata,
            subaccount: subaccount.subaccount_code,
            currency: investment.campaign.currency.upcase
          )

          Rails.logger.info "Paystack response: #{response.inspect}"

          if response[:status]
            investment.update!(
              transaction_reference: response[:data][:reference],
              metadata: investment.metadata.merge(metadata)
            )

            Rails.logger.info "Payment initialized successfully for club investment #{investment.id}, reference: #{response[:data][:reference]}"

            {
              success: true,
              authorization_url: response[:data][:authorization_url]
            }
          else
            # Parse the actual error message from Paystack
            error_message = parse_paystack_error(response)
            error_code = response.dig(:body, 'code') || response[:data]&.[](:code) || 'PAYMENT_INIT_FAILED'
            
            Rails.logger.error "Paystack initialization failed: #{error_message}"
            
            # Update investment status to failed
            investment.update!(
              status: EquityInvestment::STATUS_FAILED,
              metadata: investment.metadata.merge(
                'payment_error' => error_message,
                'payment_error_code' => error_code,
                'payment_failed_at' => Time.current.iso8601,
                'paystack_response' => response
              )
            )
            
            {
              success: false, 
              error: error_message,
              code: error_code
            }
          end
        rescue => e
          Rails.logger.error "Exception during payment initialization: #{e.message}\n#{e.backtrace.join("\n")}"
          # Update investment status to failed
          investment.update!(
            status: EquityInvestment::STATUS_FAILED,
            metadata: investment.metadata.merge(
              'payment_exception' => e.message,
              'payment_failed_at' => Time.current.iso8601
            )
          )
          
          {
            success: false, 
            error: "Payment service error: #{e.message}",
            code: 'PAYMENT_SERVICE_ERROR'
          }
        end
      end

      def parse_paystack_error(response)
        # Try to extract the actual error message from Paystack response
        if response[:body].is_a?(String)
          begin
            parsed_body = JSON.parse(response[:body])
            return parsed_body['message'] if parsed_body['message']
          rescue JSON::ParserError
            # If parsing fails, use the original message
          end
        elsif response[:body].is_a?(Hash)
          return response[:body]['message'] if response[:body]['message']
        end
        
        # Fallback to the general message
        response[:message] || 'Payment initialization failed'
      end
    end
  end
end