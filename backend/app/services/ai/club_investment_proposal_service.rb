class ClubInvestmentProposalService
  def initialize(club, user = nil)
    @club = club
    @user = user
  end

  def generate_proposals_from_ai_recommendations(limit: 5)
    begin
      # Get AI recommendations
      recommendation_service = AI::ClubRecommendationService.new(@club, @user)
      result = recommendation_service.recommend_campaigns(limit: limit)
      
      if result[:success]
        proposals = result[:recommendations].map do |rec|
          campaign = rec[:campaign]
          
          # Create a club investment proposal
          club_investment = @club.club_investments.create!(
            campaign: campaign,
            investment_amount: calculate_proposed_amount(campaign),
            proposed_share_percentage: calculate_proposed_share_percentage(campaign),
            status: 'voting',
            created_by: @user,
            voting_session_id: SecureRandom.uuid
          )
          
          # Return the proposal data
          {
            id: club_investment.id.to_s,
            company: campaign.title,
            description: campaign.description.to_plain_text.truncate(200),
            amount: format_currency(club_investment.investment_amount, campaign.currency_symbol),
            sector: campaign.category || 'General',
            votes: 0,
            threshold: calculate_voting_threshold,
            match_score: rec[:match_score],
            reasoning: rec[:reasoning],
            ai_analysis: rec[:ai_analysis],
            status: 'voting',
            voting_stats: club_investment.voting_stats,
            club_investment_id: club_investment.id
          }
        end
        
        { success: true, proposals: proposals }
      else
        { success: false, error: result[:error], proposals: [] }
      end
      
    rescue => e
      Rails.logger.error "Investment proposal generation error: #{e.message}"
      { success: false, error: e.message, proposals: [] }
    end
  end

  def generate_single_proposal(campaign_id)
    campaign = Campaign.find_by(id: campaign_id)
    return { success: false, error: 'Campaign not found' } unless campaign
    
    # Create a club investment proposal
    club_investment = @club.club_investments.create!(
      campaign: campaign,
      investment_amount: calculate_proposed_amount(campaign),
      proposed_share_percentage: calculate_proposed_share_percentage(campaign),
      status: 'voting',
      created_by: @user,
      voting_session_id: SecureRandom.uuid
    )
    
    proposal = {
      id: club_investment.id.to_s,
      company: campaign.title,
      description: campaign.description.to_plain_text.truncate(200),
      amount: format_currency(club_investment.investment_amount, campaign.currency_symbol),
      sector: campaign.category || 'General',
      votes: 0,
      threshold: calculate_voting_threshold,
      match_score: calculate_match_score(campaign),
      reasoning: "Manual proposal for #{campaign.title}",
      status: 'voting',
      voting_stats: club_investment.voting_stats,
      club_investment_id: club_investment.id
    }
    
    { success: true, proposal: proposal }
  end

  private

  def calculate_proposed_amount(campaign)
    # Base amount on campaign goal and club balance
    club_balance = @club.current_balance
    campaign_goal = campaign.goal_amount
    
    # Propose 5-15% of club balance, capped at 25% of campaign goal
    proposed_percentage = rand(5..15)
    amount_from_balance = (club_balance * proposed_percentage / 100.0)
    max_from_campaign = campaign_goal * 0.25
    
    [amount_from_balance, max_from_campaign, 1000].max.round(2) # Minimum $1000
  end

  def calculate_proposed_share_percentage(campaign)
    return nil unless campaign.is_a?(EquityCampaign)
    
    # For equity campaigns, propose 1-5% ownership
    rand(1.0..5.0).round(2)
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
    score += (campaign.performance_percentage * 0.3)
    
    score.clamp(0, 100).round(2)
  end

  def format_currency(amount, currency_symbol = '$')
    if amount >= 1000
      "#{currency_symbol}#{(amount / 1000).round(1)}K"
    else
      "#{currency_symbol}#{amount.round(0)}"
    end
  end
end