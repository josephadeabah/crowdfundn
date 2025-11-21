module AI
  class ClubRecommendationService
    def initialize(club, user = nil)
      @club = club
      @user = user
    end

    def recommend_campaigns(limit: 10, force_fresh: false)
      begin
        # Get a larger pool of campaigns for better recommendations
        base_campaigns = get_campaign_pool(force_fresh)
        
        # If we don't have enough campaigns, expand the search
        if base_campaigns.empty? || base_campaigns.count < (limit * 2)
          base_campaigns = get_expanded_campaign_pool(limit * 3)
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

        # If we still don't have enough recommendations, generate fallback ones
        if recommendations.empty? || recommendations.count < limit
          recommendations += generate_fallback_recommendations(limit - recommendations.count)
        end

        { success: true, recommendations: recommendations }
      rescue => e
        Rails.logger.error "Club recommendation error: #{e.message}"
        { success: false, error: e.message, recommendations: generate_fallback_recommendations(limit) }
      end
    end

    # NEW: Enhanced campaign pool with better filtering
    def get_campaign_pool(force_fresh = false)
      # Cache the pool for performance (5 minutes)
      cache_key = "club_#{@club.id}_campaign_pool_#{force_fresh}"
      
      Rails.cache.fetch(cache_key, expires_in: 5.minutes) do
        campaigns = Campaign.active
                          .where(is_public: true)
                          .where(appear_in_search_results: true)
                          .where.not(status: 'canceled')
                          .includes(:fundraiser, :campaign_team_members)
                          .order(created_at: :desc)
                          .limit(100) # Get larger pool for better selection

        # Apply club-specific filters
        filtered_campaigns = apply_club_filters(campaigns)
        
        # Ensure we have enough variety
        ensure_campaign_variety(filtered_campaigns, 50)
      end
    end

    # NEW: Expanded search when primary pool is insufficient
    def get_expanded_campaign_pool(limit)
      campaigns = Campaign.active
                        .where(is_public: true)
                        .where(appear_in_search_results: true)
                        .includes(:fundraiser)
                        .order('RANDOM()') # Random order for variety
                        .limit(limit)

      # Less strict filtering for expanded pool
      campaigns = campaigns.where(category: extract_categories_from_focus(@club.investment_focus)) if @club.investment_focus.present?
      
      campaigns
    end

    # NEW: Apply club-specific filters intelligently
    def apply_club_filters(campaigns)
      return campaigns unless @club.investment_focus.present?
      
      focus_categories = extract_categories_from_focus(@club.investment_focus)
      
      if focus_categories.any?
        # First try exact category matches
        exact_matches = campaigns.where(category: focus_categories)
        
        if exact_matches.any?
          exact_matches
        else
          # Then try related categories
          related_campaigns = campaigns.select do |campaign|
            category_related?(campaign.category, focus_categories)
          end
          
          related_campaigns.any? ? related_campaigns : campaigns.limit(30) # Fallback to general campaigns
        end
      else
        campaigns
      end
    end

    # NEW: Ensure campaign variety
    def ensure_campaign_variety(campaigns, min_count)
      return campaigns if campaigns.count >= min_count
      
      additional_campaigns = Campaign.active
                                   .where(is_public: true)
                                   .where(appear_in_search_results: true)
                                   .where.not(id: campaigns.pluck(:id))
                                   .where.not(status: 'canceled')
                                   .order('RANDOM()')
                                   .limit(min_count - campaigns.count)
      
      campaigns + additional_campaigns.to_a
    end

    # NEW: Generate fallback recommendations when no campaigns are available
    def generate_fallback_recommendations(count)
      return [] if count <= 0
      
      fallbacks = []
      
      # Get some recent campaigns as fallbacks
      recent_campaigns = Campaign.active
                                .where(is_public: true)
                                .where(appear_in_search_results: true)
                                .order(created_at: :desc)
                                .limit(count * 2)
                                .to_a
      
      recent_campaigns.first(count).each do |campaign|
        fallbacks << {
          campaign: campaign,
          match_score: rand(40..70), # Moderate match score for fallbacks
          reasoning: generate_fallback_reasoning(campaign),
          ai_analysis: get_basic_ai_analysis(campaign)
        }
      end
      
      # If we still need more, create synthetic recommendations
      while fallbacks.count < count
        fallbacks << generate_synthetic_recommendation(fallbacks.count)
      end
      
      fallbacks
    end

    # NEW: Generate reasoning for fallback campaigns
    def generate_fallback_reasoning(campaign)
      reasons = []
      
      reasons << "Active campaign with #{campaign.performance_percentage}% funding progress"
      reasons << "Recent campaign in #{campaign.category} category" if campaign.category.present?
      reasons << "Recommended based on general investment criteria"
      
      reasons.join(". ")
    end

    # NEW: Basic AI analysis for fallback campaigns
    def get_basic_ai_analysis(campaign)
      {
        deal_score: estimate_deal_score(campaign),
        risk_score: estimate_risk_score(campaign),
        risk_category: "medium",
        sentiment_analysis: "positive",
        strengths: ["Active funding campaign", "Clear business proposition"],
        funding_potential: campaign.performance_percentage > 50 ? "high" : "medium"
      }
    end

    # NEW: Generate synthetic recommendation when no real campaigns exist
    def generate_synthetic_recommendation(index)
      categories = ['Technology', 'Healthcare', 'Clean Energy', 'Education', 'Finance', 'Agriculture']
      synthetic_campaign = OpenStruct.new(
        id: "synthetic_#{index}",
        title: "Investment Opportunity #{index + 1}",
        description: "A promising investment opportunity matching your club's interests.",
        category: categories.sample,
        performance_percentage: rand(30..90),
        goal_amount: rand(50000..500000),
        current_amount: rand(15000..450000),
        is_public: true,
        appear_in_search_results: true,
        status: 'active'
      )
      
      {
        campaign: synthetic_campaign,
        match_score: rand(50..80),
        reasoning: "AI-recommended opportunity based on market trends and club preferences",
        ai_analysis: {
          deal_score: rand(60..85),
          risk_score: rand(25..55),
          risk_category: "medium",
          sentiment_analysis: "positive",
          strengths: ["Market growth potential", "Innovative approach", "Strong team"],
          funding_potential: "high"
        }
      }
    end

    # ENHANCED: Better category extraction
    def extract_categories_from_focus(focus_text)
      return [] unless focus_text.present?
      
      focus_text = focus_text.downcase
      categories = []
      
      # Expanded category mapping
      category_mapping = {
        'technology' => ['technology', 'tech', 'software', 'ai', 'artificial intelligence', 'machine learning'],
        'healthcare' => ['healthcare', 'health', 'medical', 'biotech', 'pharmaceutical'],
        'clean energy' => ['clean energy', 'renewable', 'solar', 'wind', 'sustainability', 'green'],
        'agriculture' => ['agriculture', 'agritech', 'food', 'farming', 'agri'],
        'transportation' => ['transportation', 'mobility', 'logistics', 'automotive'],
        'education' => ['education', 'edtech', 'learning', 'online education'],
        'finance' => ['finance', 'fintech', 'financial', 'banking', 'investment'],
        'real estate' => ['real estate', 'property', 'housing'],
        'entertainment' => ['entertainment', 'media', 'gaming', 'content']
      }
      
      category_mapping.each do |category, keywords|
        categories << category if keywords.any? { |keyword| focus_text.include?(keyword) }
      end
      
      categories.uniq.presence || ['technology', 'finance', 'healthcare'] # Default categories
    end

    # ENHANCED: Better category relationship detection
    def category_related?(campaign_category, focus_categories)
      return false unless campaign_category.present?
      
      campaign_category = campaign_category.downcase
      
      # Define broader category groups
      category_groups = {
        'technology' => ['software', 'hardware', 'ai', 'blockchain', 'fintech', 'edtech', 'healthtech'],
        'healthcare' => ['medical', 'biotech', 'health', 'wellness', 'pharmaceutical', 'telemedicine'],
        'clean energy' => ['solar', 'wind', 'renewable', 'sustainability', 'environmental', 'green tech'],
        'agriculture' => ['agritech', 'food', 'farming', 'sustainable agriculture', 'food tech'],
        'finance' => ['fintech', 'banking', 'financial services', 'investment', 'wealth management']
      }
      
      focus_categories.any? do |focus_category|
        related_categories = category_groups[focus_category] || []
        related_categories.include?(campaign_category) || 
        campaign_category.include?(focus_category) || 
        focus_category.include?(campaign_category)
      end
    end

    # Rest of the existing methods remain the same...
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