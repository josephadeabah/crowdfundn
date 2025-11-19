# app/services/club_portfolio_service.rb
class ClubPortfolioService
  def initialize(investment_club)
    @club = investment_club
  end

  def portfolio_overview
    # Get all investments including equity investments
    investments = @club.club_investments.includes(:campaign)
    
    # Filter successful investments
    successful_investments = investments.select do |investment|
      investment.status.in?(%w[successful executed committed])
    end

    # Calculate portfolio metrics
    total_invested = successful_investments.sum(&:investment_amount).to_f
    
    # Calculate current value - use current_value if available, otherwise investment_amount
    total_value = successful_investments.sum do |investment|
      investment.current_value || investment.investment_amount
    end
    
    total_return = total_value - total_invested
    return_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0

    # Count unique campaigns
    campaigns_invested = successful_investments.map(&:campaign_id).uniq.count

    {
      total_invested: total_invested,
      total_value: total_value,
      total_return: total_return,
      return_percentage: return_percentage,
      active_investments: successful_investments.count,
      investments: transform_investments_for_portfolio(successful_investments),
      campaigns_invested: campaigns_invested,
      successful_count: successful_investments.count
    }
  end

  # ADD THIS MISSING METHOD:
  def performance_analytics
    portfolio = portfolio_overview
    investments = @club.club_investments.includes(:campaign)
    
    # Calculate additional analytics
    successful_investments = investments.select { |inv| inv.status.in?(%w[successful executed committed]) }
    pending_investments = investments.select { |inv| inv.status.in?(%w[pending voting]) }
    
    # Calculate ROI by sector/category
    sector_performance = calculate_sector_performance(successful_investments)
    
    # Time-based analytics
    monthly_performance = calculate_monthly_performance(investments)
    
    {
      portfolio_summary: portfolio,
      performance_metrics: {
        total_members: @club.active_members.count,
        total_contributions: @club.total_contributions,
        member_engagement: calculate_member_engagement,
        investment_success_rate: calculate_investment_success_rate(investments),
        average_investment_size: successful_investments.present? ? (portfolio[:total_invested] / successful_investments.count).round(2) : 0
      },
      sector_breakdown: sector_performance,
      time_analysis: monthly_performance,
      investment_status_breakdown: {
        successful: successful_investments.count,
        pending: pending_investments.count,
        failed: investments.select { |inv| inv.status == 'failed' }.count,
        voting: investments.select { |inv| inv.status == 'voting' }.count
      }
    }
  end

  def member_portfolio(user)
    membership = @club.membership_for(user)
    return {} unless membership&.active?

    # Get club portfolio
    club_portfolio = portfolio_overview
    
    # Calculate member's share
    member_share_percentage = membership.contributed_share.to_f
    share_multiplier = member_share_percentage / 100.0

    {
      member_contributed_share: member_share_percentage,
      total_contributed: membership.total_contributed,
      portfolio_share: {
        invested: club_portfolio[:total_invested] * share_multiplier,
        current_value: club_portfolio[:total_value] * share_multiplier,
        returns: club_portfolio[:total_return] * share_multiplier,
        return_percentage: club_portfolio[:return_percentage]
      },
      voting_participation: calculate_voting_participation(user)
    }
  end

  def approved_campaigns
    ApprovedCampaign.for_club(@club).includes(
      campaign: [:fundraiser],
      club_investment: [:votes]
    ).map do |approved_campaign|
      campaign = approved_campaign.campaign
      club_investment = approved_campaign.club_investment
      
      # Get voting stats if available
      voting_stats = if club_investment
        {
          total_votes: club_investment.votes.count,
          yes_votes: club_investment.votes.where(vote_type: 'yes').count,
          no_votes: club_investment.votes.where(vote_type: 'no').count,
          approval_percentage: club_investment.votes.count > 0 ? 
            (club_investment.votes.where(vote_type: 'yes').count.to_f / club_investment.votes.count * 100).round(2) : 0,
          total_members: @club.current_members_count,
          all_members_voted: club_investment.votes.count >= @club.current_members_count,
          threshold_met: club_investment.voting_threshold_met?
        }
      else
        {
          total_votes: 0,
          yes_votes: 0,
          no_votes: 0,
          approval_percentage: 0,
          total_members: @club.current_members_count,
          all_members_voted: false,
          threshold_met: false
        }
      end

      {
        id: approved_campaign.id,
        campaign: {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description&.to_plain_text&.truncate(200) || 'No description available',
          category: campaign.category,
          goal_amount: campaign.goal_amount.to_f,
          current_amount: campaign.current_amount.to_f,
          currency: campaign.currency,
          currency_symbol: campaign.currency_symbol,
          slug: campaign.slug,
          fundraiser: {
            id: campaign.fundraiser.id,
            name: campaign.fundraiser.full_name
          }
        },
        club_investment: club_investment ? {
          id: club_investment.id,
          proposed_amount: club_investment.investment_amount.to_f,
          proposed_share_percentage: club_investment.proposed_share_percentage.to_f,
          voting_stats: voting_stats
        } : nil,
        approved_at: approved_campaign.created_at,
        voting_stats: voting_stats
      }
    end
  end

  private

  def transform_investments_for_portfolio(investments)
    investments.map do |investment|
      current_value = investment.current_value || investment.investment_amount
      roi = calculate_roi(investment)
      
      {
        id: investment.id,
        investment_amount: investment.investment_amount,
        current_value: current_value,
        shares: investment.shares,
        percentage: investment.percentage,
        status: investment.status,
        investment_date: investment.investment_date,
        roi: roi,
        campaign: {
          id: investment.campaign.id,
          title: investment.campaign.title,
          company_name: investment.campaign.respond_to?(:company_name) ? investment.campaign.company_name : investment.campaign.title,
          valuation: investment.campaign.valuation,
          currency: investment.campaign.currency,
          currency_symbol: investment.campaign.currency_symbol,
          category: investment.campaign.category
        }
      }
    end
  end

  def calculate_roi(investment)
    current_value = investment.current_value || investment.investment_amount
    investment_amount = investment.investment_amount
    
    return 0 if investment_amount.zero?
    
    ((current_value - investment_amount) / investment_amount * 100).round(2)
  end

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

  def calculate_sector_performance(investments)
    sectors = investments.group_by do |inv|
      inv.campaign.category || 'Other'
    end
    
    sectors.transform_values do |sector_investments|
      total_invested = sector_investments.sum(&:investment_amount)
      total_value = sector_investments.sum { |inv| inv.current_value || inv.investment_amount }
      total_return = total_value - total_invested
      roi_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0
      
      {
        count: sector_investments.count,
        total_invested: total_invested,
        total_value: total_value,
        total_return: total_return,
        roi_percentage: roi_percentage
      }
    end
  end

  def calculate_monthly_performance(investments)
    # Group investments by month
    monthly_data = investments.group_by do |inv|
      inv.created_at.beginning_of_month
    end
    
    monthly_data.transform_values do |month_investments|
      {
        investments_count: month_investments.count,
        total_invested: month_investments.sum(&:investment_amount),
        successful_investments: month_investments.count { |inv| inv.status.in?(%w[successful executed committed]) }
      }
    end.sort.to_h
  end

  def calculate_member_engagement
    total_members = @club.active_members.count
    return 0 if total_members.zero?
    
    # Members who have voted recently
    active_voters = Vote.where(
      votable_type: 'ClubInvestment',
      votable_id: @club.club_investments.pluck(:id),
      user_id: @club.active_members.pluck(:id)
    ).distinct.count(:user_id)
    
    (active_voters.to_f / total_members * 100).round(2)
  end

  def calculate_investment_success_rate(investments)
    total = investments.count
    return 0 if total.zero?
    
    successful = investments.count { |inv| inv.status.in?(%w[successful executed committed]) }
    (successful.to_f / total * 100).round(2)
  end
end