class ClubInvestmentSerializer
  def initialize(club_investment)
    @investment = club_investment
  end
  
  def as_json
    {
      id: @investment.id,
      campaign: {
        id: @investment.campaign.id,
        title: @investment.campaign.title,
        category: @investment.campaign.category,
        goal_amount: @investment.campaign.goal_amount,
        current_amount: @investment.campaign.current_amount,
        currency: @investment.campaign.currency,
        currency_symbol: @investment.campaign.currency_symbol
      },
      investment_amount: @investment.investment_amount,
      status: @investment.status,
      voting_session_id: @investment.voting_session_id,
      voting_ends_at: @investment.voting_ends_at,
      created_at: @investment.created_at,
      voting_stats: voting_stats,
      # Add whether this investment has been approved and added to approved campaigns
      in_approved_campaigns: ApprovedCampaign.exists?(
        investment_club: @investment.investment_club,
        campaign: @investment.campaign
      )
    }
  end
  
  private
  
  def voting_stats
    return {} unless @investment.voting_session_id
    
    votes = Vote.where(
      votable: @investment, 
      voting_session_id: @investment.voting_session_id
    )
    
    total_votes = votes.count
    yes_votes = votes.where(vote_type: 'yes').count
    no_votes = votes.where(vote_type: 'no').count
    
    {
      total_votes: total_votes,
      yes_votes: yes_votes,
      no_votes: no_votes,
      approval_percentage: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0,
      threshold_met: @investment.voting_threshold_met?
    }
  end
end