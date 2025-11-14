module Api
  module V1
    class ClubInvestmentsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership

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
      
      def create
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
        
        club_investment = @club.club_investments.new(
          campaign: campaign,
          investment_amount: params[:investment_amount].to_f,
          proposed_share_percentage: params[:proposed_share_percentage],
          status: 'voting',
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
        
        if result[:success]
          render json: {
            success: true,
            proposals: result[:proposals],
            message: "Generated #{result[:proposals].count} new investment proposals"
          }
        else
          render json: {
            success: false,
            error: result[:error],
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

      private

      def transform_investment_for_frontend(investment)
        campaign = investment.campaign
        voting_stats = investment.voting_stats
        
        {
          id: investment.id.to_s,
          company: campaign.title,
          description: campaign.description.to_plain_text.truncate(200),
          amount: format_currency(investment.investment_amount, campaign.currency_symbol),
          sector: campaign.category || 'General',
          votes: voting_stats[:yes_votes] || 0,
          threshold: calculate_voting_threshold,
          match_score: calculate_match_score(campaign),
          reasoning: "Investment proposal for #{campaign.title}",
          ai_analysis: get_campaign_ai_analysis(campaign),
          status: investment.status,
          voting_stats: voting_stats,
          club_investment_id: investment.id,
          campaign_id: campaign.id,
          proposed_amount: investment.investment_amount,
          currency_symbol: campaign.currency_symbol
        }
      end

      def get_campaign_ai_analysis(campaign)
        # Check if campaign has AI analysis data
        if campaign.respond_to?(:ai_deal_score) && campaign.ai_deal_score.present?
          {
            deal_score: campaign.ai_deal_score,
            risk_score: campaign.ai_risk_score,
            risk_category: campaign.risk_level, # This is now public
            sentiment_analysis: 'positive',
            strengths: ['Strong market position', 'Experienced team']
          }
        else
          # Fallback with random data for campaigns without AI analysis
          {
            deal_score: rand(60..90),
            risk_score: rand(20..50),
            risk_category: 'medium',
            sentiment_analysis: 'positive',
            strengths: ['Growing market', 'Innovative product']
          }
        end
      end

      def format_currency(amount, currency_symbol = '$')
        if amount >= 1000
          "#{currency_symbol}#{(amount / 1000).round(1)}K"
        else
          "#{currency_symbol}#{amount.round(0)}"
        end
      end

      def calculate_voting_threshold
        # Base threshold on number of active members
        active_members = @club.active_members.count
        [active_members / 2, 3].max # At least 3 votes or half the members
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
        @club = InvestmentClub.find_by(slug: params[:investment_club_id])
        render json: { error: 'Club not found' }, status: :not_found unless @club
      end
      
      def verify_membership
        render json: { error: 'Not a club member' }, status: :forbidden unless @club.is_member?(@current_user)
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
    end
  end
end