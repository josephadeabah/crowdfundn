class ClubPortfolioService
  def initialize(investment_club)
    @club = investment_club
  end

  def portfolio_overview    
    # Get approved campaigns instead
    approved_campaigns_count = ApprovedCampaign.where(investment_club: @club).count
    
    {
      approved_campaigns_count: approved_campaigns_count,
      pending_investments: @club.club_investments.voting.count,
      total_contributions: @club.total_contributions,
      current_balance: @club.current_balance
    }
  end

  def member_portfolio(user)
    membership = @club.membership_for(user)
    return {} unless membership&.active?    
    {
      member_contributed_share: membership.contributed_share,
      total_contributed: membership.total_contributed,
      voting_participation: calculate_voting_participation(user)
    }
  end

  def approved_campaigns
    ApprovedCampaign.for_club(@club).map do |approved_campaign|
      campaign = approved_campaign.campaign
      club_investment = approved_campaign.club_investment
      
      {
        id: approved_campaign.id,
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          category: campaign.category,
          goal_amount: campaign.goal_amount,
          current_amount: campaign.current_amount,
          currency: campaign.currency,
          currency_symbol: campaign.currency_symbol,
          fundraiser: {
            id: campaign.fundraiser.id,
            name: campaign.fundraiser.full_name
          }
        },
        club_investment: {
          id: club_investment.id,
          proposed_amount: club_investment.investment_amount,
          proposed_share_percentage: club_investment.proposed_share_percentage,
          voting_stats: club_investment.voting_stats
        },
        approved_at: approved_campaign.created_at
      }
    end
  end

  private

  def calculate_voting_participation(user)
    total_votable_items = @club.club_investments.voting.count
    return 0 if total_votable_items.zero?
    
    user_votes = Vote.where(
      votable_type: 'ClubInvestment',
      votable_id: @club.club_investments.voting.pluck(:id),
      user: user
    ).count
    
    (user_votes.to_f / total_votable_items * 100).round(2)
  end
end