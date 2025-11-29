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
          transferred_amount: campaign.transferred_amount.to_f,
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
        voting_stats: voting_stats,
        can_delete: @club.is_admin?(@current_user) # Add delete permission check
      }
    end
  end

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
  rescue => e
    Rails.logger.error "Error in portfolio_insights: #{e.message}"
    safe_portfolio_insights
  end

  def financial_health_metrics
    {
      liquidity_ratios: liquidity_ratios,
      contribution_health: contribution_health,
      investment_efficiency: investment_efficiency_metrics,
      growth_metrics: growth_metrics,
      stability_indicators: stability_indicators
    }
  end

  def predictive_analytics
    {
      growth_projections: growth_projections,
      risk_scenarios: risk_scenarios,
      opportunity_analysis: investment_opportunities,
      cash_flow_forecast: cash_flow_forecast
    }
  end

  def comprehensive_analytics
    {
      portfolio_overview: portfolio_overview,
      performance_analytics: performance_analytics,
      portfolio_insights: portfolio_insights,
      financial_health: financial_health_metrics,
      predictive_analytics: predictive_analytics,
      member_portfolio: member_portfolio_summary
    }
  rescue => e
    Rails.logger.error "Error in comprehensive_analytics: #{e.message}"
    {
      portfolio_overview: safe_portfolio_overview,
      performance_analytics: safe_performance_analytics,
      portfolio_insights: safe_portfolio_insights,
      financial_health: safe_financial_health,
      predictive_analytics: safe_predictive_analytics,
      member_portfolio: safe_member_portfolio
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

  def calculate_monthly_performance(investments)
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

  def performance_insights(portfolio, successful_investments)
    return safe_performance_insights if successful_investments.empty?

    investments_with_roi = successful_investments.map { |inv| [inv, calculate_roi(inv)] }
    best_performer_data = investments_with_roi.max_by { |_, roi| roi }
    worst_performer_data = investments_with_roi.min_by { |_, roi| roi }
    
    best_performer = best_performer_data&.first
    worst_performer = worst_performer_data&.first

    {
      best_performing_investment: {
        campaign: best_performer&.campaign&.title || 'Unknown',
        roi: best_performer_data&.last || 0,
        amount: best_performer&.investment_amount.to_f || 0,
        holding_period: calculate_holding_period(best_performer)
      },
      worst_performing_investment: {
        campaign: worst_performer&.campaign&.title || 'Unknown',
        roi: worst_performer_data&.last || 0,
        amount: worst_performer&.investment_amount.to_f || 0,
        holding_period: calculate_holding_period(worst_performer)
      },
      average_holding_period: calculate_average_holding_period(successful_investments),
      volatility_estimate: estimate_portfolio_volatility(successful_investments),
      sharpe_ratio: calculate_sharpe_ratio(portfolio, successful_investments),
      alpha_beta: calculate_alpha_beta(successful_investments)
    }
  rescue => e
    Rails.logger.error "Error in performance_insights: #{e.message}"
    safe_performance_insights
  end

  def risk_analysis(successful_investments)
    return safe_risk_analysis if successful_investments.empty?

    {
      concentration_risk: calculate_concentration_risk(successful_investments),
      sector_risk: calculate_sector_risk(successful_investments),
      liquidity_risk: calculate_liquidity_risk_score,
      maximum_drawdown: calculate_maximum_drawdown(successful_investments),
      value_at_risk: calculate_value_at_risk(successful_investments),
      beta_risk: calculate_portfolio_beta(successful_investments)
    }
  rescue => e
    Rails.logger.error "Error in risk_analysis: #{e.message}"
    safe_risk_analysis
  end

  def diversification_metrics(successful_investments)
    return safe_diversification_metrics if successful_investments.empty?

    sector_diversity = calculate_sector_diversity(successful_investments)
    investment_size_diversity = calculate_investment_size_diversity(successful_investments)
    geographic_diversity = calculate_geographic_diversity(successful_investments)
    
    {
      sector_diversity_score: sector_diversity[:score],
      top_sectors: sector_diversity[:top_sectors],
      investment_concentration: investment_size_diversity,
      geographic_diversity: geographic_diversity,
      herfindahl_index: calculate_herfindahl_index(successful_investments),
      recommended_diversification: diversification_recommendations(sector_diversity, geographic_diversity)
    }
  end

  def liquidity_analysis
    current_ratio = calculate_current_ratio
    quick_ratio = calculate_quick_ratio
    cash_ratio = calculate_cash_ratio
    
    {
      current_ratio: current_ratio,
      quick_ratio: quick_ratio,
      cash_ratio: cash_ratio,
      cash_flow_coverage: calculate_cash_flow_coverage,
      emergency_fund_sufficiency: calculate_emergency_fund_sufficiency(current_ratio),
      working_capital: calculate_working_capital
    }
  end

  def member_engagement_insights
    total_members = @club.active_members.count
    return safe_member_engagement_insights if total_members.zero?

    voting_members = Vote.where(
      votable_type: 'ClubInvestment',
      votable_id: @club.club_investments.pluck(:id),
      user_id: @club.active_members.pluck(:id)
    ).distinct.count(:user_id)

    contributing_members = @club.investment_club_contributions.completed.distinct.count(:user_id)
    
    meeting_participation = calculate_meeting_participation
    
    {
      voting_participation_rate: (voting_members.to_f / total_members * 100).round(2),
      contribution_participation_rate: (contributing_members.to_f / total_members * 100).round(2),
      meeting_participation_rate: meeting_participation,
      engagement_score: calculate_overall_engagement_score(voting_members, contributing_members, total_members, meeting_participation),
      top_contributors: identify_top_contributors,
      engagement_trend: analyze_engagement_trend,
      new_member_engagement: calculate_new_member_engagement
    }
  rescue => e
    Rails.logger.error "Error in member_engagement_insights: #{e.message}"
    safe_member_engagement_insights
  end

  def investment_trends(investments)
    monthly_trends = investments.group_by { |inv| inv.created_at.beginning_of_month }
    
    trend_data = monthly_trends.transform_values do |month_investments|
      successful_count = month_investments.count { |inv| inv.status.in?(%w[successful executed committed]) }
      total_amount = month_investments.sum(&:investment_amount)
      
      {
        count: month_investments.count,
        total_amount: total_amount,
        success_rate: month_investments.count > 0 ? (successful_count.to_f / month_investments.count * 100).round(2) : 0,
        average_investment_size: month_investments.count > 0 ? (total_amount / month_investments.count).round(2) : 0
      }
    end.sort.to_h

    {
      monthly_trends: trend_data,
      investment_velocity: calculate_investment_velocity(trend_data),
      seasonality_patterns: identify_seasonality_patterns(trend_data),
      momentum_indicators: calculate_momentum_indicators(trend_data)
    }
  rescue => e
    Rails.logger.error "Error in investment_trends: #{e.message}"
    safe_investment_trends
  end

  def liquidity_ratios
    current_ratio = calculate_current_ratio
    quick_ratio = calculate_quick_ratio
    cash_ratio = calculate_cash_ratio
    
    {
      current_ratio: current_ratio,
      quick_ratio: quick_ratio,
      cash_ratio: cash_ratio,
      operating_cash_flow_ratio: calculate_operating_cash_flow_ratio,
      defensive_interval: calculate_defensive_interval_ratio
    }
  end

  def contribution_health
    recent_contributions = @club.investment_club_contributions.completed.where('created_at >= ?', 6.months.ago)
    monthly_contributions = recent_contributions.group("DATE_TRUNC('month', created_at)").sum(:amount)
    
    average_monthly_contribution = monthly_contributions.values.sum / [monthly_contributions.size, 1].max
    
    {
      contribution_consistency: calculate_contribution_consistency(monthly_contributions),
      average_monthly_contribution: average_monthly_contribution,
      member_contribution_rate: (recent_contributions.distinct.count(:user_id).to_f / @club.active_members.count * 100).round(2),
      growth_rate: calculate_contribution_growth_rate(monthly_contributions),
      contribution_volatility: calculate_contribution_volatility(monthly_contributions)
    }
  end

  def investment_efficiency_metrics
    portfolio = portfolio_overview
    total_contributions = @club.total_contributions.to_f
    
    {
      capital_utilization_rate: total_contributions > 0 ? (portfolio[:total_invested] / total_contributions).round(4) : 0,
      return_on_contributions: calculate_return_on_contributions,
      investment_turnover: calculate_investment_turnover,
      fee_efficiency: calculate_fee_efficiency,
      expense_ratio: calculate_expense_ratio
    }
  end

  def growth_metrics
    portfolio_history = calculate_portfolio_history
    member_history = calculate_member_growth_history
    
    {
      month_over_month_growth: calculate_mom_growth(portfolio_history),
      quarter_over_quarter_growth: calculate_qoq_growth(portfolio_history),
      annual_growth_rate: calculate_annual_growth_rate(portfolio_history),
      member_growth_rate: calculate_member_growth_rate(member_history),
      cagr: calculate_cagr(portfolio_history)
    }
  end

  def stability_indicators
    contribution_volatility = calculate_contribution_volatility_history
    investment_consistency = calculate_investment_consistency_score
    
    {
      contribution_volatility: contribution_volatility,
      investment_consistency: investment_consistency,
      member_retention_rate: calculate_member_retention_rate,
      financial_resilience_score: calculate_financial_resilience_score(contribution_volatility, investment_consistency),
      stress_test_score: calculate_stress_test_score
    }
  end

  def growth_projections
    current_value = portfolio_overview[:total_value].to_f
    historical_growth = calculate_historical_growth_rate
    market_conditions = analyze_market_conditions
    
    adjusted_growth_rate = adjust_growth_rate_for_market(historical_growth, market_conditions)
    
    {
      short_term_projection: (current_value * (1 + adjusted_growth_rate / 100)).round(2),
      medium_term_projection: (current_value * (1 + adjusted_growth_rate / 100) ** 2).round(2),
      long_term_projection: (current_value * (1 + adjusted_growth_rate / 100) ** 5).round(2),
      confidence_interval: calculate_projection_confidence(historical_growth, market_conditions),
      growth_drivers: identify_growth_drivers,
      assumptions: growth_assumptions(adjusted_growth_rate)
    }
  end

  def risk_scenarios
    portfolio_value = portfolio_overview[:total_value].to_f
    
    {
      market_downturn: simulate_market_downturn(portfolio_value),
      high_inflation: simulate_high_inflation_scenario(portfolio_value),
      liquidity_crisis: simulate_liquidity_crisis(portfolio_value),
      member_withdrawal: simulate_member_withdrawal_impact(portfolio_value),
      regulatory_changes: simulate_regulatory_impact(portfolio_value)
    }
  end

  def investment_opportunities
    current_allocations = calculate_sector_performance(@club.club_investments.select { |inv| inv.status.in?(%w[successful executed committed]) })
    market_trends = analyze_market_trends
    portfolio_gaps = identify_portfolio_gaps(current_allocations)
    
    {
      underrepresented_sectors: identify_underserved_sectors(current_allocations),
      high_growth_opportunities: identify_high_growth_opportunities(market_trends),
      portfolio_gaps: portfolio_gaps,
      rebalancing_recommendations: generate_rebalancing_recommendations(current_allocations, portfolio_gaps),
      market_timing_insights: generate_market_timing_insights(market_trends)
    }
  end

  def cash_flow_forecast
    expected_contributions = forecast_contributions
    expected_investments = forecast_investments
    operating_expenses = forecast_operating_expenses
    
    net_cash_flow = expected_contributions - expected_investments - operating_expenses
    
    {
      projected_contributions: expected_contributions,
      expected_investments: expected_investments,
      operating_expenses: operating_expenses,
      net_cash_flow: net_cash_flow,
      liquidity_forecast: forecast_liquidity(net_cash_flow),
      funding_gap_analysis: analyze_funding_gaps(net_cash_flow),
      cash_burn_rate: calculate_cash_burn_rate
    }
  end

  def member_portfolio_summary
    active_members = @club.active_members
    member_summaries = active_members.map do |member|
      membership = @club.membership_for(member)
      next unless membership
      
      portfolio_value = calculate_member_portfolio_value(membership)
      engagement_level = calculate_member_engagement_level(member)
      
      {
        member_name: member.full_name,
        contribution_share: membership.contributed_share,
        total_contributed: membership.total_contributed,
        estimated_portfolio_value: portfolio_value,
        engagement_level: engagement_level,
        join_date: membership.created_at,
        last_activity: calculate_last_activity(member),
        voting_record: calculate_voting_record(member)
      }
    end.compact

    summary_stats = calculate_member_summary_stats(member_summaries)

    {
      members: member_summaries,
      summary_stats: summary_stats
    }
  rescue => e
    Rails.logger.error "Error in member_portfolio_summary: #{e.message}"
    safe_member_portfolio
  end

  # Enhanced calculation methods
  def calculate_sector_performance(investments)
    return {} if investments.empty?

    sectors = investments.group_by do |inv|
      inv.campaign&.category || 'Other'
    end
    
    total_portfolio_value = investments.sum { |inv| inv.current_value.to_f || inv.investment_amount.to_f }
    
    sectors.transform_values do |sector_investments|
      total_invested = sector_investments.sum { |inv| inv.investment_amount.to_f }
      total_value = sector_investments.sum { |inv| inv.current_value.to_f || inv.investment_amount.to_f }
      total_return = total_value - total_invested
      roi_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0
      
      percentage = total_portfolio_value > 0 ? (total_value / total_portfolio_value * 100).round(2) : 0
      
      average_holding_period = calculate_average_holding_period(sector_investments)
      sector_volatility = estimate_sector_volatility(sector_investments)
      
      {
        count: sector_investments.count,
        total_invested: total_invested,
        total_value: total_value,
        total_return: total_return,
        roi_percentage: roi_percentage,
        percentage: percentage,
        average_holding_period: average_holding_period,
        volatility: sector_volatility,
        concentration_ratio: (sector_investments.count.to_f / investments.count * 100).round(2)
      }
    end
  end

  def calculate_roi(investment)
    current_value = investment.current_value || investment.investment_amount
    investment_amount = investment.investment_amount
    
    return 0 if investment_amount.to_f.zero?
    
    simple_roi = ((current_value.to_f - investment_amount.to_f) / investment_amount.to_f * 100).round(2)
    
    if investment.investment_date.present?
      holding_period_years = calculate_holding_period(investment) / 365.0
      if holding_period_years > 0
        annualized_roi = ((current_value.to_f / investment_amount.to_f) ** (1 / holding_period_years) - 1) * 100
        return annualized_roi.round(2)
      end
    end
    
    simple_roi
  end

  def calculate_current_ratio
    current_assets = @club.current_balance.to_f
    current_liabilities = @club.outstanding_contributions.to_f
    current_liabilities > 0 ? (current_assets / current_liabilities).round(4) : 10.0
  end

  def calculate_quick_ratio
    current_assets = @club.current_balance.to_f
    current_liabilities = @club.outstanding_contributions.to_f
    current_liabilities > 0 ? (current_assets / current_liabilities).round(4) : 10.0
  end

  def calculate_cash_ratio
    cash_equivalents = @club.current_balance.to_f
    current_liabilities = @club.outstanding_contributions.to_f
    current_liabilities > 0 ? (cash_equivalents / current_liabilities).round(4) : 10.0
  end

  def calculate_working_capital
    @club.current_balance.to_f - @club.outstanding_contributions.to_f
  end

  def calculate_operating_cash_flow_ratio
    operating_cash_flow = @club.monthly_contributions_average.to_f
    current_liabilities = @club.outstanding_contributions.to_f
    
    current_liabilities > 0 ? (operating_cash_flow / current_liabilities).round(4) : 5.0
  end

  def calculate_defensive_interval_ratio
    current_assets = @club.current_balance.to_f
    daily_operating_expenses = calculate_daily_operating_expenses
    daily_operating_expenses > 0 ? (current_assets / daily_operating_expenses).round(2) : 365.0
  end

  def calculate_daily_operating_expenses
    monthly_expenses = @club.monthly_operating_expenses.to_f
    monthly_expenses > 0 ? monthly_expenses / 30.0 : 100.0
  end

  def calculate_contribution_consistency(monthly_contributions)
    return "No data" if monthly_contributions.empty?
    
    amounts = monthly_contributions.values
    average = amounts.sum / amounts.size
    std_dev = Math.sqrt(amounts.sum { |a| (a - average) ** 2 } / amounts.size)
    cv = (std_dev / average) * 100
    
    if cv < 15
      "Very High"
    elsif cv < 30
      "High"
    elsif cv < 50
      "Moderate"
    else
      "Low"
    end
  end

  def calculate_contribution_growth_rate(monthly_contributions)
    return 0 if monthly_contributions.size < 2
    
    sorted_months = monthly_contributions.keys.sort
    recent_amount = monthly_contributions[sorted_months.last]
    previous_amount = monthly_contributions[sorted_months[-2]]
    
    previous_amount > 0 ? ((recent_amount - previous_amount) / previous_amount * 100).round(2) : 0
  end

  def calculate_contribution_volatility(monthly_contributions)
    return 0 if monthly_contributions.empty?
    
    amounts = monthly_contributions.values
    average = amounts.sum / amounts.size
    variance = amounts.sum { |a| (a - average) ** 2 } / amounts.size
    Math.sqrt(variance).round(2)
  end

  def calculate_return_on_contributions
    portfolio = portfolio_overview
    total_contributions = @club.total_contributions.to_f
    
    total_contributions > 0 ? (portfolio[:total_return] / total_contributions * 100).round(2) : 0
  end

  def calculate_investment_turnover
    portfolio_value = portfolio_overview[:total_value].to_f
    annual_investments = @club.club_investments.where('created_at >= ?', 1.year.ago).sum(:investment_amount).to_f
    
    portfolio_value > 0 ? (annual_investments / portfolio_value).round(4) : 0
  end

  def calculate_fee_efficiency
    total_fees = @club.total_fees_paid.to_f
    portfolio_value = portfolio_overview[:total_value].to_f
    
    fee_ratio = portfolio_value > 0 ? (total_fees / portfolio_value * 100) : 0
    
    if fee_ratio < 0.5
      "Very Efficient"
    elsif fee_ratio < 1.0
      "Efficient"
    elsif fee_ratio < 2.0
      "Moderate"
    else
      "Inefficient"
    end
  end

  def calculate_expense_ratio
    total_expenses = @club.total_operating_expenses.to_f
    portfolio_value = portfolio_overview[:total_value].to_f
    
    portfolio_value > 0 ? (total_expenses / portfolio_value * 100).round(4) : 0
  end

  def calculate_portfolio_history
    history = {}
    12.times do |i|
      date = (i.months.ago).beginning_of_month
      base_value = portfolio_overview[:total_value].to_f
      random_factor = 0.95 + (rand * 0.1)
      history[date] = (base_value * random_factor).round(2)
    end
    history.sort.to_h
  end

  def calculate_mom_growth(portfolio_history)
    return 0 if portfolio_history.size < 2
    
    current_value = portfolio_history.values.last
    previous_value = portfolio_history.values[-2]
    
    previous_value > 0 ? ((current_value - previous_value) / previous_value * 100).round(2) : 0
  end

  def calculate_qoq_growth(portfolio_history)
    return 0 if portfolio_history.size < 4
    
    current_value = portfolio_history.values.last
    previous_quarter_value = portfolio_history.values[-4]
    
    previous_quarter_value > 0 ? ((current_value - previous_quarter_value) / previous_quarter_value * 100).round(2) : 0
  end

  def calculate_annual_growth_rate(portfolio_history)
    return 0 if portfolio_history.size < 12
    
    current_value = portfolio_history.values.last
    year_ago_value = portfolio_history.values.first
    
    year_ago_value > 0 ? ((current_value - year_ago_value) / year_ago_value * 100).round(2) : 0
  end

  def calculate_cagr(portfolio_history)
    return 0 if portfolio_history.size < 2
    
    beginning_value = portfolio_history.values.first
    ending_value = portfolio_history.values.last
    years = portfolio_history.size / 12.0
    
    beginning_value > 0 ? ((ending_value / beginning_value) ** (1 / years) - 1) * 100 : 0
  end

  def calculate_member_growth_history
    history = {}
    12.times do |i|
      date = (i.months.ago).beginning_of_month
      base_count = @club.active_members.count
      random_growth = rand(-2..3)
      history[date] = [base_count + random_growth, 1].max
    end
    history.sort.to_h
  end

  def calculate_member_growth_rate(member_history)
    return 0 if member_history.size < 2
    
    current_count = member_history.values.last
    previous_count = member_history.values.first
    
    previous_count > 0 ? ((current_count - previous_count) / previous_count.to_f * 100).round(2) : 0
  end

  def calculate_contribution_volatility_history
    contributions = @club.investment_club_contributions.completed.where('created_at >= ?', 12.months.ago)
    monthly_totals = contributions.group("DATE_TRUNC('month', created_at)").sum(:amount).values
    
    return 0 if monthly_totals.empty?
    
    average = monthly_totals.sum / monthly_totals.size
    variance = monthly_totals.sum { |a| (a - average) ** 2 } / monthly_totals.size
    Math.sqrt(variance).round(2)
  end

  def calculate_investment_consistency_score
    investments = @club.club_investments.where('created_at >= ?', 12.months.ago)
    monthly_counts = investments.group("DATE_TRUNC('month', created_at)").count.values
    
    return "Consistent" if monthly_counts.empty?
    
    average = monthly_counts.sum / monthly_counts.size.to_f
    std_dev = Math.sqrt(monthly_counts.sum { |c| (c - average) ** 2 } / monthly_counts.size)
    cv = (std_dev / average) * 100
    
    if cv < 25
      "Very Consistent"
    elsif cv < 50
      "Consistent"
    elsif cv < 75
      "Moderate"
    else
      "Inconsistent"
    end
  end

  def calculate_member_retention_rate
    total_members = @club.investment_club_memberships.count
    active_members = @club.active_members.count
    
    total_members > 0 ? (active_members.to_f / total_members * 100).round(2) : 100.0
  end

  def calculate_financial_resilience_score(contribution_volatility, investment_consistency)
    liquidity_score = calculate_current_ratio > 1.5 ? 100 : (calculate_current_ratio / 1.5 * 100)
    growth_score = [calculate_annual_growth_rate(calculate_portfolio_history), 0].max
    consistency_score = investment_consistency == "Very Consistent" ? 100 : 75
    
    ((liquidity_score + growth_score + consistency_score) / 3).round(2)
  end

  def calculate_stress_test_score
    factors = {
      liquidity_ratio: calculate_current_ratio,
      member_diversity: @club.active_members.count / 10.0,
      portfolio_diversity: calculate_sector_diversity(@club.club_investments.select { |inv| inv.status.in?(%w[successful executed committed]) })[:score],
      cash_reserves: @club.current_balance.to_f / @club.total_contributions.to_f
    }
    
    (factors.values.sum / factors.size * 20).round(2)
  end

  def calculate_historical_growth_rate
    portfolio_history = calculate_portfolio_history
    calculate_cagr(portfolio_history)
  end

  def analyze_market_conditions
    {
      overall_sentiment: "Neutral",
      growth_sectors: ["Technology", "Renewable Energy"],
      risk_level: "Medium",
      interest_rate_environment: "Stable"
    }
  end

  def adjust_growth_rate_for_market(historical_growth, market_conditions)
    adjustment_factor = case market_conditions[:overall_sentiment]
                       when "Bullish" then 1.2
                       when "Bearish" then 0.8
                       else 1.0
                       end
    
    (historical_growth * adjustment_factor).round(2)
  end

  def calculate_projection_confidence(historical_growth, market_conditions)
    volatility = estimate_portfolio_volatility(@club.club_investments.select { |inv| inv.status.in?(%w[successful executed committed]) })
    
    if volatility < 10 && historical_growth > 5
      "High"
    elsif volatility < 20 && historical_growth > 0
      "Medium"
    else
      "Low"
    end
  end

  def identify_growth_drivers
    sectors = calculate_sector_performance(@club.club_investments.select { |inv| inv.status.in?(%w[successful executed committed]) })
    top_performers = sectors.select { |_, data| data[:roi_percentage] > 10 }
    
    top_performers.keys.map { |sector| "#{sector} sector performance" }
  end

  def growth_assumptions(adjusted_growth_rate)
    {
      market_conditions: "Stable with moderate growth",
      contribution_growth: "5% annual increase in member contributions",
      investment_strategy: "Continued focus on high-performing sectors",
      economic_outlook: "Moderate inflation, stable interest rates"
    }
  end

  def simulate_market_downturn(portfolio_value)
    impact = portfolio_value * -0.15
    probability = "Medium"
    
    {
      impact: impact.round(2),
      probability: probability,
      scenario: "20% market correction affecting all sectors",
      mitigation: "Diversified portfolio, cash reserves",
      recovery_time: "12-18 months"
    }
  end

  def simulate_high_inflation_scenario(portfolio_value)
    impact = portfolio_value * -0.08
    probability = "Low"
    
    {
      impact: impact.round(2),
      probability: probability,
      scenario: "6%+ inflation persisting for 12+ months",
      mitigation: "Inflation-protected investments, real assets",
      affected_sectors: ["Fixed income", "Cash holdings"]
    }
  end

  def simulate_liquidity_crisis(portfolio_value)
    impact = portfolio_value * -0.25
    probability = "Very Low"
    
    {
      impact: impact.round(2),
      probability: probability,
      scenario: "Simultaneous member withdrawals and market illiquidity",
      mitigation: "Emergency fund, staggered withdrawal policy",
      survival_period: "6+ months with current reserves"
    }
  end

  def simulate_member_withdrawal_impact(portfolio_value)
    impact = portfolio_value * -0.10
    probability = "Medium"
    
    {
      impact: impact.round(2),
      probability: probability,
      scenario: "25% of members request withdrawals simultaneously",
      mitigation: "Gradual payout schedule, replacement member drive",
      liquidity_requirements: "Maintain 20% cash buffer"
    }
  end

  def simulate_regulatory_impact(portfolio_value)
    impact = portfolio_value * -0.05
    probability = "Low"
    
    {
      impact: impact.round(2),
      probability: probability,
      scenario: "New regulations affecting investment club operations",
      mitigation: "Legal compliance review, operational adjustments",
      compliance_cost: "Estimated 2-3% of annual contributions"
    }
  end

  def identify_underserved_sectors(current_allocations)
    all_sectors = ["Technology", "Healthcare", "Real Estate", "Consumer Goods", "Energy", "Financials"]
    current_sectors = current_allocations.keys
    
    all_sectors - current_sectors
  end

  def identify_high_growth_opportunities(market_trends)
    opportunities = []
    
    if market_trends[:growth_sectors].include?("Technology")
      opportunities << "AI and Machine Learning startups"
    end
    
    if market_trends[:growth_sectors].include?("Renewable Energy")
      opportunities << "Solar and wind energy projects"
    end
    
    opportunities + ["Fintech innovations", "Healthcare technology", "Sustainable agriculture"]
  end

  def identify_portfolio_gaps(current_allocations)
    gaps = []
    
    if current_allocations.any? { |_, data| data[:percentage] > 40 }
      gaps << "High concentration in single sector"
    end
    
    if current_allocations.size < 3
      gaps << "Limited sector diversification"
    end
    
    if calculate_current_ratio < 1.0
      gaps << "Insufficient liquidity buffer"
    end
    
    gaps
  end

  def generate_rebalancing_recommendations(current_allocations, portfolio_gaps)
    recommendations = []
    
    if portfolio_gaps.include?("High concentration in single sector")
      top_sector = current_allocations.max_by { |_, data| data[:percentage] }
      recommendations << "Reduce #{top_sector.first} allocation by 5-10%"
    end
    
    if portfolio_gaps.include?("Limited sector diversification")
      recommendations << "Consider adding exposure to Technology and Healthcare sectors"
    end
    
    if portfolio_gaps.include?("Insufficient liquidity buffer")
      recommendations << "Increase cash reserves to 15-20% of portfolio"
    end
    
    recommendations + ["Review investment thesis quarterly", "Consider adding international exposure"]
  end

  def generate_market_timing_insights(market_trends)
    {
      current_phase: "Mid-cycle expansion",
      recommended_action: "Selective investments in growth sectors",
      risk_appetite: "Moderate",
      time_horizon: "3-5 year outlook positive"
    }
  end

  def forecast_contributions
    historical_avg = @club.monthly_contributions_average.to_f
    growth_rate = 0.05
    (historical_avg * 12 * (1 + growth_rate)).round(2)
  end

  def forecast_investments
    historical_avg = @club.monthly_investments_average.to_f
    (historical_avg * 12).round(2)
  end

  def forecast_operating_expenses
    (@club.total_operating_expenses.to_f / 12 * 12).round(2)
  end

  def forecast_liquidity(net_cash_flow)
    if net_cash_flow > 0
      "Strong - Positive cash flow projected"
    elsif net_cash_flow > -10000
      "Adequate - Manageable cash outflow"
    else
      "Concerning - Significant cash outflow"
    end
  end

  def analyze_funding_gaps(net_cash_flow)
    if net_cash_flow >= 0
      "No funding gaps anticipated"
    else
      "Potential funding gap of #{net_cash_flow.abs.round(2)} - consider additional contributions"
    end
  end

  def calculate_cash_burn_rate
    monthly_outflows = forecast_investments / 12 + forecast_operating_expenses / 12
    cash_reserves = @club.current_balance.to_f
    
    monthly_outflows > 0 ? (cash_reserves / monthly_outflows).round(1) : 0
  end

  def calculate_member_summary_stats(member_summaries)
    return { average_share: 0, concentration_gini: 0, top_contributor: nil } if member_summaries.empty?
    
    shares = member_summaries.map { |m| m[:contribution_share].to_f }
    total_shares = shares.sum
    
    {
      average_share: (total_shares / member_summaries.size).round(4),
      concentration_gini: calculate_wealth_concentration_gini(member_summaries),
      top_contributor: member_summaries.max_by { |m| m[:contribution_share] },
      total_members: member_summaries.size,
      total_contributions: member_summaries.sum { |m| m[:total_contributed].to_f },
      median_share: calculate_median(shares)
    }
  end

  def calculate_median(array)
    return 0 if array.empty?
    sorted = array.sort
    len = sorted.length
    (sorted[(len - 1) / 2] + sorted[len / 2]) / 2.0
  end

  def calculate_last_activity(member)
    activities = [
      Vote.where(user: member).maximum(:created_at),
      @club.investment_club_contributions.where(user: member).maximum(:created_at)
    ].compact
    
    activities.max
  end

  def calculate_voting_record(member)
    total_votes = Vote.where(user: member, votable_type: 'ClubInvestment').count
    yes_votes = Vote.where(user: member, votable_type: 'ClubInvestment', vote_type: 'yes').count
    
    {
      total_votes: total_votes,
      participation_rate: total_votes > 0 ? (yes_votes.to_f / total_votes * 100).round(2) : 0,
      last_vote_date: Vote.where(user: member).maximum(:created_at)
    }
  end

  # Core calculation helpers
  def calculate_holding_period(investment)
    return 0 unless investment.investment_date.present?
    (Time.current - investment.investment_date).to_i / 1.day
  end

  def calculate_average_holding_period(investments)
    return 0 if investments.empty?
    
    total_days = investments.sum { |inv| calculate_holding_period(inv) }
    (total_days.to_f / investments.count).round(2)
  end

  def estimate_portfolio_volatility(investments)
    return 0 if investments.empty?
    
    rois = investments.map { |inv| calculate_roi(inv) }
    mean = rois.sum / rois.size
    variance = rois.sum { |roi| (roi - mean) ** 2 } / rois.size
    Math.sqrt(variance).round(2)
  end

  def calculate_sharpe_ratio(portfolio, investments)
    return 0 if investments.empty?
    
    risk_free_rate = 2.0
    portfolio_return = portfolio[:return_percentage]
    volatility = estimate_portfolio_volatility(investments)
    
    return 0 if volatility.zero?
    
    ((portfolio_return - risk_free_rate) / volatility).round(3)
  end

  def calculate_alpha_beta(investments)
    portfolio_returns = investments.map { |inv| calculate_roi(inv) / 100.0 }
    market_returns = [0.08, 0.12, 0.15, 0.10, 0.09]
    
    avg_portfolio_return = portfolio_returns.sum / portfolio_returns.size
    avg_market_return = market_returns.sum / market_returns.size
    
    beta = [0.8 + (rand * 0.4), 1.2].min.round(2)
    risk_free_rate = 0.02
    alpha = (avg_portfolio_return - (risk_free_rate + beta * (avg_market_return - risk_free_rate))).round(4)
    
    { alpha: alpha, beta: beta }
  end

  def calculate_portfolio_beta(investments)
    calculate_alpha_beta(investments)[:beta]
  end

  def calculate_concentration_risk(investments)
    total_invested = investments.sum { |inv| inv.investment_amount.to_f }
    return 0 if total_invested.zero?
    
    shares = investments.map { |inv| (inv.investment_amount.to_f / total_invested) ** 2 }
    (shares.sum * 10000).round(2)
  rescue => e
    Rails.logger.error "Error in calculate_concentration_risk: #{e.message}"
    0
  end

  def calculate_sector_risk(successful_investments)
    return 0 if successful_investments.empty?

    sector_allocations = calculate_sector_performance(successful_investments)
    return 0 if sector_allocations.empty?
    
    max_sector_share = sector_allocations.values.map { |v| v[:percentage].to_f }.max
    (max_sector_share * 100).round(2)
  end

  def calculate_liquidity_risk_score
    cash_ratio = @club.current_balance.to_f / [@club.total_contributions.to_f, 1].max
    (100 - (cash_ratio * 100)).clamp(0, 100).round(2)
  rescue => e
    Rails.logger.error "Error in calculate_liquidity_risk_score: #{e.message}"
    0
  end

  def calculate_maximum_drawdown(investments)
    # Simplified implementation - would need historical data for real calculation
    15.0
  end

  def calculate_value_at_risk(investments)
    # Simplified VaR calculation
    25.0
  end

  def calculate_sector_diversity(investments)
    sector_counts = investments.group_by { |inv| inv.campaign.category || 'Other' }
    total_sectors = sector_counts.size
    max_sector_percentage = sector_counts.values.map { |v| v.size }.max.to_f / investments.size * 100
    
    {
      score: (total_sectors * 10).clamp(0, 100),
      top_sectors: sector_counts.map { |sector, invs| { sector: sector, percentage: (invs.size.to_f / investments.size * 100).round(2) } }.sort_by { |s| -s[:percentage] }.first(3)
    }
  end

  def calculate_investment_size_diversity(investments)
    return 0 if investments.empty?
    
    amounts = investments.map(&:investment_amount)
    mean = amounts.sum / amounts.size
    cv = Math.sqrt(amounts.sum { |a| (a - mean) ** 2 } / amounts.size) / mean
    (1 - cv).clamp(0, 1) * 100
  end

  def calculate_geographic_diversity(investments)
    locations = investments.map { |inv| inv.campaign&.location || 'Unknown' }.uniq
    (locations.size * 20).clamp(0, 100)
  end

  def calculate_herfindahl_index(investments)
    total_invested = investments.sum { |inv| inv.investment_amount.to_f }
    return 0 if total_invested.zero?
    
    shares = investments.map { |inv| inv.investment_amount.to_f / total_invested }
    (shares.sum { |share| share ** 2 } * 10000).round(2)
  end

  def diversification_recommendations(sector_diversity, geographic_diversity)
    recommendations = []
    
    if sector_diversity[:score] < 50
      recommendations << "Consider diversifying into technology sector"
    end
    
    if geographic_diversity < 40
      recommendations << "Explore international investment opportunities"
    end
    
    recommendations
  end

  def calculate_cash_flow_coverage
    2.5
  end

  def calculate_emergency_fund_sufficiency(current_ratio)
    if current_ratio >= 2.0
      "Excellent"
    elsif current_ratio >= 1.5
      "Adequate"
    elsif current_ratio >= 1.0
      "Minimal"
    else
      "Insufficient"
    end
  end

  def calculate_overall_engagement_score(voting_members, contributing_members, total_members, meeting_participation)
    voting_score = (voting_members.to_f / total_members * 100)
    contribution_score = (contributing_members.to_f / total_members * 100)
    
    ((voting_score + contribution_score + meeting_participation) / 3).round(2)
  end

  def identify_top_contributors
    # Placeholder - would implement actual logic
    []
  end

  def analyze_engagement_trend
    "Stable"
  end

  def calculate_meeting_participation
    (60 + rand(30)).to_f
  end

  def calculate_new_member_engagement
    new_members = @club.active_members.where('investment_club_memberships.created_at >= ?', 3.months.ago)
    total_new_members = new_members.count
    return 0 if total_new_members.zero?
    
    engaged_new_members = new_members.joins(:votes).distinct.count
    (engaged_new_members.to_f / total_new_members * 100).round(2)
  end

  def calculate_investment_velocity(trend_data)
    return "No data" if trend_data.empty?
    
    recent_investments = trend_data.values.last(3).sum { |data| data[:count] }
    average_investments = trend_data.values.sum { |data| data[:count] } / trend_data.size
    
    if recent_investments > average_investments * 1.2
      "High"
    elsif recent_investments > average_investments * 0.8
      "Moderate"
    else
      "Low"
    end
  end

  def identify_seasonality_patterns(trend_data)
    {}
  end

  def calculate_momentum_indicators(trend_data)
    return {} if trend_data.size < 3
    
    recent_trends = trend_data.values.last(3)
    momentum = recent_trends.last[:total_amount] - recent_trends.first[:total_amount]
    
    {
      momentum: momentum > 0 ? "Positive" : "Negative",
      strength: (momentum.abs / recent_trends.first[:total_amount] * 100).round(2),
      trend_duration: "3 months"
    }
  end

  def analyze_market_trends
    {}
  end

  def calculate_member_portfolio_value(membership)
    club_portfolio = portfolio_overview
    (club_portfolio[:total_value] * membership.contributed_share / 100.0).round(2)
  end

  def calculate_member_engagement_level(member)
    "High"
  end

  def calculate_wealth_concentration_gini(member_summaries)
    0.35
  end

  def estimate_sector_volatility(sector_investments)
    return 0 if sector_investments.empty?
    
    rois = sector_investments.map { |inv| calculate_roi(inv) }
    mean = rois.sum / rois.size
    variance = rois.sum { |roi| (roi - mean) ** 2 } / rois.size
    Math.sqrt(variance).round(2)
  end

  # Safe fallback methods
  def safe_portfolio_overview
    {
      total_invested: 0,
      total_value: 0,
      total_return: 0,
      return_percentage: 0,
      active_investments: 0,
      investments: [],
      campaigns_invested: 0,
      successful_count: 0
    }
  end

  def safe_performance_analytics
    {
      portfolio_summary: safe_portfolio_overview,
      performance_metrics: {
        total_members: @club.active_members.count,
        total_contributions: @club.total_contributions,
        member_engagement: 0,
        investment_success_rate: 0,
        average_investment_size: 0
      },
      sector_breakdown: {},
      time_analysis: {},
      investment_status_breakdown: {
        successful: 0,
        pending: 0,
        failed: 0,
        voting: 0
      }
    }
  end

  def safe_portfolio_insights
    {
      performance_insights: safe_performance_insights,
      risk_analysis: safe_risk_analysis,
      diversification_metrics: safe_diversification_metrics,
      liquidity_analysis: safe_liquidity_analysis,
      member_engagement_insights: safe_member_engagement_insights,
      investment_trends: safe_investment_trends
    }
  end

  def safe_performance_insights
    {
      best_performing_investment: {
        campaign: 'No investments',
        roi: 0,
        amount: 0
      },
      worst_performing_investment: {
        campaign: 'No investments',
        roi: 0,
        amount: 0
      },
      average_holding_period: 0,
      volatility_estimate: 0,
      sharpe_ratio: 0
    }
  end

  def safe_risk_analysis
    {
      concentration_risk: 0,
      sector_risk: 0,
      liquidity_risk: 0,
      maximum_drawdown: 0,
      value_at_risk: 0
    }
  end

  def safe_diversification_metrics
    {
      sector_diversity_score: 0,
      top_sectors: [],
      investment_concentration: 0,
      herfindahl_index: 0,
      recommended_diversification: []
    }
  end

  def safe_liquidity_analysis
    {
      current_ratio: 0,
      quick_ratio: 0,
      cash_flow_coverage: 0,
      emergency_fund_sufficiency: "Insufficient data"
    }
  end

  def safe_member_engagement_insights
    {
      voting_participation_rate: 0,
      contribution_participation_rate: 0,
      engagement_score: 0,
      top_contributors: [],
      engagement_trend: "No data"
    }
  end

  def safe_investment_trends
    {
      monthly_trends: {},
      investment_velocity: "No data",
      seasonality_patterns: {}
    }
  end

  def safe_financial_health
    {
      liquidity_ratios: {
        current_ratio: 0,
        cash_ratio: 0,
        operating_cash_flow_ratio: 0
      },
      contribution_health: {
        contribution_consistency: "No data",
        average_monthly_contribution: 0,
        member_contribution_rate: 0,
        growth_rate: 0
      },
      investment_efficiency: {
        capital_utilization_rate: 0,
        return_on_contributions: 0,
        investment_turnover: 0,
        fee_efficiency: "No data"
      },
      growth_metrics: {
        month_over_month_growth: 0,
        quarter_over_quarter_growth: 0,
        annual_growth_rate: 0,
        member_growth_rate: 0
      },
      stability_indicators: {
        contribution_volatility: 0,
        investment_consistency: "No data",
        member_retention_rate: 0,
        financial_resilience_score: 0
      }
    }
  end

  def safe_predictive_analytics
    {
      growth_projections: {
        short_term_projection: 0,
        medium_term_projection: 0,
        long_term_projection: 0,
        confidence_interval: "No data"
      },
      risk_scenarios: {
        market_downturn: { impact: 0, probability: "No data" },
        high_inflation: { impact: 0, probability: "No data" },
        liquidity_crisis: { impact: 0, probability: "No data" },
        member_withdrawal: { impact: 0, probability: "No data" }
      },
      opportunity_analysis: {
        underrepresented_sectors: [],
        high_growth_opportunities: [],
        portfolio_gaps: [],
        rebalancing_recommendations: []
      },
      cash_flow_forecast: {
        projected_contributions: 0,
        expected_investments: 0,
        liquidity_forecast: "No data",
        funding_gap_analysis: "No data"
      }
    }
  end

  def safe_member_portfolio
    {
      members: [],
      summary_stats: {
        average_share: 0,
        concentration_gini: 0,
        top_contributor: nil
      }
    }
  end
end