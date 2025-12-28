# app/models/financial_statement.rb
class FinancialStatement < ApplicationRecord
  belongs_to :campaign
  belongs_to :published_by, class_name: 'User', optional: true
  
  has_many :kpi_values, dependent: :nullify
  has_one_attached :source_file
  
  validates :period_type, :period_start, :period_end, presence: true
  validates :period_type, inclusion: { in: %w[monthly quarterly annual] }
  validates :status, inclusion: { in: %w[draft published archived] }
  
  validate :validate_period_dates
  validate :validate_consistency
  
  before_validation :calculate_derived_metrics, if: -> { revenue_changed? || expenses_changed? || assets_changed? || liabilities_changed? }
  before_save :set_published_at, if: -> { status_changed?(to: 'published') && published_at.blank? }
  after_save :update_campaign_valuation_metrics, if: -> { saved_change_to_status?(to: 'published') }
  
  scope :published, -> { where(status: 'published') }
  scope :draft, -> { where(status: 'draft') }
  scope :archived, -> { where(status: 'archived') }
  scope :recent_first, -> { order(period_end: :desc) }
  scope :for_period, ->(start_date, end_date) { where(period_start: start_date, period_end: end_date) }
  
  PERIOD_TYPES = {
    monthly: 1.month,
    quarterly: 3.months,
    annual: 1.year
  }.freeze
  
  def period_duration
    (period_end - period_start).to_i + 1
  end
  
  def gross_margin
    return 0 if revenue.zero?
    (gross_profit / revenue * 100).round(2)
  end
  
  def net_margin
    return 0 if revenue.zero?
    (net_income / revenue * 100).round(2)
  end
  
  def current_ratio
    return 0 if liabilities.zero?
    (assets / liabilities).round(2)
  end
  
  def debt_to_equity
    return 0 if equity.zero?
    (liabilities / equity).round(2)
  end
  
  def as_json(options = {})
    super(options).merge(
      gross_margin: gross_margin,
      net_margin: net_margin,
      current_ratio: current_ratio,
      debt_to_equity: debt_to_equity,
      period_duration: period_duration,
      source_file_url: source_file.attached? ? source_file_url : nil,
      source_file_name: source_file.attached? ? source_file.filename : nil
    )
  end
  
  def source_file_url
    if source_file.attached?
      if Rails.env.production?
        "#{Rails.application.credentials.dig(:digitalocean, :endpoint)}/#{Rails.application.credentials.dig(:digitalocean, :bucket)}/#{source_file.blob.key}"
      else
        Rails.application.routes.url_helpers.rails_blob_url(source_file)
      end
    end
  end
  
  private
  
  def validate_period_dates
    return if period_start.blank? || period_end.blank?
    
    if period_end <= period_start
      errors.add(:period_end, 'must be after period start')
    end
    
    expected_duration = PERIOD_TYPES[period_type.to_sym]&.days || 30.days
    actual_duration = period_duration.days
    
    unless (actual_duration - expected_duration).abs <= 5.days
      errors.add(:period_end, "doesn't match #{period_type} period duration")
    end
  end
  
  def validate_consistency
    # Basic accounting equation: Assets = Liabilities + Equity
    if assets.present? && liabilities.present? && equity.present?
      calculated_equity = assets - liabilities
      if (calculated_equity - equity).abs > 0.01
        errors.add(:equity, "doesn't match assets minus liabilities")
      end
    end
    
    # Profit calculations
    if revenue.present? && expenses.present? && gross_profit.present?
      calculated_gross = revenue - expenses
      if (calculated_gross - gross_profit).abs > 0.01
        errors.add(:gross_profit, "doesn't match revenue minus expenses")
      end
    end
  end
  
  def calculate_derived_metrics
    self.gross_profit = revenue - expenses if revenue.present? && expenses.present?
    self.equity = assets - liabilities if assets.present? && liabilities.present?
    
    # Calculate burn rate and runway if applicable
    if expenses.present? && cash_flow.present? && cash_flow.negative?
      self.burn_rate = expenses.abs / period_duration.to_f * 30 # Monthly burn rate
      self.runway_months = (assets / burn_rate).round(2) if assets.present? && burn_rate.positive?
    end
  end
  
  def set_published_at
    self.published_at = Time.current
  end
  
  def update_campaign_valuation_metrics
    # This can trigger AI valuation updates or other processes
    UpdateCampaignValuationJob.perform_later(campaign_id) if net_income.present?
  end
end