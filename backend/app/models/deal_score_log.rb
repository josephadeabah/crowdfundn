# app/models/deal_score_log.rb
class DealScoreLog < ApplicationRecord
  belongs_to :campaign

  # Analysis types
  ANALYSIS_TYPES = %w[initial weekly monthly manual].freeze
  RISK_CATEGORIES = %w[low medium high very_high].freeze
  SENTIMENT_TYPES = %w[positive neutral negative].freeze
  TEAM_ASSESSMENTS = %w[strong adequate weak].freeze
  MARKET_OPPORTUNITIES = %w[large medium small].freeze
  FUNDING_POTENTIALS = %w[high medium low].freeze
  TIMING_ASSESSMENTS = %w[excellent good average poor].freeze
  COMPETITIVE_ADVANTAGES = %w[strong moderate weak].freeze

  validates :prompt, :response, :analysis_type, presence: true
  validates :analysis_type, inclusion: { in: ANALYSIS_TYPES }
  validates :risk_category, inclusion: { in: RISK_CATEGORIES }, allow_nil: true
  validates :sentiment_analysis, inclusion: { in: SENTIMENT_TYPES }, allow_nil: true
  validates :team_assessment, inclusion: { in: TEAM_ASSESSMENTS }, allow_nil: true
  validates :market_opportunity, inclusion: { in: MARKET_OPPORTUNITIES }, allow_nil: true
  validates :funding_potential, inclusion: { in: FUNDING_POTENTIALS }, allow_nil: true
  validates :timing_assessment, inclusion: { in: TIMING_ASSESSMENTS }, allow_nil: true
  validates :competitive_advantage, inclusion: { in: COMPETITIVE_ADVANTAGES }, allow_nil: true
  validates :risk_score, :deal_score, numericality: { 
    greater_than_or_equal_to: 0, 
    less_than_or_equal_to: 100 
  }, allow_nil: true

  # Store additional analysis data
  store_accessor :metadata, 
    :upside_potential, 
    :downside_risks,
    :sentiment_analysis,
    :team_assessment,
    :market_opportunity,
    :investment_thesis,
    :community_engagement_metrics,
    :team_strength_metrics,
    :financial_metrics,
    :funding_potential,
    :timing_assessment,
    :competitive_advantage,
    :exit_potential,
    :scalability_assessment,
    :traction_metrics,
    :product_market_fit,
    :technology_assessment,
    :regulatory_risks,
    :market_trends,
    :investor_alignment,
    :social_impact,
    :sustainability_score

  before_validation :set_analyzed_at
  after_create :update_campaign_scores

  scope :recent, -> { order(analyzed_at: :desc) }
  scope :by_analysis_type, ->(type) { where(analysis_type: type) }
  scope :weekly_analysis, -> { where(analysis_type: 'weekly') }
  scope :monthly_analysis, -> { where(analysis_type: 'monthly') }
  scope :with_high_potential, -> { where("deal_score >= ?", 80) }
  scope :with_low_risk, -> { where("risk_score <= ?", 30) }

  def self.latest_for_campaign(campaign_id)
    where(campaign_id: campaign_id).recent.first
  end

  def self.campaign_performance_trend(campaign_id, limit = 10)
    where(campaign_id: campaign_id)
      .order(analyzed_at: :asc)
      .limit(limit)
      .pluck(:analyzed_at, :deal_score, :risk_score)
  end

  def comprehensive_risk_assessment
    {
      score: risk_score,
      category: risk_category,
      key_risks: downside_risks || [],
      upside_potential: upside_potential || [],
      sentiment: sentiment_analysis,
      team_strength: team_assessment,
      market_opportunity: market_opportunity,
      regulatory_risks: regulatory_risks || [],
      timing_risk: timing_assessment,
      timestamp: analyzed_at
    }
  end

  def deal_assessment
    {
      score: deal_score,
      strengths: strengths || [],
      recommendations: recommendations || [],
      investment_thesis: investment_thesis,
      market_opportunity: market_opportunity,
      funding_potential: funding_potential,
      competitive_advantage: competitive_advantage,
      exit_potential: exit_potential,
      scalability: scalability_assessment,
      product_market_fit: product_market_fit,
      timestamp: analyzed_at
    }
  end

  def sentiment_analysis_data
    {
      overall_sentiment: sentiment_analysis,
      community_engagement: community_engagement_metrics || {},
      key_themes: extract_key_themes
    }
  end

  def team_analysis
    {
      assessment: team_assessment,
      strength_metrics: team_strength_metrics || {},
      key_qualifications: extract_team_qualifications,
      experience_level: calculate_experience_level
    }
  end

  def market_analysis
    {
      opportunity_size: market_opportunity,
      competitive_landscape: competitive_analysis_metrics || {},
      growth_potential: growth_metrics || {},
      market_trends: market_trends || [],
      timing_assessment: timing_assessment
    }
  end

  def financial_analysis
    {
      funding_potential: funding_potential,
      valuation_metrics: financial_metrics || {},
      traction: traction_metrics || {},
      revenue_potential: calculate_revenue_potential,
      unit_economics: extract_unit_economics
    }
  end

  def technology_analysis
    {
      assessment: technology_assessment,
      innovation_level: calculate_innovation_level,
      scalability: scalability_assessment,
      ip_strength: extract_ip_strength
    }
  end

  def impact_analysis
    {
      social_impact: social_impact,
      sustainability_score: sustainability_score,
      investor_alignment: investor_alignment,
      esg_factors: extract_esg_factors
    }
  end

  def update_campaign_scores
    return unless risk_score && deal_score

    # Only update columns that actually exist in the campaigns table
    campaign.update(
      ai_deal_score: deal_score,
      ai_risk_score: risk_score,
      ai_risk_category: risk_category,
      ai_analysis_updated_at: analyzed_at,
      ai_sentiment: sentiment_analysis,
      ai_team_assessment: team_assessment,
      ai_market_opportunity: market_opportunity
      # All other metrics are stored in metadata only
    )
  end

  def to_frontend_format
    {
      id: id,
      analysis_type: analysis_type,
      deal_score: deal_score,
      risk_score: risk_score,
      risk_category: risk_category,
      analyzed_at: analyzed_at,
      key_risks: downside_risks || [],
      upside_potential: upside_potential || [],
      strengths: strengths || [],
      recommendations: recommendations || [],
      sentiment_analysis: sentiment_analysis,
      team_assessment: team_assessment,
      market_opportunity: market_opportunity,
      investment_thesis: investment_thesis,
      # New comprehensive metrics (all from metadata)
      funding_potential: funding_potential,
      timing_assessment: timing_assessment,
      competitive_advantage: competitive_advantage,
      exit_potential: exit_potential,
      scalability_assessment: scalability_assessment,
      traction_metrics: traction_metrics,
      product_market_fit: product_market_fit,
      technology_assessment: technology_assessment,
      regulatory_risks: regulatory_risks,
      market_trends: market_trends,
      investor_alignment: investor_alignment,
      social_impact: social_impact,
      sustainability_score: sustainability_score,
      comprehensive_analysis: {
        risk_assessment: comprehensive_risk_assessment,
        deal_assessment: deal_assessment,
        sentiment_analysis: sentiment_analysis_data,
        team_analysis: team_analysis,
        market_analysis: market_analysis,
        financial_analysis: financial_analysis,
        technology_analysis: technology_analysis,
        impact_analysis: impact_analysis
      }
    }
  end

  private

  def set_analyzed_at
    self.analyzed_at ||= Time.current
  end

  def extract_key_themes
    themes = []
    themes += strengths.map { |s| "strength: #{s}" } if strengths
    themes += downside_risks.map { |r| "risk: #{r}" } if downside_risks
    themes += upside_potential.map { |u| "opportunity: #{u}" } if upside_potential
    themes
  end

  def extract_team_qualifications
    return [] unless team_strength_metrics
    
    qualifications = []
    qualifications << "industry_experience" if team_strength_metrics["industry_experience"]
    qualifications << "technical_expertise" if team_strength_metrics["technical_expertise"]
    qualifications << "business_development" if team_strength_metrics["business_development"]
    qualifications << "leadership_experience" if team_strength_metrics["leadership_experience"]
    qualifications
  end

  def calculate_experience_level
    return "unknown" unless team_strength_metrics
    
    experience_score = 0
    experience_score += 25 if team_strength_metrics["industry_experience"]
    experience_score += 25 if team_strength_metrics["technical_experience"]
    experience_score += 25 if team_strength_metrics["business_development"]
    experience_score += 25 if team_strength_metrics["leadership_experience"]
    
    case experience_score
    when 80..100 then "expert"
    when 60..79 then "experienced"
    when 40..59 then "moderate"
    else "limited"
    end
  end

  def calculate_revenue_potential
    return "unknown" unless financial_metrics
    
    # Simple revenue potential calculation based on available metrics
    potential_score = 0
    potential_score += 30 if financial_metrics["revenue_growth"]
    potential_score += 30 if financial_metrics["profit_margins"]
    potential_score += 40 if financial_metrics["market_share_potential"]
    
    case potential_score
    when 80..100 then "high"
    when 60..79 then "medium"
    when 40..59 then "low"
    else "unknown"
    end
  end

  def extract_unit_economics
    return {} unless financial_metrics
    
    {
      cac_ratio: financial_metrics["cac_ratio"],
      ltv_cac_ratio: financial_metrics["ltv_cac_ratio"],
      gross_margin: financial_metrics["gross_margin"],
      payback_period: financial_metrics["payback_period"]
    }.compact
  end

  def calculate_innovation_level
    return "unknown" unless technology_assessment
    
    case technology_assessment.to_s.downcase
    when /breakthrough|revolutionary/ then "breakthrough"
    when /innovative|advanced/ then "innovative"
    when /standard|conventional/ then "standard"
    when /outdated|legacy/ then "outdated"
    else "unknown"
    end
  end

  def extract_ip_strength
    return "unknown" unless technology_assessment
    
    # Simple IP strength assessment
    case technology_assessment.to_s.downcase
    when /patented|exclusive/ then "strong"
    when /proprietary|unique/ then "moderate"
    when /open_source|standard/ then "weak"
    else "unknown"
    end
  end

  def extract_esg_factors
    factors = []
    factors << "environmental" if sustainability_score.to_i >= 70
    factors << "social_impact" if social_impact.present?
    factors << "governance" if team_assessment == "strong"
    factors
  end
end