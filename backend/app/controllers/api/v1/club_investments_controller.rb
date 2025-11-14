# app/controllers/api/v1/club_investments_controller.rb
module Api
  module V1
    class ClubInvestmentsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership
      
      # ADD THIS INDEX ACTION
      def index
        investments = @club.club_investments.includes(:campaign).order(created_at: :desc)
        
        render json: {
          investments: investments.map { |investment| ClubInvestmentSerializer.new(investment).as_json }
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
          status: 'pending'
        )
        
        if club_investment.save
          # Start voting process
          club_investment.start_voting
          
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
        club_investment = @club.club_investments.find(params[:investment_id])
        
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
          # Check if investment reached approval threshold
          if club_investment.approved?
            # Auto-execute the investment if approved
            execute_investment_after_approval(club_investment)
          end
          
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
      
      def execute
        club_investment = @club.club_investments.find(params[:investment_id])
        
        # Only allow execution if approved and not already executed
        unless club_investment.approved? && club_investment.voting?
          return render json: { 
            success: false, 
            error: 'Investment cannot be executed. Either not approved or already processed.' 
          }, status: :unprocessable_entity
        end
        
        result = execute_investment(club_investment)
        
        if result[:success]
          render json: { 
            success: true, 
            club_investment: ClubInvestmentSerializer.new(club_investment.reload).as_json,
            transfer_reference: result[:transfer_reference]
          }
        else
          render json: { 
            success: false, 
            error: result[:error] 
          }, status: :unprocessable_entity
        end
      end
      
      # Add these methods for the additional routes
      def ai_recommendation
        club_investment = @club.club_investments.find(params[:investment_id])
        
        # Use your existing AI service to generate recommendations
        ai_service = AI::DealScoringService.new
        recommendation = ai_service.generate_club_recommendation(club_investment)
        
        render json: {
          success: true,
          recommendation: recommendation
        }
      end
      
      def voting_insights
        club_investment = @club.club_investments.find(params[:investment_id])
        
        # Use your existing VotingService
        voting_service = VotingService.new(club_investment, @current_user, club_investment.voting_session_id)
        stats = voting_service.voting_stats
        
        # Get additional insights
        member_votes = Vote.where(
          votable: club_investment, 
          voting_session_id: club_investment.voting_session_id
        ).includes(:user).map do |vote|
          {
            user_name: vote.user.full_name,
            vote_type: vote.vote_type,
            reason: vote.reason,
            voted_at: vote.created_at
          }
        end
        
        insights = {
          stats: stats,
          member_votes: member_votes,
          voting_deadline: club_investment.voting_ends_at,
          approval_threshold: 60.0, # Your club's threshold
          is_approved: calculate_approval_percentage(stats) >= 60.0,
          time_remaining: time_remaining(club_investment.voting_ends_at)
        }
        
        render json: {
          success: true,
          insights: insights
        }
      end
      
      # app/controllers/api/v1/club_investments_controller.rb (add this action)
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
                threshold: calculate_voting_threshold(campaign),
                match_score: rec[:match_score],
                reasoning: rec[:reasoning],
                ai_analysis: rec[:ai_analysis]
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

      def format_currency(amount, currency_symbol = '$')
        "#{currency_symbol}#{amount.to_i}K"
      end

      def calculate_voting_threshold(campaign)
        # Base threshold on campaign size and complexity
        base_threshold = 5
        
        # Adjust based on investment amount
        amount_factor = campaign.goal_amount.to_i / 100000 # 1 additional vote per $100K
        amount_adjustment = [amount_factor, 10].min # Cap at 10 additional votes
        
        # Adjust based on campaign risk (simplified)
        risk_adjustment = if campaign.respond_to?(:ai_risk_score) && campaign.ai_risk_score
                            campaign.ai_risk_score > 60 ? 3 : 0
                          else
                            0
                          end
        
        base_threshold + amount_adjustment + risk_adjustment
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
      
      def execute_investment_after_approval(club_investment)
        # This can be called immediately or scheduled
        ClubInvestmentExecutionJob.perform_later(club_investment.id)
      end
      
      def execute_investment(club_investment)
        investment_service = ClubInvestmentService.new(club_investment)
        investment_service.execute_investment
      end
      
      def calculate_approval_percentage(stats)
        total_votes = stats[:total_votes] || 0
        yes_votes = stats[:vote_breakdown]&.fetch('yes', 0) || 0
        total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0
      end
      
      def time_remaining(voting_ends_at)
        return 'ended' if voting_ends_at.nil? || voting_ends_at < Time.current
        
        diff = voting_ends_at - Time.current
        if diff > 1.day
          "#{(diff / 1.day).floor} days"
        elsif diff > 1.hour
          "#{(diff / 1.hour).floor} hours"
        else
          "#{(diff / 1.minute).floor} minutes"
        end
      end
    end
  end
end