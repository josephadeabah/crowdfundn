# app/models/campaign_kpi.rb
class CampaignKpi < ApplicationRecord
  belongs_to :campaign
  has_many :kpi_values, dependent: :destroy
  
  validates :name, :slug, :kpi_type, presence: true
  validates :slug, uniqueness: { scope: :campaign_id }
  validates :kpi_type, inclusion: { in: %w[financial operational growth engagement] }
  
  before_validation :generate_slug, if: -> { slug.blank? && name.present? }
  
  scope :primary, -> { where(is_primary: true) }
  scope :public, -> { where(is_public: true) }
  scope :by_type, ->(type) { where(kpi_type: type) }
  scope :ordered, -> { order(display_order: :asc, created_at: :asc) }
  
  KPI_CATEGORIES = {
    financial: %w[revenue mrr arr gross_margin net_margin burn_rate runway cac ltv],
    operational: %w[customer_count active_users churn_rate nps csat],
    growth: %w[user_growth revenue_growth market_share penetration],
    engagement: %w[dau_mau session_duration feature_adoption]
  }.freeze
  
  def latest_value
    kpi_values.order(period_date: :desc).first
  end
  
  def trend(days: 30)
    kpi_values.where('period_date >= ?', days.days.ago)
              .order(period_date: :asc)
              .pluck(:period_date, :value)
              .to_h
  end
  
  def performance_vs_target
    latest = latest_value
    return nil unless latest && target_value.present?
    
    {
      current_value: latest.value,
      target_value: target_value,
      difference: latest.value - target_value,
      percentage: target_value.zero? ? 0 : ((latest.value - target_value) / target_value.abs * 100).round(2)
    }
  end
  
  def as_json(options = {})
    super(options).merge(
      latest_value: latest_value&.as_json,
      trend: trend,
      performance_vs_target: performance_vs_target
    )
  end
  
  private
  
  def generate_slug
    self.slug = name.parameterize.truncate(80, omission: '')
    
    counter = 1
    while CampaignKpi.where(campaign_id: campaign_id, slug: slug).exists? &&
          (new_record? || CampaignKpi.where.not(id: id).exists?(campaign_id: campaign_id, slug: slug))
      self.slug = "#{name.parameterize.truncate(70, omission: '')}-#{counter}"
      counter += 1
    end
  end
end