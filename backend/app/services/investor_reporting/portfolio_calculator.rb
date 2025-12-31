module InvestorReporting
  class PortfolioCalculator
    def initialize(user)
      @user = user
    end
    
    def calculate_detailed_portfolio
      begin
        investments = @user.equity_investments.successful.includes(:campaign)
        return empty_portfolio if investments.empty?
        
        {
          summary: calculate_summary(investments),
          by_campaign: calculate_by_campaign(investments),
          performance_metrics: calculate_performance_metrics(investments),
          risk_analysis: calculate_risk_analysis(investments),
          cash_flow: calculate_cash_flow(investments),
          projections: calculate_projections(investments)
        }
      rescue ActiveRecord::StatementInvalid => e
        Rails.logger.error "SQL Error in calculate_detailed_portfolio: #{e.message}"
        # Return simplified portfolio without complex calculations
        return simplified_portfolio
      rescue => e
        Rails.logger.error "Error in calculate_detailed_portfolio: #{e.message}"
        return empty_portfolio
      end
    end
    
    def calculate_moic(investments = nil)
      investments ||= @user.equity_investments.successful
      total_invested = investments.sum(&:amount)
      current_value = investments.sum { |inv| inv.current_value || inv.amount }
      
      return 0 if total_invested.zero?
      (current_value / total_invested).round(4)
    end
    
    def calculate_irr(investments = nil)
      investments ||= @user.equity_investments.successful
      return 0 if investments.empty?
      
      total_invested = investments.sum(&:amount)
      total_current = investments.sum { |inv| inv.current_value || inv.amount }
      
      # FIXED: Calculate average age in Ruby to avoid SQL issues
      average_years = calculate_average_investment_age_ruby(investments)
      
      return 0 if average_years.zero? || total_invested.zero?
      
      cagr = (total_current / total_invested) ** (1 / average_years) - 1
      (cagr * 100).round(2)
    end
    
    private
    
    def calculate_average_investment_age_ruby(investments)
      return 0 if investments.empty?
      
      total_age_in_years = investments.sum do |inv|
        (Time.current - inv.created_at) / 1.year.seconds
      end
      
      total_age_in_years / investments.size
    end
    
    def empty_portfolio
      {
        summary: {
          total_invested: 0,
          current_value: 0,
          total_returns: 0,
          roi: 0,
          moic: 0,
          irr: 0,
          invested_campaigns: 0,
          active_investments: 0,
          average_investment_age: 0
        },
        by_campaign: [],
        performance_metrics: {},
        risk_analysis: {},
        cash_flow: [],
        projections: {}
      }
    end
    
    def simplified_portfolio
      investments = @user.equity_investments.successful.includes(:campaign)
      total_invested = investments.sum(&:amount)
      current_value = investments.sum { |inv| inv.current_value || inv.amount }
      total_returns = current_value - total_invested
      roi = total_invested.zero? ? 0 : (total_returns / total_invested * 100).round(2)
      
      {
        summary: {
          total_invested: total_invested,
          current_value: current_value,
          total_returns: total_returns,
          roi: roi,
          moic: calculate_moic(investments),
          irr: 0, # Skip IRR calculation
          invested_campaigns: investments.map(&:campaign_id).uniq.count,
          active_investments: investments.count,
          average_investment_age: 0,
          currency: @user.currency,
          currency_symbol: @user.currency_symbol
        },
        by_campaign: calculate_by_campaign_simplified(investments),
        performance_metrics: { time_weighted_return: 0 },
        risk_analysis: { risk_category: 'Medium' },
        cash_flow: [],
        projections: []
      }
    end
    
    def calculate_summary(investments)
      total_invested = investments.sum(&:amount)
      current_value = investments.sum { |inv| inv.current_value || inv.amount }
      total_returns = current_value - total_invested
      roi = total_invested.zero? ? 0 : (total_returns / total_invested * 100).round(2)
      moic = calculate_moic(investments)
      irr = calculate_irr(investments)
      
      {
        total_invested: total_invested,
        current_value: current_value,
        total_returns: total_returns,
        roi: roi,
        moic: moic,
        irr: irr,
        invested_campaigns: investments.map(&:campaign_id).uniq.count,
        active_investments: investments.count,
        currency: @user.currency,
        currency_symbol: @user.currency_symbol
      }
    end
    
    def calculate_by_campaign(investments)
      investments.group_by(&:campaign).map do |campaign, camp_investments|
        invested = camp_investments.sum(&:amount)
        current = camp_investments.sum { |inv| inv.current_value || inv.amount }
        returns = current - invested
        roi = invested.zero? ? 0 : (returns / invested * 100).round(2)
        
        {
          campaign_id: campaign.id,
          campaign_name: campaign.title,
          company_name: campaign.company_name,
          invested: invested,
          current_value: current,
          returns: returns,
          roi: roi,
          ownership_percentage: camp_investments.sum(&:percentage).round(4),
          investment_count: camp_investments.count,
          first_investment_date: camp_investments.min_by(&:created_at).created_at,
          latest_valuation: campaign.valuation,
          valuation_change: calculate_valuation_change(campaign, invested, camp_investments)
        }
      end.sort_by { |c| -c[:invested] }
    end
    
    def calculate_by_campaign_simplified(investments)
      investments.group_by(&:campaign).map do |campaign, camp_investments|
        invested = camp_investments.sum(&:amount)
        current = camp_investments.sum { |inv| inv.current_value || inv.amount }
        returns = current - invested
        roi = invested.zero? ? 0 : (returns / invested * 100).round(2)
        
        {
          campaign_id: campaign.id,
          campaign_name: campaign.title,
          company_name: campaign.company_name,
          invested: invested,
          current_value: current,
          returns: returns,
          roi: roi,
          ownership_percentage: camp_investments.sum(&:percentage).round(4),
          investment_count: camp_investments.count,
          first_investment_date: camp_investments.min_by(&:created_at).created_at,
          latest_valuation: campaign.valuation,
          valuation_change: 0 # Skip complex calculation
        }
      end.sort_by { |c| -c[:invested] }
    end
    
    def calculate_performance_metrics(investments)
      # Time-weighted returns
      monthly_returns = calculate_monthly_returns(investments)
      
      {
        time_weighted_return: calculate_time_weighted_return(monthly_returns),
        best_performing: best_performing_campaign(investments),
        worst_performing: worst_performing_campaign(investments),
        monthly_returns: monthly_returns,
        annualized_volatility: calculate_volatility(monthly_returns)
      }
    end
    
    def calculate_risk_analysis(investments)
      concentration = calculate_concentration(investments)
      sector_risk = calculate_sector_risk(investments)
      liquidity_risk = calculate_liquidity_risk(investments)
      
      {
        concentration_risk: concentration,
        sector_diversification: sector_risk,
        liquidity_risk: liquidity_risk,
        overall_risk_score: (concentration + sector_risk + liquidity_risk) / 3.0,
        risk_category: determine_risk_category(concentration, sector_risk, liquidity_risk)
      }
    end
    
    def calculate_cash_flow(investments)
      # Group investments by month
      investments.group_by { |inv| inv.created_at.beginning_of_month }.map do |month, month_investments|
        {
          month: month.strftime('%b %Y'),
          invested: month_investments.sum(&:amount),
          current_value: month_investments.sum { |inv| inv.current_value || inv.amount },
          returns: month_investments.sum { |inv| (inv.current_value || inv.amount) - inv.amount }
        }
      end.sort_by { |cf| cf[:month] }
    end
    
    def calculate_projections(investments)
      # Simple projections based on current IRR
      irr = calculate_irr(investments)
      total_invested = investments.sum(&:amount)
      
      (1..5).map do |years|
        future_value = total_invested * (1 + (irr / 100.0)) ** years
        {
          years: years,
          projected_value: future_value.round(2),
          projected_returns: (future_value - total_invested).round(2),
          annual_growth: irr
        }
      end
    end
    
    def calculate_valuation_change(campaign, invested, camp_investments)
      return 0 if invested.zero?
      
      # Calculate average investment date in Ruby to avoid SQL timestamp averaging
      average_investment_date = calculate_average_date_ruby(camp_investments)
      return 0 unless average_investment_date
      
      # This is a simplified calculation
      # In reality, you'd track valuation history
      current_valuation = campaign.valuation
      # Assuming initial valuation was when first investment was made
      initial_valuation = campaign.valuation * 0.8 # Simplified
      
      valuation_change = current_valuation - initial_valuation
      (valuation_change / initial_valuation * 100).round(2)
    end
    
    def calculate_average_date_ruby(investments)
      return nil if investments.empty?
      
      # Calculate average timestamp in Ruby
      total_seconds = investments.sum { |inv| inv.created_at.to_f }
      Time.at(total_seconds / investments.size)
    end
    
    def calculate_monthly_returns(investments)
      # Group by month and calculate returns
      monthly_data = investments.group_by { |inv| inv.created_at.beginning_of_month }
      
      monthly_data.keys.sort.map do |month|
        month_investments = monthly_data[month]
        invested = month_investments.sum(&:amount)
        current = month_investments.sum { |inv| inv.current_value || inv.amount }
        
        {
          month: month.strftime('%b %Y'),
          invested: invested,
          current_value: current,
          return_percentage: invested.zero? ? 0 : ((current - invested) / invested * 100).round(2)
        }
      end
    end
    
    def calculate_time_weighted_return(monthly_returns)
      return 0 if monthly_returns.empty?
      
      # Simplified calculation
      product = 1.0
      monthly_returns.each do |mr|
        product *= (1 + mr[:return_percentage] / 100.0)
      end
      
      ((product ** (12.0 / monthly_returns.size)) - 1) * 100
    end
    
    def best_performing_campaign(investments)
      return nil if investments.empty?
      
      investments.group_by(&:campaign).max_by do |_, invs|
        invested = invs.sum(&:amount)
        current = invs.sum { |inv| inv.current_value || inv.amount }
        invested.zero? ? 0 : (current - invested) / invested
      end.first
    end
    
    def worst_performing_campaign(investments)
      return nil if investments.empty?
      
      investments.group_by(&:campaign).min_by do |_, invs|
        invested = invs.sum(&:amount)
        current = invs.sum { |inv| inv.current_value || inv.amount }
        invested.zero? ? 0 : (current - invested) / invested
      end.first
    end
    
    def calculate_volatility(monthly_returns)
      return 0 if monthly_returns.size < 2
      
      returns = monthly_returns.map { |mr| mr[:return_percentage] }
      mean = returns.sum / returns.size
      variance = returns.sum { |r| (r - mean) ** 2 } / (returns.size - 1)
      Math.sqrt(variance).round(2)
    end
    
    def calculate_concentration(investments)
      return 0 if investments.empty?
      
      total_invested = investments.sum(&:amount)
      max_campaign_investment = investments.group_by(&:campaign).values.map do |invs|
        invs.sum(&:amount)
      end.max
      
      (max_campaign_investment / total_invested.to_f).round(4)
    end
    
    def calculate_sector_risk(investments)
      # Simplified - in reality, you'd have sector classification
      unique_campaigns = investments.map(&:campaign_id).uniq.count
      total_investments = investments.count
      
      (unique_campaigns.to_f / total_investments).round(4)
    end
    
    def calculate_liquidity_risk(investments)
      # Simplified - investments in live campaigns are less liquid
      live_campaigns = investments.select { |inv| inv.campaign.live? }.count
      total = investments.count
      
      (live_campaigns.to_f / total).round(4)
    end
    
    def determine_risk_category(concentration, sector_risk, liquidity_risk)
      average_risk = (concentration + (1 - sector_risk) + liquidity_risk) / 3.0
      
      case average_risk
      when 0..0.3 then 'low'
      when 0.3..0.6 then 'medium'
      else 'high'
      end
    end
  end
end