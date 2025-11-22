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
          description: campaign.description || 'No description available',
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

    # NEW: Portfolio Insights and Advanced Analytics
  def portfolio_insights
    portfolio = portfolio_overview
    investments = @club.club_investments.includes(:campaign)
    successful_investments = investments.select { |inv| inv.status.in?(%w[successful executed committed]) }
    
    {
      performance_insights: performance_insights(portfolio, successful_investments),
      risk_analysis: risk_analysis(successful_investments),
      diversification_metrics: diversification_metrics(successful_investments),
      liquidity_analysis: liquidity_analysis,
      member_engagement_insights: member_engagement_insights,
      investment_trends: investment_trends(investments)
    }
  end

  # NEW: Financial Health Metrics
  def financial_health_metrics
    {
      liquidity_ratios: liquidity_ratios,
      contribution_health: contribution_health,
      investment_efficiency: investment_efficiency_metrics,
      growth_metrics: growth_metrics,
      stability_indicators: stability_indicators
    }
  end

  # NEW: Predictive Analytics
  def predictive_analytics
    {
      growth_projections: growth_projections,
      risk_scenarios: risk_scenarios,
      opportunity_analysis: investment_opportunities,
      cash_flow_forecast: cash_flow_forecast
    }
  end

  # NEW: Comprehensive Analytics Dashboard
  def comprehensive_analytics
    {
      portfolio_overview: portfolio_overview,
      performance_analytics: performance_analytics,
      portfolio_insights: portfolio_insights,
      financial_health: financial_health_metrics,
      predictive_analytics: predictive_analytics,
      member_portfolio: member_portfolio_summary
    }
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

    # NEW: Advanced Analytics Private Methods
  def performance_insights(portfolio, successful_investments)
    return {} if successful_investments.empty?

    best_performer = successful_investments.max_by { |inv| calculate_roi(inv) }
    worst_performer = successful_investments.min_by { |inv| calculate_roi(inv) }
    
    {
      best_performing_investment: {
        campaign: best_performer.campaign.title,
        roi: calculate_roi(best_performer),
        amount: best_performer.investment_amount
      },
      worst_performing_investment: {
        campaign: worst_performer.campaign.title,
        roi: calculate_roi(worst_performer),
        amount: worst_performer.investment_amount
      },
      average_holding_period: calculate_average_holding_period(successful_investments),
      volatility_estimate: estimate_portfolio_volatility(successful_investments),
      sharpe_ratio: calculate_sharpe_ratio(portfolio, successful_investments)
    }
  end

  def risk_analysis(successful_investments)
    return {} if successful_investments.empty?

    {
      concentration_risk: calculate_concentration_risk(successful_investments),
      sector_risk: calculate_sector_risk(successful_investments),
      liquidity_risk: calculate_liquidity_risk_score,
      maximum_drawdown: calculate_maximum_drawdown(successful_investments),
      value_at_risk: calculate_value_at_risk(successful_investments)
    }
  end

  def diversification_metrics(successful_investments)
    return {} if successful_investments.empty?

    sector_diversity = calculate_sector_diversity(successful_investments)
    investment_size_diversity = calculate_investment_size_diversity(successful_investments)
    
    {
      sector_diversity_score: sector_diversity[:score],
      top_sectors: sector_diversity[:top_sectors],
      investment_concentration: investment_size_diversity,
      herfindahl_index: calculate_herfindahl_index(successful_investments),
      recommended_diversification: diversification_recommendations(sector_diversity)
    }
  end

  def liquidity_analysis
    {
      current_ratio: @club.current_balance / [@club.total_invested, 1].max,
      quick_ratio: calculate_quick_ratio,
      cash_flow_coverage: calculate_cash_flow_coverage,
      emergency_fund_sufficiency: calculate_emergency_fund_sufficiency
    }
  end

  def member_engagement_insights
    total_members = @club.active_members.count
    return {} if total_members.zero?

    voting_members = Vote.where(
      votable_type: 'ClubInvestment',
      votable_id: @club.club_investments.pluck(:id),
      user_id: @club.active_members.pluck(:id)
    ).distinct.count(:user_id)

    contributing_members = @club.investment_club_contributions.completed.distinct.count(:user_id)
    
    {
      voting_participation_rate: (voting_members.to_f / total_members * 100).round(2),
      contribution_participation_rate: (contributing_members.to_f / total_members * 100).round(2),
      engagement_score: calculate_overall_engagement_score(voting_members, contributing_members, total_members),
      top_contributors: identify_top_contributors,
      engagement_trend: analyze_engagement_trend
    }
  end

  def investment_trends(investments)
    monthly_trends = investments.group_by { |inv| inv.created_at.beginning_of_month }
    
    trend_data = monthly_trends.transform_values do |month_investments|
      {
        count: month_investments.count,
        total_amount: month_investments.sum(&:investment_amount),
        success_rate: (month_investments.count { |inv| inv.status.in?(%w[successful executed committed]) }.to_f / month_investments.count * 100).round(2)
      }
    end.sort.to_h

    {
      monthly_trends: trend_data,
      investment_velocity: calculate_investment_velocity(trend_data),
      seasonality_patterns: identify_seasonality_patterns(trend_data)
    }
  end

  def liquidity_ratios
    {
      current_ratio: @club.current_balance / [@club.total_invested, 1].max,
      cash_ratio: @club.current_balance / [@club.total_contributions, 1].max,
      operating_cash_flow_ratio: calculate_operating_cash_flow_ratio
    }
  end

  def contribution_health
    recent_contributions = @club.investment_club_contributions.completed.where('created_at >= ?', 3.months.ago)
    average_monthly_contribution = recent_contributions.sum(:amount) / 3.0
    
    {
      contribution_consistency: calculate_contribution_consistency(recent_contributions),
      average_monthly_contribution: average_monthly_contribution,
      member_contribution_rate: (recent_contributions.distinct.count(:user_id).to_f / @club.active_members.count * 100).round(2),
      growth_rate: calculate_contribution_growth_rate
    }
  end

  def investment_efficiency_metrics
    {
      capital_utilization_rate: @club.total_invested / [@club.total_contributions, 1].max,
      return_on_contributions: calculate_return_on_contributions,
      investment_turnover: calculate_investment_turnover,
      fee_efficiency: calculate_fee_efficiency
    }
  end

  def growth_metrics
    {
      month_over_month_growth: calculate_mom_growth,
      quarter_over_quarter_growth: calculate_qoq_growth,
      annual_growth_rate: calculate_annual_growth_rate,
      member_growth_rate: calculate_member_growth_rate
    }
  end

  def stability_indicators
    {
      contribution_volatility: calculate_contribution_volatility,
      investment_consistency: calculate_investment_consistency,
      member_retention_rate: calculate_member_retention_rate,
      financial_resilience_score: calculate_financial_resilience_score
    }
  end

  def growth_projections
    current_value = portfolio_overview[:total_value]
    historical_growth = calculate_historical_growth_rate
    
    {
      short_term_projection: current_value * (1 + historical_growth / 100),
      medium_term_projection: current_value * (1 + historical_growth / 100) ** 2,
      long_term_projection: current_value * (1 + historical_growth / 100) ** 5,
      confidence_interval: calculate_projection_confidence(historical_growth)
    }
  end

  def risk_scenarios
    {
      market_downturn: simulate_market_downturn,
      high_inflation: simulate_high_inflation_scenario,
      liquidity_crisis: simulate_liquidity_crisis,
      member_withdrawal: simulate_member_withdrawal_impact
    }
  end

  def investment_opportunities
    current_allocations = calculate_sector_performance(@club.club_investments.select { |inv| inv.status.in?(%w[successful executed committed]) })
    market_trends = analyze_market_trends
    
    {
      underrepresented_sectors: identify_underserved_sectors(current_allocations),
      high_growth_opportunities: identify_high_growth_opportunities(market_trends),
      portfolio_gaps: identify_portfolio_gaps(current_allocations),
      rebalancing_recommendations: generate_rebalancing_recommendations(current_allocations)
    }
  end

  def cash_flow_forecast
    {
      projected_contributions: forecast_contributions,
      expected_investments: forecast_investments,
      liquidity_forecast: forecast_liquidity,
      funding_gap_analysis: analyze_funding_gaps
    }
  end

  def member_portfolio_summary
    active_members = @club.active_members
    member_summaries = active_members.map do |member|
      membership = @club.membership_for(member)
      next unless membership
      
      {
        member_name: member.full_name,
        contribution_share: membership.contributed_share,
        total_contributed: membership.total_contributed,
        estimated_portfolio_value: calculate_member_portfolio_value(membership),
        engagement_level: calculate_member_engagement_level(member)
      }
    end.compact

    {
      members: member_summaries,
      summary_stats: {
        average_share: member_summaries.sum { |m| m[:contribution_share] } / member_summaries.size,
        concentration_gini: calculate_wealth_concentration_gini(member_summaries),
        top_contributor: member_summaries.max_by { |m| m[:contribution_share] }
      }
    }
  end

  # Helper methods for calculations
  def calculate_average_holding_period(investments)
    return 0 if investments.empty?
    
    total_days = investments.sum do |inv|
      (Time.current - inv.created_at).to_i / 1.day
    end
    (total_days.to_f / investments.count).round(2)
  end

  def estimate_portfolio_volatility(investments)
    # Simplified volatility estimation based on ROI variance
    rois = investments.map { |inv| calculate_roi(inv) }
    return 0 if rois.empty?
    
    mean = rois.sum / rois.size
    variance = rois.sum { |roi| (roi - mean) ** 2 } / rois.size
    Math.sqrt(variance).round(2)
  end

  def calculate_sharpe_ratio(portfolio, investments)
    return 0 if investments.empty?
    
    risk_free_rate = 2.0 # Assume 2% risk-free rate
    portfolio_return = portfolio[:return_percentage]
    volatility = estimate_portfolio_volatility(investments)
    
    return 0 if volatility.zero?
    
    ((portfolio_return - risk_free_rate) / volatility).round(3)
  end

  def calculate_concentration_risk(investments)
    total_invested = investments.sum(&:investment_amount)
    return 0 if total_invested.zero?
    
    # Herfindahl-Hirschman Index for concentration
    shares = investments.map { |inv| (inv.investment_amount / total_invested) ** 2 }
    (shares.sum * 10000).round(2) # Scale to typical HHI range
  end

  def calculate_sector_risk(investments)
    sector_allocations = calculate_sector_performance(investments)
    return 0 if sector_allocations.empty?
    
    # Risk based on sector concentration
    max_sector_share = sector_allocations.values.map { |v| v[:percentage] }.max
    (max_sector_share * 100).round(2)
  end

  def calculate_liquidity_risk_score
    cash_ratio = @club.current_balance / [@club.total_contributions, 1].max
    (100 - (cash_ratio * 100)).clamp(0, 100).round(2)
  end

  def calculate_sector_diversity(investments)
    sector_counts = investments.group_by { |inv| inv.campaign.category || 'Other' }
    total_sectors = sector_counts.size
    max_sector_percentage = sector_counts.values.map { |v| v.size }.max.to_f / investments.size * 100
    
    {
      score: (total_sectors * 10).clamp(0, 100), # Simple diversity score
      top_sectors: sector_counts.map { |sector, invs| { sector: sector, percentage: (invs.size.to_f / investments.size * 100).round(2) } }.sort_by { |s| -s[:percentage] }.first(3)
    }
  end

  # Additional helper methods with placeholder implementations
  def calculate_maximum_drawdown(investments)
    # Simplified implementation
    15.0 # Placeholder
  end

  def calculate_value_at_risk(investments)
    # Simplified implementation
    25.0 # Placeholder
  end

  def calculate_herfindahl_index(investments)
    # Simplified implementation
    1200.0 # Placeholder
  end

  def diversification_recommendations(sector_diversity)
    ["Consider diversifying into technology sector"] # Placeholder
  end

  def calculate_quick_ratio
    (@club.current_balance / [@club.total_invested, 1].max).round(2)
  end

  def calculate_cash_flow_coverage
    2.5 # Placeholder
  end

  def calculate_emergency_fund_sufficiency
    "Adequate" # Placeholder
  end

  def calculate_overall_engagement_score(voting_members, contributing_members, total_members)
    ((voting_members + contributing_members).to_f / (total_members * 2) * 100).round(2)
  end

  def identify_top_contributors
    [] # Placeholder - would implement actual logic
  end

  def analyze_engagement_trend
    "Stable" # Placeholder
  end

  def calculate_investment_velocity(trend_data)
    "Moderate" # Placeholder
  end

  def identify_seasonality_patterns(trend_data)
    {} # Placeholder
  end

  def calculate_operating_cash_flow_ratio
    1.5 # Placeholder
  end

  def calculate_contribution_consistency(recent_contributions)
    "High" # Placeholder
  end

  def calculate_contribution_growth_rate
    8.5 # Placeholder
  end

  def calculate_return_on_contributions
    portfolio_overview[:return_percentage] # Use actual ROI
  end

  def calculate_investment_turnover
    0.8 # Placeholder
  end

  def calculate_fee_efficiency
    "Efficient" # Placeholder
  end

  def calculate_mom_growth
    2.5 # Placeholder
  end

  def calculate_qoq_growth
    7.8 # Placeholder
  end

  def calculate_annual_growth_rate
    15.2 # Placeholder
  end

  def calculate_member_growth_rate
    5.0 # Placeholder
  end

  def calculate_contribution_volatility
    12.3 # Placeholder
  end

  def calculate_investment_consistency
    "Consistent" # Placeholder
  end

  def calculate_member_retention_rate
    95.0 # Placeholder
  end

  def calculate_financial_resilience_score
    85.0 # Placeholder
  end

  def calculate_historical_growth_rate
    12.0 # Placeholder
  end

  def calculate_projection_confidence(historical_growth)
    "High" # Placeholder
  end

  def simulate_market_downturn
    { impact: -15.0, probability: "Medium" } # Placeholder
  end

  def simulate_high_inflation_scenario
    { impact: -8.0, probability: "Low" } # Placeholder
  end

  def simulate_liquidity_crisis
    { impact: -25.0, probability: "Very Low" } # Placeholder
  end

  def simulate_member_withdrawal_impact
    { impact: -10.0, probability: "Medium" } # Placeholder
  end

  def identify_underserved_sectors(current_allocations)
    ["Technology", "Healthcare"] # Placeholder
  end

  def identify_high_growth_opportunities(market_trends)
    ["Renewable Energy", "AI Infrastructure"] # Placeholder
  end

  def identify_portfolio_gaps(current_allocations)
    ["International exposure", "Small-cap stocks"] # Placeholder
  end

  def generate_rebalancing_recommendations(current_allocations)
    ["Increase technology allocation by 5%"] # Placeholder
  end

  def analyze_market_trends
    {} # Placeholder
  end

  def forecast_contributions
    @club.total_contributions * 1.1 # Placeholder
  end

  def forecast_investments
    @club.total_invested * 1.15 # Placeholder
  end

  def forecast_liquidity
    "Adequate" # Placeholder
  end

  def analyze_funding_gaps
    "No significant gaps" # Placeholder
  end

  def calculate_member_portfolio_value(membership)
    club_portfolio = portfolio_overview
    (club_portfolio[:total_value] * membership.contributed_share / 100.0).round(2)
  end

  def calculate_member_engagement_level(member)
    "High" # Placeholder
  end

  def calculate_wealth_concentration_gini(member_summaries)
    0.35 # Placeholder - Gini coefficient
  end

  def calculate_investment_size_diversity(investments)
    return 0 if investments.empty?
    
    amounts = investments.map(&:investment_amount)
    mean = amounts.sum / amounts.size
    cv = Math.sqrt(amounts.sum { |a| (a - mean) ** 2 } / amounts.size) / mean
    (1 - cv).clamp(0, 1) * 100
  end
end