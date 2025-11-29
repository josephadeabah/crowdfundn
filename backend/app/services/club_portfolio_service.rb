# app/services/club_portfolio_service.rb
class ClubPortfolioService
  def initialize(investment_club)
    @club = investment_club
  end

  def portfolio_overview
    investments = @club.club_investments.includes(:campaign)
    
    successful_investments = investments.select do |investment|
      investment.status.in?(%w[successful executed committed])
    end

    total_invested = successful_investments.sum(&:investment_amount).to_f
    
    total_value = successful_investments.sum do |investment|
      calculate_current_value(investment)
    end
    
    total_return = total_value - total_invested
    return_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0

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
    
    successful_investments = investments.select { |inv| inv.status.in?(%w[successful executed committed]) }
    pending_investments = investments.select { |inv| inv.status.in?(%w[pending voting]) }
    
    sector_performance = calculate_sector_performance(successful_investments)
    monthly_performance = calculate_monthly_performance(investments)
    
    {
      portfolio_summary: portfolio,
      performance_metrics: {
        total_members: @club.active_members.count,
        total_contributions: @club.total_contributions.to_f,
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

    club_portfolio = portfolio_overview
    
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

  def approved_campaigns
    ApprovedCampaign.for_club(@club).includes(
      campaign: [:fundraiser],
      club_investment: [:votes]
    ).map do |approved_campaign|
      campaign = approved_campaign.campaign
      club_investment = approved_campaign.club_investment
      
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
        can_delete: @club.is_admin?(@current_user)
      }
    end
  end

  private

  def calculate_current_value(investment)
    return investment.current_value.to_f if investment.current_value.present?
    
    campaign = investment.campaign
    if campaign && campaign.current_amount.present? && campaign.goal_amount.present? && campaign.goal_amount > 0
      growth_factor = campaign.current_amount.to_f / campaign.goal_amount.to_f
      investment.investment_amount.to_f * growth_factor
    else
      investment.investment_amount.to_f
    end
  end

  def transform_investments_for_portfolio(investments)
    investments.map do |investment|
      current_value = calculate_current_value(investment)
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
      total_invested = month_investments.sum(&:investment_amount)
      successful_count = month_investments.count { |inv| inv.status.in?(%w[successful executed committed]) }
      
      {
        investments_count: month_investments.count,
        total_invested: total_invested,
        successful_investments: successful_count
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

  def calculate_sector_performance(investments)
    return {} if investments.empty?

    sectors = investments.group_by do |inv|
      inv.campaign&.category || 'Other'
    end
    
    sectors.transform_values do |sector_investments|
      total_invested = sector_investments.sum { |inv| inv.investment_amount.to_f }
      total_value = sector_investments.sum { |inv| calculate_current_value(inv) }
      total_return = total_value - total_invested
      roi_percentage = total_invested > 0 ? (total_return / total_invested * 100).round(2) : 0
      
      total_portfolio_value = investments.sum { |inv| calculate_current_value(inv) }
      percentage = total_portfolio_value > 0 ? (total_value / total_portfolio_value * 100).round(2) : 0
      
      {
        count: sector_investments.count,
        total_invested: total_invested,
        total_value: total_value,
        total_return: total_return,
        roi_percentage: roi_percentage,
        percentage: percentage
      }
    end
  end

  def performance_insights(portfolio, successful_investments)
    return safe_performance_insights if successful_investments.empty?

    investments_with_roi = successful_investments.map do |inv|
      {
        investment: inv,
        roi: calculate_roi(inv)
      }
    end

    best_performer_data = investments_with_roi.max_by { |data| data[:roi] }
    worst_performer_data = investments_with_roi.min_by { |data| data[:roi] }
    
    {
      best_performing_investment: {
        campaign: best_performer_data[:investment].campaign&.title || 'Unknown',
        roi: best_performer_data[:roi],
        amount: best_performer_data[:investment].investment_amount.to_f
      },
      worst_performing_investment: {
        campaign: worst_performer_data[:investment].campaign&.title || 'Unknown',
        roi: worst_performer_data[:roi],
        amount: worst_performer_data[:investment].investment_amount.to_f
      },
      average_holding_period: calculate_average_holding_period(successful_investments),
      volatility_estimate: estimate_portfolio_volatility(successful_investments),
      sharpe_ratio: calculate_sharpe_ratio(portfolio, successful_investments)
    }
  end

  def risk_analysis(successful_investments)
    return safe_risk_analysis if successful_investments.empty?

    {
      concentration_risk: calculate_concentration_risk(successful_investments),
      sector_risk: calculate_sector_risk(successful_investments),
      liquidity_risk: calculate_liquidity_risk_score,
      maximum_drawdown: calculate_maximum_drawdown(successful_investments),
      value_at_risk: calculate_value_at_risk(successful_investments)
    }
  end

  def calculate_concentration_risk(investments)
    total_invested = investments.sum { |inv| inv.investment_amount.to_f }
    return 0 if total_invested.zero?
    
    shares = investments.map { |inv| (inv.investment_amount.to_f / total_invested) ** 2 }
    (shares.sum * 10000).round(2)
  end

  def calculate_sector_risk(successful_investments)
    sector_allocations = calculate_sector_performance(successful_investments)
    return 0 if sector_allocations.empty?
    
    max_sector_share = sector_allocations.values.map { |v| v[:percentage].to_f }.max
    (max_sector_share * 100).round(2)
  end

  def calculate_liquidity_risk_score
    total_contributions = @club.total_contributions.to_f
    return 50 if total_contributions.zero?
    
    cash_ratio = @club.current_balance.to_f / total_contributions
    risk_score = (100 - (cash_ratio * 100)).clamp(0, 100)
    risk_score.round(2)
  end

  def calculate_maximum_drawdown(investments)
    return 0 if investments.empty?
    
    monthly_returns = calculate_monthly_returns(investments)
    return 0 if monthly_returns.empty?
    
    peak = monthly_returns.first
    max_drawdown = 0
    
    monthly_returns.each do |return_val|
      if return_val > peak
        peak = return_val
      else
        drawdown = (peak - return_val) / peak
        max_drawdown = [max_drawdown, drawdown].max
      end
    end
    
    (max_drawdown * 100).round(2)
  end

  def calculate_value_at_risk(investments, confidence_level: 0.95)
    return 0 if investments.empty?
    
    returns = investments.map { |inv| calculate_roi(inv) }
    return 0 if returns.empty?
    
    sorted_returns = returns.sort
    var_index = ((1 - confidence_level) * returns.size).floor
    sorted_returns[var_index].abs.round(2)
  end

  def calculate_monthly_returns(investments)
    monthly_data = investments.group_by { |inv| inv.created_at.beginning_of_month }
    
    monthly_data.keys.sort.map do |month|
      month_investments = monthly_data[month]
      month_investments.sum { |inv| calculate_current_value(inv) - inv.investment_amount.to_f }
    end
  end

  def calculate_roi(investment)
    current_value = calculate_current_value(investment)
    investment_amount = investment.investment_amount.to_f
    
    return 0 if investment_amount.zero?
    
    ((current_value - investment_amount) / investment_amount * 100).round(2)
  end

  def calculate_average_holding_period(investments)
    return 0 if investments.empty?
    
    total_days = investments.sum do |inv|
      (Time.current - inv.created_at).to_i / 1.day
    end
    (total_days.to_f / investments.count).round(2)
  end

  def estimate_portfolio_volatility(investments)
    rois = investments.map { |inv| calculate_roi(inv) }
    return 0 if rois.empty? || rois.size == 1
    
    mean = rois.sum / rois.size
    variance = rois.sum { |roi| (roi - mean) ** 2 } / rois.size
    Math.sqrt(variance).round(2)
  end

  def calculate_sharpe_ratio(portfolio, investments)
    return 0 if investments.empty?
    
    risk_free_rate = 2.0
    portfolio_return = portfolio[:return_percentage].to_f
    volatility = estimate_portfolio_volatility(investments)
    
    return 0 if volatility.zero?
    
    ((portfolio_return - risk_free_rate) / volatility).round(3)
  end

  def diversification_metrics(successful_investments)
    return safe_diversification_metrics if successful_investments.empty?

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

  def calculate_sector_diversity(investments)
    sector_counts = investments.group_by { |inv| inv.campaign.category || 'Other' }
    total_sectors = sector_counts.size
    max_sector_percentage = sector_counts.values.map { |v| v.size }.max.to_f / investments.size * 100
    
    diversity_score = (total_sectors * 10).clamp(0, 100)
    
    {
      score: diversity_score,
      top_sectors: sector_counts.map { |sector, invs| 
        { 
          sector: sector, 
          percentage: (invs.size.to_f / investments.size * 100).round(2) 
        } 
      }.sort_by { |s| -s[:percentage] }.first(3)
    }
  end

  def calculate_investment_size_diversity(investments)
    return 0 if investments.empty?
    
    amounts = investments.map { |inv| inv.investment_amount.to_f }
    mean = amounts.sum / amounts.size
    return 100 if mean.zero?
    
    standard_deviation = Math.sqrt(amounts.sum { |a| (a - mean) ** 2 } / amounts.size)
    coefficient_of_variation = standard_deviation / mean
    
    diversity_score = (1 - [coefficient_of_variation, 1].min) * 100
    diversity_score.clamp(0, 100).round(2)
  end

  def calculate_herfindahl_index(investments)
    total_invested = investments.sum { |inv| inv.investment_amount.to_f }
    return 0 if total_invested.zero?
    
    shares = investments.map { |inv| (inv.investment_amount.to_f / total_invested) ** 2 }
    (shares.sum * 10000).round(2)
  end

  def diversification_recommendations(sector_diversity)
    recommendations = []
    
    if sector_diversity[:score] < 50
      recommendations << "Consider diversifying across more sectors"
    end
    
    top_sector_percentage = sector_diversity[:top_sectors].first[:percentage]
    if top_sector_percentage > 50
      recommendations << "Reduce concentration in #{sector_diversity[:top_sectors].first[:sector]} sector"
    end
    
    recommendations.present? ? recommendations : ["Portfolio is well diversified"]
  end

  def liquidity_analysis
    {
      current_ratio: calculate_current_ratio,
      quick_ratio: calculate_quick_ratio,
      cash_flow_coverage: calculate_cash_flow_coverage,
      emergency_fund_sufficiency: calculate_emergency_fund_sufficiency
    }
  end

  def calculate_current_ratio
    current_assets = @club.current_balance.to_f
    current_liabilities = @club.total_invested.to_f * 0.1
    
    return 0 if current_liabilities.zero?
    (current_assets / current_liabilities).round(2)
  end

  def calculate_quick_ratio
    current_assets = @club.current_balance.to_f
    total_invested = @club.total_invested.to_f
    
    return 0 if total_invested.zero?
    (current_assets / total_invested).round(2)
  end

  def calculate_cash_flow_coverage
    monthly_contributions = @club.investment_club_contributions
                                .where('created_at >= ?', 1.month.ago)
                                .sum(:amount)
    monthly_investments = @club.club_investments
                              .where('created_at >= ?', 1.month.ago)
                              .sum(:investment_amount)
    
    net_cash_flow = monthly_contributions - monthly_investments
    return 0 if monthly_investments.zero?
    
    (net_cash_flow / monthly_investments).round(2)
  end

  def calculate_emergency_fund_sufficiency
    current_balance = @club.current_balance.to_f
    monthly_contributions = @club.investment_club_contributions
                                .where('created_at >= ?', 1.month.ago)
                                .sum(:amount)
    
    if monthly_contributions.zero?
      current_balance > 1000 ? "Adequate" : "Insufficient"
    else
      months_coverage = current_balance / monthly_contributions
      if months_coverage >= 3
        "Adequate"
      elsif months_coverage >= 1
        "Moderate"
      else
        "Insufficient"
      end
    end
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
    
    {
      voting_participation_rate: (voting_members.to_f / total_members * 100).round(2),
      contribution_participation_rate: (contributing_members.to_f / total_members * 100).round(2),
      engagement_score: calculate_overall_engagement_score(voting_members, contributing_members, total_members),
      top_contributors: identify_top_contributors,
      engagement_trend: analyze_engagement_trend
    }
  end

  def calculate_overall_engagement_score(voting_members, contributing_members, total_members)
    voting_score = (voting_members.to_f / total_members) * 50
    contribution_score = (contributing_members.to_f / total_members) * 50
    (voting_score + contribution_score).round(2)
  end

  def identify_top_contributors
    top_contributors = @club.investment_club_memberships
                           .active
                           .order(total_contributed: :desc)
                           .limit(5)
                           .includes(:user)
    
    top_contributors.map do |membership|
      {
        name: membership.user.full_name,
        amount: membership.total_contributed,
        share: membership.contributed_share
      }
    end
  end

  def analyze_engagement_trend
    recent_engagement = @club.investment_club_memberships
                            .where('last_active_at >= ?', 1.month.ago)
                            .count
    total_members = @club.active_members.count
    
    engagement_rate = total_members > 0 ? (recent_engagement.to_f / total_members * 100).round(2) : 0
    
    if engagement_rate >= 70
      "High"
    elsif engagement_rate >= 40
      "Moderate"
    else
      "Low"
    end
  end

  def investment_trends(investments)
    monthly_trends = investments.group_by { |inv| inv.created_at.beginning_of_month }
    
    trend_data = monthly_trends.transform_values do |month_investments|
      total_amount = month_investments.sum(&:investment_amount)
      successful_count = month_investments.count { |inv| inv.status.in?(%w[successful executed committed]) }
      success_rate = month_investments.count > 0 ? (successful_count.to_f / month_investments.count * 100).round(2) : 0
      
      {
        count: month_investments.count,
        total_amount: total_amount,
        success_rate: success_rate
      }
    end.sort.to_h

    {
      monthly_trends: trend_data,
      investment_velocity: calculate_investment_velocity(trend_data),
      seasonality_patterns: identify_seasonality_patterns(trend_data)
    }
  end

  def calculate_investment_velocity(trend_data)
    return "No data" if trend_data.empty?
    
    recent_months = trend_data.keys.last(3)
    return "Low" if recent_months.empty?
    
    total_investments = recent_months.sum { |month| trend_data[month][:count] }
    average_per_month = total_investments.to_f / recent_months.size
    
    if average_per_month >= 5
      "High"
    elsif average_per_month >= 2
      "Moderate"
    else
      "Low"
    end
  end

  def identify_seasonality_patterns(trend_data)
    return {} if trend_data.size < 12
    
    monthly_totals = Hash.new(0)
    trend_data.each do |month, data|
      month_name = month.strftime("%B")
      monthly_totals[month_name] += data[:total_amount]
    end
    
    average_monthly = monthly_totals.values.sum / monthly_totals.size
    seasonality = {}
    
    monthly_totals.each do |month, total|
      deviation = ((total - average_monthly) / average_monthly * 100).round(2)
      seasonality[month] = deviation
    end
    
    seasonality
  end

  def liquidity_ratios
    {
      current_ratio: calculate_current_ratio,
      cash_ratio: calculate_cash_ratio,
      operating_cash_flow_ratio: calculate_operating_cash_flow_ratio
    }
  end

  def calculate_cash_ratio
    cash = @club.current_balance.to_f
    total_contributions = @club.total_contributions.to_f
    
    return 0 if total_contributions.zero?
    (cash / total_contributions).round(3)
  end

  def calculate_operating_cash_flow_ratio
    monthly_contributions = @club.investment_club_contributions
                                .where('created_at >= ?', 1.month.ago)
                                .sum(:amount)
    monthly_expenses = @club.club_investments
                           .where('created_at >= ?', 1.month.ago)
                           .sum(:investment_amount)
    
    return 0 if monthly_expenses.zero?
    (monthly_contributions / monthly_expenses).round(2)
  end

  def contribution_health
    recent_contributions = @club.investment_club_contributions.completed.where('created_at >= ?', 3.months.ago)
    total_recent = recent_contributions.sum(:amount)
    average_monthly_contribution = total_recent / 3.0
    
    {
      contribution_consistency: calculate_contribution_consistency(recent_contributions),
      average_monthly_contribution: average_monthly_contribution.round(2),
      member_contribution_rate: calculate_member_contribution_rate(recent_contributions),
      growth_rate: calculate_contribution_growth_rate
    }
  end

  def calculate_contribution_consistency(contributions)
    monthly_totals = contributions.group_by { |c| c.created_at.beginning_of_month }
                                 .transform_values { |cs| cs.sum(&:amount) }
                                 .values
    
    return "No data" if monthly_totals.empty?
    
    average = monthly_totals.sum / monthly_totals.size
    variance = monthly_totals.sum { |v| (v - average) ** 2 } / monthly_totals.size
    coefficient_of_variation = Math.sqrt(variance) / average
    
    if coefficient_of_variation < 0.2
      "High"
    elsif coefficient_of_variation < 0.5
      "Moderate"
    else
      "Low"
    end
  end

  def calculate_member_contribution_rate(recent_contributions)
    total_members = @club.active_members.count
    return 0 if total_members.zero?
    
    contributing_members = recent_contributions.distinct.count(:user_id)
    (contributing_members.to_f / total_members * 100).round(2)
  end

  def calculate_contribution_growth_rate
    current_month = @club.investment_club_contributions
                        .completed
                        .where('created_at >= ?', 1.month.ago)
                        .sum(:amount)
    
    previous_month = @club.investment_club_contributions
                         .completed
                         .where('created_at >= ? AND created_at < ?', 2.months.ago, 1.month.ago)
                         .sum(:amount)
    
    return 0 if previous_month.zero?
    
    ((current_month - previous_month) / previous_month * 100).round(2)
  end

  def investment_efficiency_metrics
    total_contributions = @club.total_contributions.to_f
    total_invested = @club.total_invested.to_f
    
    {
      capital_utilization_rate: total_contributions > 0 ? (total_invested / total_contributions).round(3) : 0,
      return_on_contributions: calculate_return_on_contributions,
      investment_turnover: calculate_investment_turnover,
      fee_efficiency: calculate_fee_efficiency
    }
  end

  def calculate_return_on_contributions
    portfolio = portfolio_overview
    total_contributions = @club.total_contributions.to_f
    
    return 0 if total_contributions.zero?
    
    (portfolio[:total_return] / total_contributions * 100).round(2)
  end

  def calculate_investment_turnover
    total_invested = @club.total_invested.to_f
    average_balance = @club.current_balance.to_f
    
    return 0 if average_balance.zero?
    (total_invested / average_balance).round(2)
  end

  def calculate_fee_efficiency
    total_fees = @club.club_investments.sum(:processing_fee).to_f
    total_invested = @club.total_invested.to_f
    
    fee_percentage = total_invested > 0 ? (total_fees / total_invested * 100).round(2) : 0
    
    if fee_percentage < 1
      "Excellent"
    elsif fee_percentage < 3
      "Good"
    elsif fee_percentage < 5
      "Average"
    else
      "Poor"
    end
  end

  def growth_metrics
    {
      month_over_month_growth: calculate_mom_growth,
      quarter_over_quarter_growth: calculate_qoq_growth,
      annual_growth_rate: calculate_annual_growth_rate,
      member_growth_rate: calculate_member_growth_rate
    }
  end

  def calculate_mom_growth
    current_portfolio = portfolio_overview[:total_value]
    previous_month_portfolio = calculate_previous_period_portfolio(1.month.ago)
    
    return 0 if previous_month_portfolio.zero?
    
    ((current_portfolio - previous_month_portfolio) / previous_month_portfolio * 100).round(2)
  end

  def calculate_qoq_growth
    current_portfolio = portfolio_overview[:total_value]
    previous_quarter_portfolio = calculate_previous_period_portfolio(3.months.ago)
    
    return 0 if previous_quarter_portfolio.zero?
    
    ((current_portfolio - previous_quarter_portfolio) / previous_quarter_portfolio * 100).round(2)
  end

  def calculate_annual_growth_rate
    current_portfolio = portfolio_overview[:total_value]
    one_year_ago_portfolio = calculate_previous_period_portfolio(1.year.ago)
    
    return 0 if one_year_ago_portfolio.zero?
    
    ((current_portfolio - one_year_ago_portfolio) / one_year_ago_portfolio * 100).round(2)
  end

  def calculate_previous_period_portfolio(date)
    investments_as_of_date = @club.club_investments.where('created_at <= ?', date)
    investments_as_of_date.sum do |inv|
      calculate_current_value(inv)
    end
  end

  def calculate_member_growth_rate
    current_members = @club.active_members.count
    previous_month_members = @club.investment_club_memberships
                                 .where('created_at <= ? AND status = ?', 1.month.ago, 'active')
                                 .count
    
    return 0 if previous_month_members.zero?
    
    ((current_members - previous_month_members).to_f / previous_month_members * 100).round(2)
  end

  def stability_indicators
    {
      contribution_volatility: calculate_contribution_volatility,
      investment_consistency: calculate_investment_consistency,
      member_retention_rate: calculate_member_retention_rate,
      financial_resilience_score: calculate_financial_resilience_score
    }
  end

  def calculate_contribution_volatility
    monthly_contributions = @club.investment_club_contributions
                                .completed
                                .group_by { |c| c.created_at.beginning_of_month }
                                .transform_values { |cs| cs.sum(&:amount) }
                                .values
    
    return 0 if monthly_contributions.empty? || monthly_contributions.size == 1
    
    average = monthly_contributions.sum / monthly_contributions.size
    variance = monthly_contributions.sum { |v| (v - average) ** 2 } / monthly_contributions.size
    coefficient_of_variation = (Math.sqrt(variance) / average * 100).round(2)
    
    coefficient_of_variation
  end

  def calculate_investment_consistency
    monthly_investments = @club.club_investments
                              .group_by { |inv| inv.created_at.beginning_of_month }
                              .transform_values { |invs| invs.sum(&:investment_amount) }
                              .values
    
    return "No data" if monthly_investments.empty?
    
    average = monthly_investments.sum / monthly_investments.size
    variance = monthly_investments.sum { |v| (v - average) ** 2 } / monthly_investments.size
    coefficient_of_variation = Math.sqrt(variance) / average
    
    if coefficient_of_variation < 0.3
      "Very Consistent"
    elsif coefficient_of_variation < 0.6
      "Consistent"
    else
      "Variable"
    end
  end

  def calculate_member_retention_rate
    total_joined = @club.investment_club_memberships.count
    total_left = @club.investment_club_memberships.where(status: 'inactive').count
    
    return 100 if total_joined.zero?
    
    ((total_joined - total_left).to_f / total_joined * 100).round(2)
  end

  def calculate_financial_resilience_score
    factors = []
    
    current_ratio = calculate_current_ratio
    liquidity_score = [[current_ratio * 10, 25].min, 0].max
    factors << liquidity_score
    
    diversity_score = diversification_metrics(@club.club_investments.where(status: 'successful'))[:sector_diversity_score] * 0.25
    factors << diversity_score
    
    volatility = calculate_contribution_volatility
    growth_stability_score = volatility > 0 ? [100 / volatility, 25].min : 25
    factors << growth_stability_score
    
    retention_rate = calculate_member_retention_rate
    member_stability_score = retention_rate * 0.25
    factors << member_stability_score
    
    factors.sum.round(2)
  end

  def growth_projections
    current_value = portfolio_overview[:total_value]
    historical_growth = calculate_historical_growth_rate
    
    {
      short_term_projection: (current_value * (1 + historical_growth / 100)).round(2),
      medium_term_projection: (current_value * (1 + historical_growth / 100) ** 2).round(2),
      long_term_projection: (current_value * (1 + historical_growth / 100) ** 5).round(2),
      confidence_interval: calculate_projection_confidence(historical_growth)
    }
  end

  def calculate_historical_growth_rate
    monthly_values = []
    6.times do |i|
      date = (i + 1).months.ago
      value = calculate_previous_period_portfolio(date)
      monthly_values << value if value > 0
    end
    
    return 5.0 if monthly_values.empty? || monthly_values.size < 2
    
    growth_rates = []
    (1...monthly_values.size).each do |i|
      growth = (monthly_values[i-1] - monthly_values[i]) / monthly_values[i] * 100
      growth_rates << growth
    end
    
    average_growth = growth_rates.sum / growth_rates.size
    [average_growth, 0].max.round(2)
  end

  def calculate_projection_confidence(historical_growth)
    volatility = calculate_contribution_volatility
    
    if volatility < 10
      "High"
    elsif volatility < 25
      "Medium"
    else
      "Low"
    end
  end

  def risk_scenarios
    current_portfolio = portfolio_overview[:total_value]
    
    {
      market_downturn: {
        impact: -15.0,
        probability: "Medium"
      },
      high_inflation: {
        impact: -8.0,
        probability: "Low"
      },
      liquidity_crisis: {
        impact: -25.0,
        probability: "Very Low"
      },
      member_withdrawal: simulate_member_withdrawal_impact
    }
  end

  def simulate_member_withdrawal_impact
    total_contributions = @club.total_contributions.to_f
    average_member_contribution = total_contributions / @club.active_members.count
    
    {
      impact: -(average_member_contribution * 0.1).round(2),
      probability: "Medium"
    }
  end

  def investment_opportunities
    current_allocations = calculate_sector_performance(@club.club_investments.where(status: 'successful'))
    
    {
      underrepresented_sectors: identify_underserved_sectors(current_allocations),
      high_growth_opportunities: identify_high_growth_opportunities,
      portfolio_gaps: identify_portfolio_gaps(current_allocations),
      rebalancing_recommendations: generate_rebalancing_recommendations(current_allocations)
    }
  end

  def identify_underserved_sectors(current_allocations)
    all_sectors = ['Technology', 'Healthcare', 'Real Estate', 'Consumer', 'Energy', 'Financial', 'Industrial']
    current_sectors = current_allocations.keys.map(&:titleize)
    
    all_sectors - current_sectors
  end

  def identify_high_growth_opportunities
    high_growth_sectors = ['Artificial Intelligence', 'Renewable Energy', 'Digital Health']
    
    high_growth_sectors.select do |sector|
      club_sector_exposure = @club.club_investments.joins(:campaign)
                                   .where("campaigns.category ILIKE ?", "%#{sector}%")
                                   .count
      club_sector_exposure < 2
    end
  end

  def identify_portfolio_gaps(current_allocations)
    gaps = []
    
    if current_allocations.any? { |_, data| data[:percentage] > 40 }
      gaps << "High concentration in top sectors"
    end
    
    if current_allocations.size < 3
      gaps << "Limited sector diversification"
    end
    
    gaps.present? ? gaps : ["No significant gaps identified"]
  end

  def generate_rebalancing_recommendations(current_allocations)
    recommendations = []
    
    current_allocations.each do |sector, data|
      if data[:percentage] > 40
        recommendations << "Consider reducing exposure to #{sector} (currently #{data[:percentage].round(1)}%)"
      end
    end
    
    underserved = identify_underserved_sectors(current_allocations)
    if underserved.any?
      recommendations << "Consider adding exposure to: #{underserved.join(', ')}"
    end
    
    recommendations.present? ? recommendations : ["Portfolio allocation appears balanced"]
  end

  def cash_flow_forecast
    {
      projected_contributions: forecast_contributions,
      expected_investments: forecast_investments,
      liquidity_forecast: forecast_liquidity,
      funding_gap_analysis: analyze_funding_gaps
    }
  end

  def forecast_contributions
    average_monthly = @club.investment_club_contributions
                          .completed
                          .where('created_at >= ?', 3.months.ago)
                          .sum(:amount) / 3.0
    
    (average_monthly * 1.05).round(2)
  end

  def forecast_investments
    average_monthly = @club.club_investments
                          .where('created_at >= ?', 3.months.ago)
                          .sum(:investment_amount) / 3.0
    
    (average_monthly * 1.1).round(2)
  end

  def forecast_liquidity
    projected_cash = @club.current_balance + forecast_contributions - forecast_investments
    monthly_operating_needs = forecast_investments * 0.2
    
    if projected_cash >= monthly_operating_needs * 3
      "Strong"
    elsif projected_cash >= monthly_operating_needs
      "Adequate"
    else
      "Concerning"
    end
  end

  def analyze_funding_gaps
    projected_cash = @club.current_balance + forecast_contributions - forecast_investments
    
    if projected_cash < 0
      "Potential cash shortfall in upcoming period"
    else
      "No significant funding gaps anticipated"
    end
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
        average_share: calculate_average_share(member_summaries),
        concentration_gini: calculate_wealth_concentration_gini(member_summaries),
        top_contributor: member_summaries.max_by { |m| m[:contribution_share] }
      }
    }
  end

  def calculate_member_portfolio_value(membership)
    club_portfolio = portfolio_overview
    (club_portfolio[:total_value] * membership.contributed_share / 100.0).round(2)
  end

  def calculate_member_engagement_level(member)
    votes_count = Vote.where(
      votable_type: 'ClubInvestment',
      votable_id: @club.club_investments.pluck(:id),
      user: member
    ).count
    
    contributions_count = @club.investment_club_contributions.where(user: member).completed.count
    
    total_engagement = votes_count + contributions_count
    
    if total_engagement >= 10
      "High"
    elsif total_engagement >= 5
      "Medium"
    else
      "Low"
    end
  end

  def calculate_average_share(member_summaries)
    return 0 if member_summaries.empty?
    
    member_summaries.sum { |m| m[:contribution_share] } / member_summaries.size
  end

  def calculate_wealth_concentration_gini(member_summaries)
    return 0 if member_summaries.empty?
    
    shares = member_summaries.map { |m| m[:contribution_share] }.sort
    n = shares.size
    sum_shares = shares.sum
    
    absolute_differences = shares.each_with_index.sum do |share_i, i|
      shares.each_with_index.sum do |share_j, j|
        (share_i - share_j).abs
      end
    end
    
    gini = absolute_differences.to_f / (2 * n * n * (sum_shares / n))
    gini.round(3)
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
        total_contributions: @club.total_contributions.to_f,
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