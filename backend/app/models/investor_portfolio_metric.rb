# app/models/investor_portfolio_metric.rb
class InvestorPortfolioMetric < ApplicationRecord
  belongs_to :user
  belongs_to :campaign, optional: true
  belongs_to :equity_investment, optional: true
  
  validates :calculation_date, presence: true
  validates :period, inclusion: { in: %w[daily weekly monthly quarterly], allow_nil: true }
  
  before_save :calculate_metrics, if: -> { total_invested.present? && current_value.present? }
  before_save :calculate_risk_metrics, if: -> { breakdown.present? && breakdown.any? }
  
  scope :for_user, ->(user_id) { where(user_id: user_id) }
  scope :for_campaign, ->(campaign_id) { where(campaign_id: campaign_id) }
  scope :overall, -> { where(campaign_id: nil) }
  scope :recent, ->(limit = 30) { order(calculation_date: :desc).limit(limit) }
  scope :since, ->(date) { where('calculation_date >= ?', date) }
  
  def self.calculate_for_user(user_id, date = Date.current)
    user = User.find(user_id)
    investments = user.equity_investments.successful.includes(:campaign)
    
    return nil if investments.empty?
    
    total_invested = investments.sum(:amount)
    current_value = investments.sum { |inv| inv.current_value || inv.amount }
    total_returns = current_value - total_invested
    roi = total_invested.zero? ? 0 : (total_returns / total_invested * 100).round(2)
    moic = total_invested.zero? ? 0 : (current_value / total_invested).round(2)
    
    # Calculate IRR (simplified annualized return)
    irr = calculate_simple_irr(investments, current_value)
    
    # Calculate breakdown by campaign
    breakdown = investments.group_by(&:campaign).transform_values do |campaign_investments|
      camp_invested = campaign_investments.sum(&:amount)
      camp_current = campaign_investments.sum { |inv| inv.current_value || inv.amount }
      {
        invested: camp_invested,
        current_value: camp_current,
        returns: camp_current - camp_invested,
        roi: camp_invested.zero? ? 0 : ((camp_current - camp_invested) / camp_invested * 100).round(2),
        percentage_of_portfolio: total_invested.zero? ? 0 : (camp_invested / total_invested * 100).round(2)
      }
    end
    
    # Calculate concentration
    concentration = calculate_concentration(breakdown)
    
    create!(
      user_id: user_id,
      calculation_date: date,
      period: 'daily',
      total_invested: total_invested,
      current_value: current_value,
      total_returns: total_returns,
      roi: roi,
      moic: moic,
      irr: irr,
      portfolio_concentration: concentration,
      risk_category: determine_risk_category(concentration, irr),
      breakdown: breakdown,
      trend_data: generate_trend_data(user_id, date)
    )
  end
  
  def as_json(options = {})
    super(options).merge(
      formatted_metrics: {
        total_invested: format_currency(total_invested),
        current_value: format_currency(current_value),
        total_returns: format_currency(total_returns),
        roi: "#{roi.round(2)}%",
        moic: "#{moic.round(2)}x",
        irr: "#{irr.round(2)}%",
        portfolio_concentration: "#{(portfolio_concentration * 100).round(1)}%"
      },
      top_performers: top_performers(3),
      underperformers: underperformers(3)
    )
  end
  
  def update_with_valuation_change(campaign_id, new_valuation)
    return unless campaign_id.present?
    
    # Recalculate metrics for this campaign
    campaign_investments = user.equity_investments.successful.where(campaign_id: campaign_id)
    
    campaign_investments.each do |investment|
      investment.update_current_value
      investment.save!
    end
    
    # Recalculate overall portfolio metrics
    recalculate_metrics
  end
  
  private
  
  def calculate_metrics
    self.total_returns = current_value - total_invested
    self.roi = total_invested.zero? ? 0 : (total_returns / total_invested * 100).round(2)
    self.moic = total_invested.zero? ? 0 : (current_value / total_invested).round(2)
  end
  
  def calculate_risk_metrics
    self.portfolio_concentration = calculate_concentration(breakdown)
    self.risk_category = determine_risk_category(portfolio_concentration, irr)
    
    # Calculate volatility if we have trend data
    if trend_data.present? && trend_data.size > 5
      returns = trend_data.values.map { |d| d[:roi].to_f }
      self.volatility = calculate_volatility(returns)
      self.sharpe_ratio = calculate_sharpe_ratio(irr, volatility)
    end
  end
  
  def format_currency(amount)
    "#{user.currency_symbol}#{amount.round(2)}"
  end
  
  def top_performers(limit = 3)
    return [] unless breakdown.present?
    
    breakdown.sort_by { |_, metrics| -metrics[:roi].to_f }
             .first(limit)
             .map do |campaign, metrics|
      {
        campaign_id: campaign.id,
        campaign_name: campaign.title,
        roi: metrics[:roi],
        invested: metrics[:invested],
        current_value: metrics[:current_value]
      }
    end
  end
  
  def underperformers(limit = 3)
    return [] unless breakdown.present?
    
    breakdown.select { |_, metrics| metrics[:roi].to_f < 0 }
             .sort_by { |_, metrics| metrics[:roi].to_f }
             .first(limit)
             .map do |campaign, metrics|
      {
        campaign_id: campaign.id,
        campaign_name: campaign.title,
        roi: metrics[:roi],
        invested: metrics[:invested],
        current_value: metrics[:current_value]
      }
    end
  end
  
  def recalculate_metrics
    self.class.calculate_for_user(user_id, calculation_date)
    self.reload
  end
  
  class << self
    private
    
    def calculate_simple_irr(investments, current_value)
      return 0 if investments.empty?
      
      total_invested = investments.sum(&:amount)
      average_age_years = investments.average("EXTRACT(YEAR FROM AGE(NOW(), created_at))").to_f
      
      return 0 if average_age_years.zero? || total_invested.zero?
      
      total_return = current_value - total_invested
      annualized_return = (total_return / total_invested) / average_age_years
      
      (annualized_return * 100).round(2)
    end
    
    def calculate_concentration(breakdown)
      return 0 unless breakdown.present? && breakdown.any?
      
      percentages = breakdown.values.map { |v| v[:percentage_of_portfolio].to_f }
      # Herfindahl-Hirschman Index (HHI)
      hhi = percentages.sum { |p| p * p }
      hhi / 10000.0 # Normalize to 0-1
    end
    
    def determine_risk_category(concentration, irr)
      if concentration > 0.5 || irr < -10
        'high'
      elsif concentration > 0.3 || irr < 0
        'medium'
      else
        'low'
      end
    end
    
    def generate_trend_data(user_id, current_date)
      metrics = where(user_id: user_id)
                .where('calculation_date >= ?', current_date - 90.days)
                .order(calculation_date: :asc)
                .pluck(:calculation_date, :current_value, :total_invested)
      
      metrics.map do |date, current, invested|
        roi = invested.zero? ? 0 : ((current - invested) / invested * 100).round(2)
        [date.to_s, { current_value: current, roi: roi }]
      end.to_h
    end
    
    def calculate_volatility(returns)
      return 0 if returns.size < 2
      
      mean = returns.sum / returns.size
      variance = returns.sum { |r| (r - mean) ** 2 } / (returns.size - 1)
      Math.sqrt(variance).round(4)
    end
    
    def calculate_sharpe_ratio(return_rate, volatility, risk_free_rate = 0.02)
      return 0 if volatility.zero?
      ((return_rate / 100.0) - risk_free_rate) / volatility
    end
  end
end