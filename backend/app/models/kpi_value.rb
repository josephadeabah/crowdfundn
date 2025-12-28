# app/models/kpi_value.rb
class KpiValue < ApplicationRecord
  belongs_to :campaign_kpi
  belongs_to :financial_statement, optional: true
  
  validates :period_date, :value, presence: true
  validates :period_date, uniqueness: { scope: :campaign_kpi_id }
  
  before_save :calculate_change_percentage, if: -> { previous_value.present? && previous_value != value }
  
  scope :recent, ->(limit = 12) { order(period_date: :desc).limit(limit) }
  scope :for_period, ->(start_date, end_date) { where(period_date: start_date..end_date) }
  
  def as_json(options = {})
    super(options).merge(
      kpi_name: campaign_kpi.name,
      kpi_unit: campaign_kpi.unit,
      formatted_value: format_value
    )
  end
  
  def format_value
    case campaign_kpi.unit
    when 'currency'
      "#{campaign_kpi.campaign.currency_symbol}#{value.round(2)}"
    when 'percentage'
      "#{value.round(2)}%"
    when 'number'
      value.to_i.to_s
    else
      value.round(2).to_s
    end
  end
  
  private
  
  def calculate_change_percentage
    return if previous_value.zero?
    self.change_percentage = ((value - previous_value) / previous_value.abs * 100).round(4)
  end
end