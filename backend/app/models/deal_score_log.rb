# app/models/deal_score_log.rb
class DealScoreLog < ApplicationRecord
  belongs_to :campaign

  # Analysis types
  ANALYSIS_TYPES = %w[initial weekly manual].freeze
  RISK_CATEGORIES = %w[low medium high very_high].freeze

  validates :prompt, :response, :analysis_type, presence: true
  validates :analysis_type, inclusion: { in: ANALYSIS_TYPES }
  validates :risk_category, inclusion: { in: RISK_CATEGORIES }, allow_nil: true
  validates :risk_score, :deal_score, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 100 
  }, allow_nil: true

  before_validation :set_analyzed_at

  scope :recent, -> { order(analyzed_at: :desc) }
  scope :by_analysis_type, ->(type) { where(analysis_type: type) }
  scope :weekly_analysis, -> { where(analysis_type: 'weekly') }

  def self.latest_for_campaign(campaign_id)
    where(campaign_id: campaign_id).recent.first
  end

  def risk_assessment
    {
      score: risk_score,
      category: risk_category,
      key_risks: key_risks || [],
      timestamp: analyzed_at
    }
  end

  def deal_assessment
    {
      score: deal_score,
      strengths: strengths || [],
      recommendations: recommendations || [],
      timestamp: analyzed_at
    }
  end

  def update_campaign_scores
    return unless risk_score && deal_score

    campaign.update(
      ai_deal_score: deal_score,
      ai_risk_score: risk_score,
      ai_risk_category: risk_category,
      ai_analysis_updated_at: analyzed_at
    )
  end

  private

  def set_analyzed_at
    self.analyzed_at ||= Time.current
  end
end