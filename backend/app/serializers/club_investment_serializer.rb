# app/serializers/club_investment_serializer.rb
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
      ),
      # ADD THESE CRITICAL FIELDS FOR CANCELLATION
      can_be_cancelled: @investment.committed? && 
                       (@investment.cancel_window_expires_at.nil? || 
                        @investment.cancel_window_expires_at > Time.current),
      cancel_window_expires_at: @investment.cancel_window_expires_at,
      committed_at: @investment.committed_at,
      # Add equity investment specific fields
      shares: @investment.shares,
      percentage: @investment.percentage,
      certificate_url: @investment.certificate_url,
      certificate_number: @investment.certificate_number,
      current_value: @investment.current_value,
      total_returns: @investment.total_returns,
      roi: @investment.roi,
      investment_date: @investment.investment_date,
      is_equity_investment: @investment.campaign.is_a?(EquityCampaign)
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