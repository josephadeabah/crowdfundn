# app/controllers/api/v1/club_investments_controller.rb
module Api
  module V1
    class ClubInvestmentsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership
      before_action :set_investment, only: [:show, :update, :vote, :execute, :certificate_status, :generate_certificate, :download_certificate]

      # ADD THESE REQUIRE STATEMENTS
      require Rails.root.join('app/services/ai/club_recommendation_service')
      require Rails.root.join('app/services/ai/club_investment_proposal_service')
      
      def index
        # Filter by status if provided
        investments = @club.club_investments.includes(:campaign).order(created_at: :desc)
        
        if params[:status].present?
          investments = investments.where(status: params[:status])
        end
        
        # Transform investments for frontend
        transformed_investments = investments.map do |investment|
          transform_investment_for_frontend(investment)
        end
        
        render json: {
          success: true,
          investments: transformed_investments
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
          return render json: { error: 'Campaign not found' }, status: :not_found
        end
        
        # Validate investment amount
        validation_result = validate_investment_amount(params[:investment_amount].to_f, campaign)
        unless validation_result[:valid]
          return render json: { 
            success: false, 
            error: validation_result[:message] 
          }, status: :unprocessable_entity
        end
        
        # NEW: Different flow for equity investments vs regular voting investments
        if campaign.is_a?(EquityCampaign)
          # Direct equity investment flow (no voting required)
          club_investment = @club.club_investments.new(
            campaign: campaign,
            investment_amount: params[:investment_amount].to_f,
            status: ClubInvestment::STATUS_PENDING,  # FIX: Use the constant from model
            created_by: @current_user
          )
          
          if club_investment.save
            # Execute the investment immediately for equity campaigns
            result = execute_club_investment(club_investment)
            
            if result[:success]
              render json: { 
                success: true, 
                club_investment: transform_investment_for_frontend(club_investment.reload),
                authorization_url: result[:authorization_url],
                message: 'Equity investment initiated successfully'
              }, status: :created
            else
              club_investment.destroy
              render json: { 
                success: false, 
                error: result[:error] 
              }, status: :unprocessable_entity
            end
          else
            render json: { 
              success: false, 
              errors: club_investment.errors.full_messages 
            }, status: :unprocessable_entity
          end
        else
          # Regular voting-based investment flow (existing functionality)
          club_investment = @club.club_investments.new(
            campaign: campaign,
            investment_amount: params[:investment_amount].to_f,
            proposed_share_percentage: params[:proposed_share_percentage],
            status: ClubInvestment::STATUS_VALUES[:voting],  # FIX: Use the constant from model
            created_by: @current_user,
            voting_session_id: SecureRandom.uuid
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
              errors: club_investment.errors.full_messages 
            }, status: :unprocessable_entity
          end
        end
      end
      
      # NEW: Execute equity investment after creation
      def execute
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'This investment type requires voting approval' 
          }, status: :unprocessable_entity
        end

        # Check if club has sufficient balance
        unless @club.can_invest?(@investment.investment_amount)
          return render json: { 
            success: false, 
            error: 'Club does not have sufficient balance for this investment' 
          }, status: :unprocessable_entity
        end

        result = execute_club_investment(@investment)
        
        if result[:success]
          render json: { 
            success: true, 
            investment: transform_investment_for_frontend(@investment.reload),
            authorization_url: result[:authorization_url]
          }
        else
          render json: { 
            success: false, 
            error: result[:error] 
          }, status: :unprocessable_entity
        end
      end

      # NEW: Certificate endpoints for equity investments
      def certificate_status
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'Certificates only available for equity investments' 
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
            error: 'Certificates only available for equity investments' 
          }, status: :unprocessable_entity
        end

        unless @investment.successful?
          render json: { 
            success: false, 
            error: 'Certificate can only be generated for successful investments' 
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
            error: 'Failed to generate certificate' 
          }, status: :unprocessable_entity
        end
      end

      def download_certificate
        unless @investment.campaign.is_a?(EquityCampaign)
          return render json: { 
            success: false, 
            error: 'Certificates only available for equity investments' 
          }, status: :unprocessable_entity
        end

        unless @investment.certificate_present?
          render json: { 
            success: false, 
            error: 'Certificate not found' 
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
            error: 'Voting period has ended for this investment' 
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
            error: result[:error] 
          }, status: :unprocessable_entity
        end
      end
      
      # Generate new proposals
      def generate_proposals
        limit = params[:limit]&.to_i || 5
        
        proposal_service = ClubInvestmentProposalService.new(@club, @current_user)
        result = proposal_service.generate_proposals_from_ai_recommendations(limit: limit)
        
        if result[:success] || result[:proposals].any?
          # Return success even if there were some duplicates, as long as we have proposals
          render json: {
            success: true,
            proposals: result[:proposals],
            message: "Generated #{result[:proposals].count} investment proposals"
          }
        else
          render json: {
            success: false,
            error: result[:error] || 'No proposals could be generated',
            proposals: []
          }, status: :unprocessable_entity
        end
      end
      
      # Get AI recommendations (existing but updated)
      def ai_recommendations
        begin
          limit = params[:limit]&.to_i || 10
          
          # Use the ClubRecommendationService to get AI-powered recommendations
          recommendation_service = AI::ClubRecommendationService.new(@club, @current_user)
          result = recommendation_service.recommend_campaigns(limit: limit)
          
          if result[:success]
            # Transform recommendations into the format expected by the frontend
            recommendations = result[:recommendations].map do |rec|
              campaign = rec[:campaign]
              {
                id: campaign.id.to_s,
                company: campaign.title,
                description: campaign.description.to_plain_text.truncate(200),
                amount: format_currency(campaign.goal_amount, campaign.currency_symbol),
                sector: campaign.category || 'General',
                votes: 0, # Start with 0 votes
                threshold: calculate_voting_threshold,
                match_score: rec[:match_score],
                reasoning: rec[:reasoning],
                ai_analysis: rec[:ai_analysis],
                campaign_id: campaign.id, # Add campaign ID for creating proposals
                status: 'recommendation' # Differentiate from actual voting proposals
              }
            end
            
            render json: {
              success: true,
              recommendations: recommendations,
              club_focus: @club.investment_focus,
              mission: @club.mission
            }
          else
            render json: {
              success: false,
              error: result[:error],
              recommendations: []
            }, status: :unprocessable_entity
          end
          
        rescue => e
          Rails.logger.error "AI recommendations error: #{e.message}"
          render json: {
            success: false,
            error: "Failed to generate recommendations",
            recommendations: []
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

      private

      def transform_investment_for_frontend(investment)
        campaign = investment.campaign
        
        # Ensure we have a campaign object with fallbacks
        campaign_data = if campaign
          {
            title: campaign.title,
            description: campaign.description&.to_plain_text&.truncate(200) || 'No description available',
            category: campaign.category,
            currency_symbol: campaign.currency_symbol,
            id: campaign.id,
            slug: campaign.slug  # ADD SLUG HERE
          }
        else
          {
            title: 'Unknown Company',
            description: 'No description available',
            category: 'General',
            currency_symbol: '$',
            id: nil,
            slug: nil
          }
        end
        
        voting_stats = investment.voting_stats || {}
        
        # NEW: Include equity investment data if applicable
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
          is_equity_investment: campaign.is_a?(EquityCampaign)
        }

        # Add voting data for voting-based investments
        if !campaign.is_a?(EquityCampaign)
          base_data.merge!({
            votes: voting_stats[:yes_votes] || 0,
            threshold: calculate_voting_threshold,
            match_score: calculate_match_score(campaign),
            reasoning: "Investment proposal for #{campaign_data[:title]}",
            ai_analysis: get_campaign_ai_analysis(campaign),
            voting_stats: voting_stats
          })
        else
          # Add equity investment data
          base_data.merge!({
            shares: investment.shares,
            percentage: investment.percentage,
            certificate_url: investment.certificate_url,
            certificate_number: investment.certificate_number,
            current_value: investment.current_value,
            total_returns: investment.total_returns,
            roi: investment.roi,
            investment_date: investment.investment_date
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
          render json: { error: 'Club not found' }, status: :not_found 
          return
        end
        
        Rails.logger.info "Found club: #{@club.name} (ID: #{@club.id}, Slug: #{@club.slug})"
      end
      
      def verify_membership
        render json: { error: 'Not a club member' }, status: :forbidden unless @club.is_member?(@current_user)
      end

      def set_investment
        @investment = @club.club_investments.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Investment not found' }, status: :not_found
      end
      
      def validate_investment_amount(amount, campaign)
        if amount <= 0
          return { valid: false, message: 'Investment amount must be greater than 0' }
        end
        
        if campaign.is_a?(EquityCampaign)
          if amount < campaign.minimum_investment
            return { valid: false, message: "Minimum investment is #{campaign.currency_symbol}#{campaign.minimum_investment}" }
          end
          
          if campaign.maximum_investment > 0 && amount > campaign.maximum_investment
            return { valid: false, message: "Maximum investment is #{campaign.currency_symbol}#{campaign.maximum_investment}" }
          end
        end
        
        { valid: true }
      end

      # NEW: Execute club equity investment
      def execute_club_investment(club_investment)
        campaign = club_investment.campaign
        
        # Use the existing campaign investment creation logic
        investment = campaign.create_investment(nil, club_investment.investment_amount)
        
        unless investment
          return { success: false, error: 'Failed to create investment: Campaign validation failed' }
        end

        # Update investment with club information
        investment.update!(
          email: @club.contact_email || @club.creator.email,
          full_name: @club.name,
          metadata: investment.metadata.merge(
            club_investment: true,
            club_id: @club.id,
            club_name: @club.name
          )
        )

        # Generate callback URL
        secure_random_uuid = SecureRandom.uuid
        campaign_identifier = campaign.slug || campaign.id
        redirect_url = Rails.application.routes.url_helpers.campaign_url(campaign_identifier, host: 'bantuhive.com') + "?#{secure_random_uuid}"

        # Prepare metadata
        metadata = build_metadata(investment, redirect_url, club_investment)

        # Initialize payment using existing logic
        initialize_payment_result = initialize_club_payment(investment, metadata, redirect_url)
        
        if initialize_payment_result[:success]
          # Deduct amount from club balance
          if @club.deduct_balance(club_investment.investment_amount)
            club_investment.update!(
              status: ClubInvestment::STATUS_COMMITTED,  # FIX: Use the constant from model
              transaction_reference: investment.transaction_reference,
              equity_investment_id: investment.id,
              shares: investment.shares,
              percentage: investment.percentage
            )
            { success: true, authorization_url: initialize_payment_result[:authorization_url] }
          else
            investment.update!(status: ClubInvestment::STATUS_FAILED)  # FIX: Use the constant from model
            { success: false, error: 'Insufficient club balance' }
          end
        else
          investment.update!(status: ClubInvestment::STATUS_FAILED)  # FIX: Use the constant from model
          { success: false, error: initialize_payment_result[:error] }
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
          investor_email: @club.contact_email || @club.creator.email,
          finalized: false,
          cancellation_window_ended: false,
          metadata: {
            club_investment: true,
            club_name: @club.name,
            club_slug: @club.slug
          }
        }
      end

      def initialize_club_payment(investment, metadata, redirect_url)
        subaccount = Subaccount.find_by(user_id: investment.campaign.fundraiser_id)

        unless subaccount&.subaccount_code.present?
          return { success: false, error: 'Fundraiser does not meet requirements for raising funds' }
        end

        paystack_service = PaystackService.new
        response = paystack_service.initialize_transaction(
          email: metadata[:investor_email],
          amount: investment.amount,
          callback_url: redirect_url,
          metadata: metadata,
          subaccount: subaccount.subaccount_code,
          currency: investment.campaign.currency.upcase
        )

        if response[:status]
          investment.update!(
            transaction_reference: response[:data][:reference],
            metadata: metadata
          )

          { success: true, authorization_url: response[:data][:authorization_url] }
        else
          { success: false, error: response[:message] }
        end
      end
    end
  end
end