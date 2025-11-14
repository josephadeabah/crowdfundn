# app/services/ai/club_recommendation_service.rb
module AI
  class ClubRecommendationService
    def initialize(club, user = nil)
      @club = club
      @user = user
    end

    def recommend_campaigns(limit: 10)
      begin
        # Get campaigns that match the club's investment focus
        base_campaigns = Campaign.active
                                .where(is_public: true)
                                .where(appear_in_search_results: true)
                                .limit(50) # Get more for AI filtering
        
        # If club has specific investment focus, filter by category
        if @club.investment_focus.present?
          focus_categories = extract_categories_from_focus(@club.investment_focus)
          base_campaigns = base_campaigns.where(category: focus_categories) if focus_categories.any?
        end

        # Use AI scoring to rank and recommend campaigns
        scored_campaigns = base_campaigns.map do |campaign|
          score_campaign_for_club(campaign)
        end.compact.sort_by { |scored| -scored[:match_score] }

        recommendations = scored_campaigns.first(limit).map do |scored|
          {
            campaign: scored[:campaign],
            match_score: scored[:match_score],
            reasoning: scored[:reasoning],
            ai_analysis: scored[:ai_analysis]
          }
        end

        { success: true, recommendations: recommendations }
      rescue => e
        Rails.logger.error "Club recommendation error: #{e.message}"
        { success: false, error: e.message, recommendations: [] }
      end
    end

    def explain_recommendation(campaign)
      score_data = score_campaign_for_club(campaign)
      {
        campaign: campaign,
        match_score: score_data[:match_score],
        reasoning: score_data[:reasoning],
        club_focus: @club.investment_focus,
        mission_alignment: calculate_mission_alignment(campaign),
        ai_analysis: score_data[:ai_analysis]
      }
    end

    def get_club_risk_profile
      {
        risk_tolerance: assess_club_risk_tolerance,
        preferred_sectors: extract_preferred_sectors,
        investment_thesis: generate_investment_thesis
      }
    end

    private

    def score_campaign_for_club(campaign)
      # Get AI analysis if available
      ai_analysis = get_campaign_ai_analysis(campaign)
      
      # Calculate match score based on multiple factors
      match_score = calculate_match_score(campaign, ai_analysis)
      
      # Generate reasoning
      reasoning = generate_reasoning(campaign, ai_analysis, match_score)
      
      {
        campaign: campaign,
        match_score: match_score,
        reasoning: reasoning,
        ai_analysis: ai_analysis
      }
    end

    def calculate_match_score(campaign, ai_analysis)
      score = 50.0 # Base score
      
      # Factor 1: Category alignment with club focus (30% weight)
      if @club.investment_focus.present? && campaign.category.present?
        focus_match = calculate_category_match(campaign.category)
        score += focus_match * 0.3
      end
      
      # Factor 2: AI deal score (40% weight)
      if ai_analysis && ai_analysis[:deal_score]
        deal_score_factor = (ai_analysis[:deal_score] - 50) * 0.4
        score += deal_score_factor
      end
      
      # Factor 3: Risk alignment (20% weight)
      risk_alignment = calculate_risk_alignment(campaign, ai_analysis)
      score += risk_alignment * 0.2
      
      # Factor 4: Campaign performance (10% weight)
      performance_factor = [campaign.performance_percentage, 100].min * 0.1
      score += performance_factor
      
      score.clamp(0, 100).round(2)
    end

    def calculate_category_match(campaign_category)
      return 30 unless @club.investment_focus.present?
      
      focus_categories = extract_categories_from_focus(@club.investment_focus)
      
      if focus_categories.include?(campaign_category.downcase)
        30 # Full points for exact category match
      elsif category_related?(campaign_category, focus_categories)
        20 # Partial points for related category
      else
        0 # No points for unrelated category
      end
    end

    def calculate_risk_alignment(campaign, ai_analysis)
      club_risk_tolerance = assess_club_risk_tolerance
      campaign_risk = ai_analysis ? ai_analysis[:risk_score] || 50 : 50
      
      case club_risk_tolerance
      when :conservative
        # Prefer lower risk (0-40)
        campaign_risk <= 40 ? 20 : (60 - campaign_risk) * 0.5
      when :moderate
        # Prefer medium risk (30-60)
        (20 - (campaign_risk - 45).abs) * 1.0
      when :aggressive
        # Prefer higher risk (50+)
        campaign_risk >= 50 ? 20 : campaign_risk * 0.4
      else
        10 # Default moderate alignment
      end
    end

    def calculate_mission_alignment(campaign)
      return "Neutral" unless @club.mission.present?
      
      # Simple keyword matching for mission alignment
      mission_keywords = extract_keywords(@club.mission)
      campaign_keywords = extract_keywords(campaign.description.to_plain_text + " " + campaign.title)
      
      common_keywords = mission_keywords & campaign_keywords
      alignment_ratio = common_keywords.size.to_f / [mission_keywords.size, 1].max
      
      case alignment_ratio
      when 0.7..1.0 then "Strong"
      when 0.4..0.69 then "Moderate"
      when 0.1..0.39 then "Weak"
      else "None"
      end
    end

    def get_campaign_ai_analysis(campaign)
      # Use existing deal scoring service
      latest_log = campaign.deal_score_logs.recent.first
      
      if latest_log
        {
          deal_score: latest_log.deal_score,
          risk_score: latest_log.risk_score,
          risk_category: latest_log.risk_category,
          strengths: latest_log.strengths,
          recommendations: latest_log.recommendations,
          sentiment_analysis: latest_log.metadata&.dig('sentiment_analysis'),
          team_assessment: latest_log.metadata&.dig('team_assessment')
        }
      else
        # Fallback to basic analysis
        {
          deal_score: estimate_deal_score(campaign),
          risk_score: estimate_risk_score(campaign),
          risk_category: "medium"
        }
      end
    end

    def estimate_deal_score(campaign)
      base_score = 50
      
      # Adjust based on performance
      base_score += (campaign.performance_percentage * 0.3)
      
      # Adjust based on team size
      base_score += [campaign.campaign_team_members.count * 5, 20].min
      
      # Adjust based on updates frequency
      base_score += [campaign.updates.count * 2, 10].min
      
      base_score.clamp(0, 100).round(2)
    end

    def estimate_risk_score(campaign)
      base_risk = 50
      
      # Higher risk for newer campaigns
      days_running = (Date.current - campaign.created_at.to_date).to_i
      base_risk += [30 - (days_running / 10), 0].max
      
      # Higher risk for lower performance
      base_risk += [(100 - campaign.performance_percentage) * 0.2, 20].min
      
      base_risk.clamp(0, 100).round(2)
    end

    def extract_categories_from_focus(focus_text)
      return [] unless focus_text.present?
      
      # Map common investment focus terms to campaign categories
      focus_text = focus_text.downcase
      categories = []
      
      categories << 'technology' if focus_text.include?('tech')
      categories << 'healthcare' if focus_text.include?('health') || focus_text.include?('medical')
      categories << 'clean energy' if focus_text.include?('clean') || focus_text.include?('energy') || focus_text.include?('sustainable')
      categories << 'agriculture' if focus_text.include?('agri') || focus_text.include?('food')
      categories << 'transportation' if focus_text.include?('transport') || focus_text.include?('mobility')
      categories << 'education' if focus_text.include?('edu') || focus_text.include?('learn')
      categories << 'finance' if focus_text.include?('fintech') || focus_text.include?('finance')
      
      categories.uniq
    end

    def category_related?(campaign_category, focus_categories)
      # Define category relationships
      category_groups = {
        'technology' => ['software', 'hardware', 'ai', 'blockchain', 'fintech'],
        'healthcare' => ['medical', 'biotech', 'health', 'wellness'],
        'clean energy' => ['solar', 'wind', 'renewable', 'sustainability'],
        'agriculture' => ['agritech', 'food', 'farming'],
        'transportation' => ['mobility', 'logistics', 'automotive']
      }
      
      focus_categories.any? do |focus_category|
        related_categories = category_groups[focus_category] || []
        related_categories.include?(campaign_category.downcase)
      end
    end

    def extract_keywords(text)
      return [] unless text.present?
      
      # Simple keyword extraction
      text.downcase
          .gsub(/[^\w\s]/, '')
          .split
          .reject { |word| stop_words.include?(word) }
          .select { |word| word.length > 3 }
          .uniq
    end

    def stop_words
      %w[the and or but in on at to for of a an is are was were be been have has had do does did]
    end

    def assess_club_risk_tolerance
      return :moderate unless @club.investment_focus.present?
      
      focus_text = @club.investment_focus.downcase
      
      if focus_text.include?('early') || focus_text.include?('venture') || focus_text.include?('high growth')
        :aggressive
      elsif focus_text.include?('stable') || focus_text.include?('income') || focus_text.include?('dividend')
        :conservative
      else
        :moderate
      end
    end

    def extract_preferred_sectors
      return [] unless @club.investment_focus.present?
      extract_categories_from_focus(@club.investment_focus)
    end

    def generate_investment_thesis
      return "General investment approach" unless @club.investment_focus.present? && @club.mission.present?
      
      "Focus on #{@club.investment_focus} investments that align with our mission: #{@club.mission.truncate(100)}"
    end

    def generate_reasoning(campaign, ai_analysis, match_score)
      reasons = []
      
      # Category alignment
      if @club.investment_focus.present? && campaign.category.present?
        reasons << "Matches your focus on #{@club.investment_focus}"
      end
      
      # AI analysis factors
      if ai_analysis
        if ai_analysis[:deal_score].to_i >= 70
          reasons << "Strong AI deal score (#{ai_analysis[:deal_score]})"
        end
        
        if ai_analysis[:risk_category] == "low"
          reasons << "Low risk profile"
        end
        
        if ai_analysis[:strengths].present?
          reasons << "Key strengths: #{ai_analysis[:strengths].first(2).join(', ')}"
        end
      end
      
      # Campaign performance
      if campaign.performance_percentage >= 50
        reasons << "Strong funding progress (#{campaign.performance_percentage}%)"
      end
      
      reasons.empty? ? "Good overall match based on multiple factors" : reasons.join(". ")
    end
  end
end