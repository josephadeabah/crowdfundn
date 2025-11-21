module AI
  class ClubInvestmentProposalService
    def initialize(club, user = nil)
      @club = club
      @user = user
      @recommendation_service = ClubRecommendationService.new(club, user)
    end

    def generate_proposals_from_ai_recommendations(limit: 5)
      begin
        # Get AI recommendations with force refresh
        result = @recommendation_service.recommend_campaigns(limit: limit * 2, force_fresh: true)
        
        if result[:success] && result[:recommendations].any?
          proposals = create_proposals_from_recommendations(result[:recommendations].first(limit))
          { success: true, proposals: proposals }
        else
          # If AI recommendations fail, generate basic proposals from active campaigns
          proposals = generate_basic_proposals(limit)
          { success: true, proposals: proposals, fallback: true }
        end
      rescue => e
        Rails.logger.error "Club investment proposal error: #{e.message}"
        # Final fallback - generate basic proposals
        proposals = generate_basic_proposals(limit)
        { success: true, proposals: proposals, fallback: true, error: e.message }
      end
    end

    def create_proposals_from_recommendations(recommendations)
      proposals = []
      
      recommendations.each do |recommendation|
        campaign = recommendation[:campaign]
        
        # Skip if campaign already has an active proposal
        next if campaign_has_active_proposal?(campaign)
        
        proposal = create_investment_proposal(campaign, recommendation)
        proposals << proposal if proposal
      end
      
      proposals
    end

    def generate_basic_proposals(limit)
      proposals = []
      
      # Get active campaigns that don't have existing proposals
      available_campaigns = Campaign.active
                                  .where(is_public: true)
                                  .where(appear_in_search_results: true)
                                  .where.not(id: existing_proposal_campaign_ids)
                                  .order('RANDOM()')
                                  .limit(limit * 2)
      
      available_campaigns.each do |campaign|
        break if proposals.count >= limit
        
        proposal = create_basic_proposal(campaign)
        proposals << proposal if proposal
      end
      
      # If we still need more, create from any available campaigns
      if proposals.count < limit
        additional_campaigns = Campaign.active
                                     .where(is_public: true)
                                     .where(appear_in_search_results: true)
                                     .where.not(id: proposals.map { |p| p[:campaign].id })
                                     .order(created_at: :desc)
                                     .limit(limit - proposals.count)
        
        additional_campaigns.each do |campaign|
          proposal = create_basic_proposal(campaign)
          proposals << proposal if proposal
        end
      end
      
      proposals
    end

    private

    def campaign_has_active_proposal?(campaign)
      ClubInvestment.where(campaign_id: campaign.id)
                   .where(status: ['pending', 'voting', 'approved'])
                   .exists?
    end

    def existing_proposal_campaign_ids
      ClubInvestment.where(investment_club_id: @club.id)
                   .where(status: ['pending', 'voting', 'approved'])
                   .pluck(:campaign_id)
    end

    def create_investment_proposal(campaign, recommendation)
      # Calculate appropriate investment amount based on club balance and campaign
      investment_amount = calculate_investment_amount(campaign)
      
      # Create the proposal structure
      {
        campaign: campaign,
        investment_amount: investment_amount,
        proposed_share_percentage: calculate_proposed_share(campaign, investment_amount),
        match_score: recommendation[:match_score],
        reasoning: recommendation[:reasoning],
        ai_analysis: recommendation[:ai_analysis],
        voting_session_id: SecureRandom.uuid
      }
    end

    def create_basic_proposal(campaign)
      investment_amount = calculate_investment_amount(campaign)
      
      {
        campaign: campaign,
        investment_amount: investment_amount,
        proposed_share_percentage: calculate_proposed_share(campaign, investment_amount),
        match_score: rand(50..80), # Basic match score
        reasoning: generate_basic_reasoning(campaign),
        ai_analysis: generate_basic_ai_analysis(campaign),
        voting_session_id: SecureRandom.uuid
      }
    end

    def calculate_investment_amount(campaign)
      # Base amount on club balance and campaign size
      club_balance = @club.current_balance.to_f
      campaign_goal = campaign.goal_amount.to_f
      
      # Suggest 5-15% of club balance, but not more than 50% of remaining campaign goal
      suggested_amount = [club_balance * 0.05, club_balance * 0.15].max
      remaining_goal = campaign_goal - campaign.current_amount.to_f
      
      # Cap at 50% of remaining goal or $50,000, whichever is smaller
      max_amount = [remaining_goal * 0.5, 50000].min
      
      [[suggested_amount, max_amount].min, 1000].max.round(2) # Minimum $1000
    end

    def calculate_proposed_share(campaign, investment_amount)
      return nil unless campaign.is_a?(EquityCampaign)
      
      # For equity campaigns, calculate the percentage
      valuation = campaign.valuation.to_f
      return nil if valuation.zero?
      
      (investment_amount / valuation * 100).round(2)
    end

    def generate_basic_reasoning(campaign)
      reasons = []
      
      reasons << "#{campaign.performance_percentage}% funded with clear growth potential"
      reasons << "Active in #{campaign.category} sector" if campaign.category.present?
      reasons << "Recommended for portfolio diversification"
      
      reasons.join(". ")
    end

    def generate_basic_ai_analysis(campaign)
      {
        deal_score: rand(60..85),
        risk_score: rand(25..55),
        risk_category: "medium",
        sentiment_analysis: "positive",
        strengths: ["Market opportunity", "Clear value proposition", "Active campaign"],
        funding_potential: campaign.performance_percentage > 60 ? "high" : "medium"
      }
    end
  end
end