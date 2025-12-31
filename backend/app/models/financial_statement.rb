# app/models/financial_statement.rb
class FinancialStatement < ApplicationRecord
  belongs_to :campaign
  belongs_to :published_by, class_name: 'User', optional: true
  
  has_many :kpi_values, dependent: :nullify
  has_one_attached :source_file
  
  validates :period_type, :period_start, :period_end, :revenue, :expenses, presence: true
  validates :period_type, inclusion: { in: %w[monthly quarterly annual] }
  validates :status, inclusion: { in: %w[draft published archived] }
  validates :revenue, :expenses, numericality: { greater_than_or_equal_to: 0 }
  validates :assets, :liabilities, :equity, numericality: { greater_than_or_equal_to: 0, allow_nil: true }
  
  validate :validate_period_dates
  validate :validate_accounting_consistency, if: -> { assets.present? && liabilities.present? && equity.present? }
  
  before_validation :calculate_derived_metrics
  before_save :set_published_at, if: -> { status_changed?(to: 'published') && published_at.blank? }
  after_save :update_campaign_valuation_metrics, if: -> { saved_change_to_status?(to: 'published') }
  
  scope :published, -> { where(status: 'published') }
  scope :draft, -> { where(status: 'draft') }
  scope :archived, -> { where(status: 'archived') }
  scope :recent_first, -> { order(period_end: :desc) }
  scope :for_period, ->(start_date, end_date) { where(period_start: start_date, period_end: end_date) }
  
  PERIOD_TYPES = {
    monthly: 30.days,      # Average month length
    quarterly: 90.days,    # Average quarter length
    annual: 365.days       # Average year length
  }.freeze
  
  def period_duration
    return 0 if period_start.blank? || period_end.blank?
    (period_end.to_date - period_start.to_date).to_i + 1
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
  
  def gross_profit
    self[:gross_profit] || (revenue - expenses)
  end
  
  def net_income
    self[:net_income] || (revenue - expenses)
  end
  
  def equity
    if self[:equity].present?
      self[:equity]
    elsif assets.present? && liabilities.present?
      assets - liabilities
    else
      0
    end
  end
  
  def as_json(options = {})
    json = super(options).merge(
      gross_margin: gross_margin,
      net_margin: net_margin,
      current_ratio: current_ratio,
      debt_to_equity: debt_to_equity,
      period_duration: period_duration,
      calculated_gross_profit: revenue - expenses,
      calculated_equity: assets && liabilities ? assets - liabilities : nil,
      source_file_url: source_file.attached? ? source_file_url : nil,
      source_file_name: source_file.attached? ? source_file.filename : nil
    )
    
    # Include derived metrics if they're different from calculated
    if self[:gross_profit].present?
      json[:gross_profit] = self[:gross_profit]
    end
    
    if self[:net_income].present?
      json[:net_income] = self[:net_income]
    end
    
    if self[:equity].present?
      json[:equity] = self[:equity]
    end
    
    json
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
    
    # Ensure dates are properly parsed
    start_date = period_start.to_date
    end_date = period_end.to_date
    
    if end_date <= start_date
      errors.add(:period_end, 'must be after period start')
      return
    end
    
    # Calculate actual duration in days
    duration_days = (end_date - start_date).to_i + 1
    
    # Get expected duration based on period type
    expected_duration_days = case period_type
    when 'monthly'
      30  # Average month
    when 'quarterly'
      90  # Average quarter
    when 'annual'
      365 # Average year
    else
      0
    end
    
    # Calculate allowed variance (5 days for monthly, 7 for quarterly, 10 for annual)
    variance_days = case period_type
    when 'monthly'
      5
    when 'quarterly'
      7
    when 'annual'
      10
    else
      5
    end
    
    # Check if duration is within acceptable range
    unless (duration_days - expected_duration_days).abs <= variance_days
      errors.add(:period_end, "doesn't match #{period_type} period duration. Expected ~#{expected_duration_days} days, got #{duration_days} days")
    end
  end
  
  def validate_accounting_consistency
    # Check basic accounting equation: Assets = Liabilities + Equity
    if assets.present? && liabilities.present? && self[:equity].present?
      calculated_equity = assets - liabilities
      
      # Allow small rounding differences but warn if they're significant
      if (calculated_equity - self[:equity]).abs > 1.0
        errors.add(:equity, "significantly different from calculated value (assets - liabilities). Calculated: #{calculated_equity}, Provided: #{self[:equity]}. Consider updating equity to #{calculated_equity.round(2)}")
      end
    end
  end
  
  def calculate_derived_metrics
    # Calculate basic derived metrics if not provided
    if revenue.present? && expenses.present?
      # Gross profit is always revenue minus expenses
      self.gross_profit = revenue - expenses
      
      # Net income defaults to gross profit unless specifically overridden
      self.net_income = self[:net_income].presence || gross_profit
    end
    
    # Calculate equity if assets and liabilities are provided
    if assets.present? && liabilities.present?
      calculated_equity = assets - liabilities
      
      # Use provided equity if it's within reasonable range of calculated value
      if self[:equity].present?
        # Check if provided equity is significantly different
        if (self[:equity] - calculated_equity).abs > 1.0
          # Log the discrepancy but don't fail validation
          Rails.logger.warn "FinancialStatement #{id}: Provided equity (#{self[:equity]}) differs significantly from calculated (#{calculated_equity})"
        end
      else
        # No equity provided, use calculated value
        self.equity = calculated_equity
      end
    end
    
    # Calculate burn rate and runway if applicable
    if expenses.present? && period_duration > 0
      # Monthly burn rate (extrapolates expenses to monthly basis)
      days_in_month = 30.0
      self.burn_rate = (expenses / period_duration.to_f * days_in_month).round(2)
      
      # Runway in months if assets are available
      if assets.present? && burn_rate > 0
        self.runway_months = (assets / burn_rate).round(2)
      end
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