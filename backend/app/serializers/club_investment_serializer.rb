class ClubInvestmentSerializer
  def initialize(club_investment)
    @investment = club_investment
  end
  
  def as_json
    campaign = @investment.campaign
    
    campaign_data = if campaign
      {
        id: campaign.id,
        title: campaign.title,
        category: campaign.category,
        goal_amount: campaign.goal_amount,
        current_amount: campaign.current_amount,
        currency: campaign.currency,
        currency_symbol: campaign.currency_symbol
      }
    else
      {
        id: nil,
        title: 'Unknown Company',
        category: 'General',
        goal_amount: 0,
        current_amount: 0,
        currency: 'USD',
        currency_symbol: '$'
      }
    end
    
    {
      id: @investment.id,
      campaign: campaign_data,
      investment_amount: @investment.investment_amount,
      status: @investment.status,
      voting_session_id: @investment.voting_session_id,
      voting_ends_at: @investment.voting_ends_at,
      created_at: @investment.created_at,
      voting_stats: voting_stats,
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