# app/controllers/api/v1/club_investments_controller.rb
module Api
  module V1
    class ClubInvestmentsController < ApplicationController
      before_action :authenticate_request
      before_action :set_club
      before_action :verify_membership
      
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
        
        voting_service = VotingService.new(club_investment, @current_user)
        
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
      
      private
      
      def set_club
        @club = InvestmentClub.find_by(slug: params[:club_id])
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
    end
  end
end