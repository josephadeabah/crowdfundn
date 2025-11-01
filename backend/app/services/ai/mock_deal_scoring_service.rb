# app/services/ai/mock_deal_scoring_service.rb
module AI
  class MockDealScoringService
    def initialize(campaign, analysis_type: 'manual')
      @campaign = campaign
      @analysis_type = analysis_type
    end

    def analyze
      start_time = Time.current
      
      begin
        # Generate mock analysis data
        analysis_data = generate_mock_analysis
        
        deal_score_log = create_deal_score_log(analysis_data, start_time)
        deal_score_log.update_campaign_scores
        
        { success: true, analysis: analysis_data, log: deal_score_log }
      rescue => e
        Rails.logger.error "Mock AI Deal Scoring failed for campaign #{@campaign.id}: #{e.message}"
        { success: false, error: e.message }
      end
    end

    def self.analyze_campaign(campaign, analysis_type: 'manual')
      new(campaign, analysis_type: analysis_type).analyze
    end

    private

    def generate_mock_analysis
      # Generate realistic mock scores based on campaign data
      base_score = calculate_base_score
      risk_score = calculate_risk_score(base_score)
      
      {
        "deal_score" => base_score,
        "risk_score" => risk_score,
        "risk_category" => determine_risk_category(risk_score),
        "key_risks" => generate_mock_risks,
        "strengths" => generate_mock_strengths,
        "recommendations" => generate_mock_recommendations,
        "analysis_summary" => "AI analysis completed successfully. This campaign shows strong potential with manageable risks."
      }
    end

    def calculate_base_score
      # Calculate score based on campaign metrics
      score = 65 # Base score
      
      # Adjust based on performance
      score += 15 if @campaign.performance_percentage > 50
      score += 20 if @campaign.performance_percentage > 75
      
      # Adjust based on time remaining
      if @campaign.remaining_days && @campaign.total_days
        time_ratio = @campaign.remaining_days.to_f / @campaign.total_days
        score += 10 if time_ratio > 0.5
        score -= 15 if time_ratio < 0.2
      end
      
      # Adjust based on donor engagement
      score += 8 if @campaign.total_donors.to_i > 10
      score += 12 if @campaign.total_donors.to_i > 50
      
      # Equity campaigns get different scoring
      if @campaign.is_a?(EquityCampaign)
        score += 5 # Equity campaigns often have higher potential
      end
      
      # Ensure score is within bounds
      [[score, 20].max, 95].min
    end

    def calculate_risk_score(base_score)
      # Risk is generally inverse of deal score
      base_risk = 100 - base_score
      
      # Adjust based on specific factors
      if @campaign.performance_percentage < 25
        base_risk += 20
      end
      
      if @campaign.remaining_days && @campaign.remaining_days < 7
        base_risk += 15
      end
      
      if @campaign.is_a?(EquityCampaign)
        base_risk += 10 # Equity campaigns are generally higher risk
      end
      
      [[base_risk, 10].max, 90].min
    end

    def determine_risk_category(risk_score)
      case risk_score
      when 0..25 then "low"
      when 26..45 then "medium"
      when 46..65 then "high"
      else "very_high"
      end
    end

    def generate_mock_risks
      risks = []
      
      risks << "Limited campaign traction with current backers" if @campaign.total_donors.to_i < 5
      risks << "Campaign timeline constraints" if @campaign.remaining_days && @campaign.remaining_days < 7
      risks << "High funding goal relative to typical campaigns" if @campaign.goal_amount.to_i > 50000
      risks << "Early stage venture with unproven model" if @campaign.is_a?(EquityCampaign)
      risks << "Market competition in this category"
      risks << "Execution risk in delivering on campaign promises"
      
      risks.empty? ? ["Standard market risks apply", "Execution dependency on team capability"] : risks
    end

    def generate_mock_strengths
      strengths = []
      
      strengths << "Strong category positioning" if @campaign.category.present?
      strengths << "Clear value proposition and vision" if @campaign.description.present?
      strengths << "Growing backer community engagement" if @campaign.total_donors.to_i > 20
      strengths << "On-track funding progress" if @campaign.performance_percentage > 50
      strengths << "Experienced fundraising team"
      strengths << "Innovative approach in target market"
      strengths << "Strong initial market validation"
      
      strengths.empty? ? ["Solid foundation for growth", "Clear market opportunity"] : strengths
    end

    def generate_mock_recommendations
      [
        "Continue monitoring campaign progress and adjust strategy as needed",
        "Consider additional marketing outreach to expand backer base",
        "Maintain transparent communication with current backers",
        "Evaluate competitive landscape regularly for positioning adjustments"
      ]
    end

    def create_deal_score_log(analysis_data, start_time)
      DealScoreLog.create!(
        campaign: @campaign,
        prompt: "MOCK_ANALYSIS_FOR_DEVELOPMENT",
        response: { mock: true, data: analysis_data }.to_json,
        analysis_data: analysis_data,
        deal_score: analysis_data["deal_score"],
        risk_score: analysis_data["risk_score"],
        risk_category: analysis_data["risk_category"],
        key_risks: analysis_data["key_risks"],
        strengths: analysis_data["strengths"],
        recommendations: analysis_data["recommendations"],
        analysis_type: @analysis_type,
        analyzed_at: start_time
      )
    end
  end
end