# app/models/financial_statement.rb - FINAL VERSION
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
  
  before_validation :calculate_missing_metrics
  before_save :set_published_at, if: -> { status_changed?(to: 'published') && published_at.blank? }
  after_save :update_campaign_valuation_metrics, if: -> { saved_change_to_status?(to: 'published') }
  
  scope :published, -> { where(status: 'published') }
  scope :draft, -> { where(status: 'draft') }
  scope :archived, -> { where(status: 'archived') }
  scope :recent_first, -> { order(period_end: :desc) }
  scope :for_period, ->(start_date, end_date) { where(period_start: start_date, period_end: end_date) }
  
  PERIOD_TYPES = {
    monthly: 30.days,
    quarterly: 90.days,
    annual: 365.days
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
    return 0 if revenue.zero? || net_income.zero?
    (net_income / revenue * 100).round(2)
  end
  
  def current_ratio
    return 0 if liabilities.blank? || liabilities.zero?
    (assets / liabilities).round(2)
  end
  
  def debt_to_equity
    return 0 if equity.blank? || equity.zero?
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
  
  # Helper method to get calculated equity (ignoring user-provided 0)
  def calculated_equity
    return assets - liabilities if assets.present? && liabilities.present?
    0
  end
  
  # Helper method to get calculated net income
  def calculated_net_income
    revenue - expenses
  end
  
  def as_json(options = {})
    json = super(options).merge(
      gross_margin: gross_margin,
      net_margin: net_margin,
      current_ratio: current_ratio,
      debt_to_equity: debt_to_equity,
      period_duration: period_duration,
      gross_profit: gross_profit,
      net_income: net_income,
      equity: equity,
      calculated_net_income: calculated_net_income,
      calculated_equity: calculated_equity,
      accounting_discrepancy: accounting_discrepancy?,
      source_file_url: source_file.attached? ? source_file_url : nil,
      source_file_name: source_file.attached? ? source_file.filename : nil
    )
    
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
  
  def accounting_discrepancy?
    (revenue - expenses - net_income).abs > 0.01 ||
    (assets.present? && liabilities.present? && equity.present? && (assets - liabilities - equity).abs > 0.01)
  end
  
  private
  
  def validate_period_dates
    return if period_start.blank? || period_end.blank?
    
    start_date = period_start.to_date
    end_date = period_end.to_date
    
    if end_date <= start_date
      errors.add(:period_end, 'must be after period start')
      return
    end
    
    duration_days = (end_date - start_date).to_i + 1
    
    expected_duration_days = case period_type
    when 'monthly' then 30
    when 'quarterly' then 90
    when 'annual' then 365
    else 0
    end
    
    variance_days = case period_type
    when 'monthly' then 5
    when 'quarterly' then 7
    when 'annual' then 10
    else 5
    end
    
    unless (duration_days - expected_duration_days).abs <= variance_days
      errors.add(:period_end, "doesn't match #{period_type} period duration. Expected ~#{expected_duration_days} days, got #{duration_days} days")
    end
  end
  
  def calculate_missing_metrics
    # Always calculate gross profit
    self.gross_profit = revenue - expenses if revenue.present? && expenses.present?
    
    # Only set net_income if it's truly blank (not 0)
    if revenue.present? && expenses.present? && self[:net_income].blank?
      self.net_income = revenue - expenses
    end
    
    # Only set equity if it's truly blank (not 0) and we have assets/liabilities
    if assets.present? && liabilities.present? && self[:equity].blank?
      self.equity = assets - liabilities
    end
    
    # Calculate burn rate
    if expenses.present? && period_duration > 0
      days_in_month = 30.0
      self.burn_rate = (expenses / period_duration.to_f * days_in_month).round(2)
      
      if assets.present? && burn_rate > 0
        self.runway_months = (assets / burn_rate).round(2)
      end
    end
  end
  
  def set_published_at
    self.published_at = Time.current
  end
  
  def update_campaign_valuation_metrics
    UpdateCampaignValuationJob.perform_later(campaign_id) if net_income.present?
  end
end