# app/services/club_portfolio_service.rb
class ClubPortfolioService
  def initialize(investment_club)
    @club = investment_club
  end

  def portfolio_overview
    executed_investments = @club.club_investments.executed.includes(:campaign)
    
    total_invested = executed_investments.sum(:investment_amount)
    current_value = calculate_current_portfolio_value(executed_investments)
    total_returns = current_value - total_invested
    
    {
      total_invested: total_invested,
      current_value: current_value,
      total_returns: total_returns,
      return_percentage: total_invested > 0 ? (total_returns / total_invested * 100).round(2) : 0,
      active_investments: executed_investments.count,
      performance_breakdown: performance_breakdown(executed_investments),
      asset_allocation: asset_allocation(executed_investments),
      risk_metrics: calculate_risk_metrics(executed_investments)
    }
  end

  def member_portfolio(user)
    membership = @club.membership_for(user)
    return {} unless membership&.active?
    
    member_shares = MemberInvestmentShare.where(user: user)
                                        .includes(club_investment: :campaign)
    
    total_invested = member_shares.sum do |share|
      (share.share_percentage / 100) * share.club_investment.investment_amount
    end
    
    current_value = member_shares.sum do |share|
      campaign = share.club_investment.campaign
      share_value = calculate_campaign_current_value(campaign, share.effective_shares)
      share_value
    end
    
    {
      member_share: membership.current_share,
      total_invested: total_invested.round(2),
      current_value: current_value.round(2),
      total_returns: (current_value - total_invested).round(2),
      return_percentage: total_invested > 0 ? ((current_value - total_invested) / total_invested * 100).round(2) : 0,
      investments: member_shares.map { |s| format_member_investment(s) }
    }
  end

  def performance_analytics
    investments = @club.club_investments.executed.includes(:campaign)
    
    {
      monthly_performance: monthly_performance_series,
      category_performance: category_performance(investments),
      risk_adjusted_returns: calculate_sharpe_ratio(investments),
      benchmark_comparison: benchmark_comparison(investments),
      ai_insights: generate_ai_portfolio_insights(investments)
    }
  end

  def generate_ai_portfolio_insights(investments)
    # Use your existing AI service to analyze portfolio
    portfolio_analysis = analyze_portfolio_diversification(investments)
    risk_analysis = analyze_portfolio_risk(investments)
    
    {
      diversification_score: portfolio_analysis[:diversification_score],
      concentration_risks: portfolio_analysis[:concentration_risks],
      recommended_actions: generate_recommended_actions(portfolio_analysis, risk_analysis),
      portfolio_health: assess_portfolio_health(portfolio_analysis, risk_analysis)
    }
  end

  private

  def calculate_current_portfolio_value(investments)
    investments.sum do |investment|
      campaign = investment.campaign
      shares_owned = investment.shares_acquired
      
      if campaign.is_a?(EquityCampaign)
        # For equity campaigns, calculate current value based on company valuation
        (shares_owned / campaign.total_shares.to_f) * campaign.valuation
      else
        # For donation-based campaigns, value remains the invested amount
        investment.investment_amount
      end
    end.round(2)
  end

  def calculate_campaign_current_value(campaign, shares_owned)
    if campaign.is_a?(EquityCampaign)
      (shares_owned / campaign.total_shares.to_f) * campaign.valuation
    else
      # For non-equity, return original investment (simplified)
      (shares_owned / campaign.total_shares.to_f) * campaign.goal_amount
    end
  end

  def performance_breakdown(investments)
    investments.group_by { |i| i.campaign.category }
              .transform_values do |category_investments|
      total_invested = category_investments.sum(&:investment_amount)
      current_value = category_investments.sum { |i| calculate_campaign_current_value(i.campaign, i.shares_acquired) }
      returns = current_value - total_invested
      
      {
        total_invested: total_invested,
        current_value: current_value,
        returns: returns,
        return_percentage: total_invested > 0 ? (returns / total_invested * 100).round(2) : 0,
        investment_count: category_investments.count
      }
    end
  end

  def asset_allocation(investments)
    total_value = calculate_current_portfolio_value(investments)
    return {} if total_value.zero?
    
    investments.group_by { |i| i.campaign.category }
              .transform_values do |category_investments|
      category_value = category_investments.sum { |i| calculate_campaign_current_value(i.campaign, i.shares_acquired) }
      (category_value / total_value * 100).round(2)
    end
  end

  def calculate_risk_metrics(investments)
    # Simplified risk metrics
    returns = investments.map do |investment|
      current_value = calculate_campaign_current_value(investment.campaign, investment.shares_acquired)
      (current_value - investment.investment_amount) / investment.investment_amount
    end
    
    avg_return = returns.sum / returns.size
    variance = returns.sum { |r| (r - avg_return) ** 2 } / returns.size
    volatility = Math.sqrt(variance)
    
    {
      volatility: volatility.round(4),
      max_drawdown: calculate_max_drawdown(returns),
      var_95: calculate_var(returns, 0.95)
    }
  end

  def format_member_investment(share)
    investment = share.club_investment
    campaign = investment.campaign
    current_value = calculate_campaign_current_value(campaign, share.effective_shares)
    invested_amount = (share.share_percentage / 100) * investment.investment_amount
    
    {
      campaign_title: campaign.title,
      campaign_type: campaign.class.name,
      share_percentage: share.share_percentage,
      invested_amount: invested_amount.round(2),
      current_value: current_value.round(2),
      returns: (current_value - invested_amount).round(2),
      return_percentage: invested_amount > 0 ? ((current_value - invested_amount) / invested_amount * 100).round(2) : 0
    }
  end

  def monthly_performance_series
    # Generate time-series performance data
    # This would typically query historical data
    12.times.map do |i|
      month = i.months.ago
      {
        period: month.strftime('%Y-%m'),
        value: calculate_portfolio_value_at(month.end_of_month)
      }
    end.reverse
  end

  def calculate_portfolio_value_at(date)
    # Simplified - in reality, you'd need historical valuation data
    @club.club_investments.executed
         .where('created_at <= ?', date)
         .sum(:investment_amount) * rand(0.8..1.5) # Placeholder
  end

  def analyze_portfolio_diversification(investments)
    category_distribution = investments.group_by { |i| i.campaign.category }
                                     .transform_values(&:count)
    total_investments = investments.count
    
    diversification_score = calculate_diversification_score(category_distribution, total_investments)
    
    {
      diversification_score: diversification_score,
      concentration_risks: identify_concentration_risks(category_distribution, total_investments),
      category_distribution: category_distribution
    }
  end

  def calculate_diversification_score(distribution, total)
    return 0 if total.zero?
    
    # Herfindahl index for diversification measurement
    herfindahl = distribution.values.sum { |count| (count.to_f / total) ** 2 }
    (1 - herfindahl) * 100 # Convert to score out of 100
  end

  def identify_concentration_risks(distribution, total)
    risks = []
    distribution.each do |category, count|
      percentage = (count.to_f / total * 100).round(2)
      risks << "#{category}: #{percentage}%" if percentage > 30
    end
    risks
  end

  # Placeholder methods for complex calculations
  def calculate_sharpe_ratio(investments); 1.2; end
  def benchmark_comparison(investments); {}; end
  def calculate_max_drawdown(returns); 0.15; end
  def calculate_var(returns, confidence); 0.1; end
  def analyze_portfolio_risk(investments); {}; end
  def generate_recommended_actions(portfolio_analysis, risk_analysis); []; end
  def assess_portfolio_health(portfolio_analysis, risk_analysis); 'healthy'; end
end