# app/services/ai/club_recommendation_service.rb
module AI
  class ClubRecommendationService
    def initialize(investment_club, user = nil)
      @club = investment_club
      @user = user
      @client = initialize_openai_client
    end

    def recommend_campaigns(limit: 10, risk_tolerance: nil, investment_focus: nil)
      begin
        # Get club preferences and constraints
        club_profile = build_club_profile
        available_campaigns = find_eligible_campaigns
        
        # If we have AI analysis data, use it for matching
        campaigns_with_analysis = available_campaigns.with_ai_analysis
        
        if campaigns_with_analysis.any?
          # Use AI-powered matching
          recommendations = ai_powered_recommendations(campaigns_with_analysis, club_profile, limit)
        else
          # Fallback to rule-based matching
          recommendations = rule_based_recommendations(available_campaigns, club_profile, limit)
        end

        {
          success: true,
          recommendations: recommendations,
          matching_criteria: {
            risk_tolerance: club_profile[:risk_tolerance],
            investment_focus: club_profile[:investment_focus],
            mission_alignment: club_profile[:mission_alignment]
          },
          total_considered: available_campaigns.count
        }
      rescue => e
        Rails.logger.error "AI Club Recommendation failed for club #{@club.id}: #{e.message}"
        {
          success: false,
          error: "Failed to generate recommendations: #{e.message}",
          recommendations: []
        }
      end
    end

    def explain_recommendation(campaign)
      return { success: false, error: "Campaign not provided" } unless campaign
      
      begin
        club_profile = build_club_profile
        campaign_analysis = get_campaign_analysis(campaign)
        
        explanation_prompt = build_explanation_prompt(club_profile, campaign, campaign_analysis)
        response = call_openai_api(explanation_prompt)
        
        explanation = parse_explanation_response(response)
        
        {
          success: true,
          explanation: explanation,
          club_alignment: calculate_club_alignment(club_profile, campaign_analysis),
          key_factors: extract_key_factors(club_profile, campaign_analysis)
        }
      rescue => e
        Rails.logger.error "Explanation generation failed: #{e.message}"
        {
          success: false,
          error: "Could not generate explanation",
          fallback_explanation: generate_fallback_explanation(campaign)
        }
      end
    end

    def get_club_risk_profile
      build_club_profile.slice(:risk_tolerance, :investment_focus, :mission_alignment, :member_preferences)
    end

    private

    def initialize_openai_client
      api_key = ENV['OPENAI_API_KEY']
      if api_key.blank?
        raise "OpenAI API key is missing. Please set OPENAI_API_KEY environment variable."
      end
      
      OpenAI::Client.new(
        access_token: api_key,
        log_errors: true,
        request_timeout: 30
      )
    end

    def build_club_profile
      {
        name: @club.name,
        mission: @club.mission,
        investment_focus: extract_investment_focus,
        risk_tolerance: calculate_risk_tolerance,
        mission_alignment: extract_mission_alignment,
        historical_investments: analyze_historical_investments,
        member_preferences: analyze_member_preferences,
        financial_constraints: {
          min_contribution: @club.minimum_monthly_contribution,
          current_balance: @club.current_balance,
          average_investment: calculate_average_investment
        }
      }
    end

    def extract_investment_focus
      # Parse investment focus from club description and mission
      focus_keywords = {
        'technology' => ['tech', 'software', 'ai', 'blockchain', 'digital', 'innovation'],
        'real_estate' => ['property', 'real estate', 'housing', 'commercial', 'residential'],
        'renewable_energy' => ['solar', 'wind', 'renewable', 'green energy', 'sustainability'],
        'healthcare' => ['health', 'medical', 'biotech', 'pharmaceutical', 'wellness'],
        'consumer_goods' => ['retail', 'consumer', 'product', 'brand', 'ecommerce'],
        'financial_services' => ['fintech', 'banking', 'finance', 'investment', 'insurance']
      }
      
      text = "#{@club.mission} #{@club.description}".downcase
      matches = focus_keywords.map do |sector, keywords|
        matches = keywords.count { |keyword| text.include?(keyword) }
        [sector, matches]
      end.to_h
      
      primary_focus = matches.max_by { |_, count| count }
      primary_focus[0] if primary_focus && primary_focus[1] > 0
    end

    def calculate_risk_tolerance
      # Analyze club's historical investments and member composition
      investments = @club.club_investments.executed
      
      if investments.any?
        avg_risk_score = investments.joins(:campaign)
                                  .where.not(campaigns: { ai_risk_score: nil })
                                  .average('campaigns.ai_risk_score')
                                  .to_f
        
        if avg_risk_score > 0
          case avg_risk_score
          when 0..30 then 'conservative'
          when 31..60 then 'moderate'
          else 'aggressive'
          end
        else
          'moderate' # default
        end
      else
        # For new clubs, use member-based assessment
        assess_member_risk_profile
      end
    end

    def assess_member_risk_profile
      # Simple assessment based on member demographics (you might want to enhance this)
      active_members = @club.investment_club_memberships.active.count
      'moderate' # Default for now
    end

    def extract_mission_alignment
      # Extract key mission themes for alignment scoring
      mission_text = "#{@club.mission} #{@club.description}".downcase
      
      themes = {
        social_impact: ['social', 'impact', 'community', 'sustainable', 'ethical'],
        innovation: ['innovate', 'disrupt', 'technology', 'future', 'digital'],
        profitability: ['return', 'profit', 'growth', 'revenue', 'financial'],
        sustainability: ['green', 'environment', 'sustainable', 'eco', 'climate']
      }
      
      theme_scores = themes.transform_values do |keywords|
        keywords.count { |keyword| mission_text.include?(keyword) }
      end
      
      theme_scores.select { |_, score| score > 0 }
    end

    def analyze_historical_investments
      investments = @club.club_investments.executed
      return {} unless investments.any?
      
      {
        total_investments: investments.count,
        total_amount: investments.sum(:investment_amount),
        preferred_categories: investments.joins(:campaign)
                                       .group('campaigns.category')
                                       .order('COUNT(*) DESC')
                                       .limit(3)
                                       .pluck('campaigns.category'),
        average_investment_size: investments.average(:investment_amount).to_f,
        success_rate: calculate_investment_success_rate(investments)
      }
    end

    def analyze_member_preferences
      # This could be enhanced with actual member preference data
      {
        total_members: @club.current_members_count,
        average_contribution: @club.investment_club_contributions.completed.average(:amount).to_f,
        engagement_level: calculate_engagement_level
      }
    end

    def calculate_average_investment
      investments = @club.club_investments.executed
      investments.any? ? investments.average(:investment_amount).to_f : 0
    end

    def calculate_investment_success_rate(investments)
      return 0 unless investments.any?
      
      # Simple success metric based on campaign performance
      successful_investments = investments.joins(:campaign)
                                         .where('campaigns.performance_percentage >= ?', 80)
                                         .count
      
      (successful_investments.to_f / investments.count * 100).round(2)
    end

    def calculate_engagement_level
      contributions = @club.investment_club_contributions.completed
      return 'low' unless contributions.any?
      
      avg_contributions_per_member = contributions.count.to_f / @club.current_members_count
      
      case avg_contributions_per_member
      when 0..1 then 'low'
      when 1..3 then 'medium'
      else 'high'
      end
    end

    def find_eligible_campaigns
      # Base query for active campaigns
      campaigns = Campaign.active
                          .where(is_public: true)
                          .where(appear_in_search_results: true)
      
      # Apply club-specific filters
      campaigns = filter_by_investment_focus(campaigns)
      campaigns = filter_by_risk_tolerance(campaigns)
      campaigns = filter_by_financial_constraints(campaigns)
      
      campaigns.order(created_at: :desc)
    end

    def filter_by_investment_focus(campaigns)
      focus = extract_investment_focus
      return campaigns unless focus
      
      # Match campaigns in similar categories
      case focus
      when 'technology'
        campaigns.where(category: ['Technology', 'Software', 'AI', 'Blockchain'])
      when 'real_estate'
        campaigns.where(category: ['Real Estate', 'Property'])
      when 'renewable_energy'
        campaigns.where(category: ['Energy', 'Sustainability', 'Clean Tech'])
      when 'healthcare'
        campaigns.where(category: ['Healthcare', 'Medical', 'Biotech'])
      when 'consumer_goods'
        campaigns.where(category: ['Retail', 'Consumer Goods', 'E-commerce'])
      when 'financial_services'
        campaigns.where(category: ['Finance', 'Fintech', 'Financial Services'])
      else
        campaigns
      end
    end

    def filter_by_risk_tolerance(campaigns)
      tolerance = calculate_risk_tolerance
      
      case tolerance
      when 'conservative'
        campaigns.where("ai_risk_score <= 40 OR ai_risk_score IS NULL")
      when 'aggressive'
        campaigns.where("ai_risk_score >= 60 OR ai_risk_score IS NULL")
      else # moderate
        campaigns.where("(ai_risk_score BETWEEN 30 AND 70) OR ai_risk_score IS NULL")
      end
    end

    def filter_by_financial_constraints(campaigns)
      # Filter by investment size the club can handle
      avg_investment = calculate_average_investment
      current_balance = @club.current_balance.to_f
      
      if avg_investment > 0 && current_balance > 0
        # Prefer campaigns where investment amount is reasonable for the club
        max_investment = [current_balance * 0.2, avg_investment * 2].max
        campaigns.where("goal_amount <= ?", max_investment)
      else
        campaigns
      end
    end

    def ai_powered_recommendations(campaigns, club_profile, limit)
      # Use OpenAI to rank and recommend campaigns
      prompt = build_recommendation_prompt(campaigns, club_profile, limit)
      response = call_openai_api(prompt)
      
      parsed_recommendations = parse_recommendation_response(response, campaigns)
      
      # Fallback if AI parsing fails
      if parsed_recommendations.empty?
        rule_based_recommendations(campaigns, club_profile, limit)
      else
        parsed_recommendations
      end
    end

    def rule_based_recommendations(campaigns, club_profile, limit)
      campaigns.limit(limit).map do |campaign|
        {
          campaign: campaign,
          match_score: calculate_match_score(campaign, club_profile),
          reasoning: generate_rule_based_reasoning(campaign, club_profile),
          key_alignment_factors: identify_alignment_factors(campaign, club_profile)
        }
      end.sort_by { |rec| -rec[:match_score] }
    end

    def calculate_match_score(campaign, club_profile)
      score = 0
      max_score = 100
      
      # Risk alignment (30 points)
      risk_score = campaign.ai_risk_score || 50
      club_risk = case club_profile[:risk_tolerance]
                  when 'conservative' then 30
                  when 'aggressive' then 70
                  else 50
                  end
      
      risk_diff = (risk_score - club_risk).abs
      score += [30 - (risk_diff / 2), 0].max
      
      # Category alignment (25 points)
      if club_profile[:investment_focus] && 
         campaign.category&.downcase&.include?(club_profile[:investment_focus])
        score += 25
      end
      
      # Financial fit (20 points)
      club_balance = @club.current_balance.to_f
      if club_balance > 0 && campaign.goal_amount <= club_balance * 0.3
        score += 20
      elsif campaign.goal_amount <= club_balance
        score += 10
      end
      
      # Performance potential (15 points)
      if campaign.ai_deal_score && campaign.ai_deal_score >= 70
        score += 15
      elsif campaign.performance_percentage >= 50
        score += 10
      end
      
      # Mission alignment (10 points)
      score += 10 if check_mission_alignment(campaign, club_profile)
      
      score
    end

    def check_mission_alignment(campaign, club_profile)
      mission_text = "#{campaign.title} #{campaign.description}".downcase
      club_mission_keywords = club_profile[:mission_alignment].keys
      
      club_mission_keywords.any? { |keyword| mission_text.include?(keyword.to_s) }
    end

    def generate_rule_based_reasoning(campaign, club_profile)
      factors = []
      
      factors << "Matches your #{club_profile[:investment_focus]} focus" if club_profile[:investment_focus]
      factors << "Aligns with your #{club_profile[:risk_tolerance]} risk profile"
      factors << "Fits within your club's investment capacity"
      
      "This campaign #{factors.join(', ').downcase}."
    end

    def identify_alignment_factors(campaign, club_profile)
      factors = []
      
      factors << "risk_tolerance" if campaign.ai_risk_score && 
                                    ((club_profile[:risk_tolerance] == 'conservative' && campaign.ai_risk_score <= 40) ||
                                     (club_profile[:risk_tolerance] == 'aggressive' && campaign.ai_risk_score >= 60) ||
                                     (club_profile[:risk_tolerance] == 'moderate' && campaign.ai_risk_score.between?(30, 70)))
      
      factors << "investment_focus" if club_profile[:investment_focus] && 
                                      campaign.category&.downcase&.include?(club_profile[:investment_focus])
      
      factors << "financial_fit" if @club.current_balance.to_f >= campaign.goal_amount * 0.1
      
      factors
    end

    def build_recommendation_prompt(campaigns, club_profile, limit)
      campaigns_data = campaigns.map do |campaign|
        {
          id: campaign.id,
          title: campaign.title,
          category: campaign.category,
          description: campaign.description.to_plain_text.truncate(200),
          goal_amount: campaign.goal_amount,
          current_amount: campaign.current_amount,
          performance_percentage: campaign.performance_percentage,
          ai_deal_score: campaign.ai_deal_score,
          ai_risk_score: campaign.ai_risk_score,
          ai_risk_category: campaign.ai_risk_category,
          location: campaign.location
        }
      end
      
      <<~PROMPT
        You are an expert investment advisor for investment clubs. Recommend the best campaigns for this club based on their profile.
        
        CLUB PROFILE:
        - Name: #{club_profile[:name]}
        - Mission: #{club_profile[:mission]}
        - Investment Focus: #{club_profile[:investment_focus]}
        - Risk Tolerance: #{club_profile[:risk_tolerance]}
        - Current Balance: $#{@club.current_balance}
        - Member Count: #{club_profile[:member_preferences][:total_members]}
        - Mission Alignment Themes: #{club_profile[:mission_alignment].keys.join(', ')}
        
        AVAILABLE CAMPAIGNS:
        #{campaigns_data.to_json}
        
        Please recommend the top #{limit} campaigns that best match this club's profile. Consider:
        1. Risk tolerance alignment
        2. Investment focus matching  
        3. Mission alignment
        4. Financial suitability
        5. Growth potential
        
        RESPONSE FORMAT (JSON only):
        {
          "recommendations": [
            {
              "campaign_id": number,
              "match_score": number (0-100),
              "reasoning": "Brief explanation of why this matches the club",
              "key_alignment_factors": ["factor1", "factor2", "factor3"],
              "potential_concerns": ["concern1", "concern2"]
            }
          ]
        }
        
        Be objective and focus on long-term value creation for the club members.
      PROMPT
    end

    def build_explanation_prompt(club_profile, campaign, campaign_analysis)
      <<~PROMPT
        Explain why this investment campaign would be a good fit for this investment club.
        
        CLUB PROFILE:
        #{club_profile.to_json}
        
        CAMPAIGN DETAILS:
        #{campaign_analysis.to_json}
        
        Provide a clear, concise explanation that covers:
        1. Risk alignment
        2. Strategic fit with club's mission and focus
        3. Financial suitability
        4. Key strengths and potential concerns
        5. How it compares to the club's historical investments
        
        Format the response as a compelling investment rationale that club members would understand.
        
        RESPONSE FORMAT (JSON only):
        {
          "explanation": "Comprehensive explanation text",
          "alignment_summary": {
            "risk_alignment": "high/medium/low",
            "strategic_fit": "high/medium/low", 
            "financial_fit": "high/medium/low"
          },
          "key_considerations": ["point1", "point2", "point3"],
          "recommendation_strength": "strong/moderate/weak"
        }
      PROMPT
    end

    def call_openai_api(prompt)
      return nil unless @client
      
      begin
        response = @client.chat(
          parameters: {
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are an expert investment advisor. Always respond with valid JSON." },
              { role: "user", content: prompt }
            ],
            max_tokens: 1500,
            response_format: { type: "json_object" }
          }
        )
        
        response
      rescue => e
        Rails.logger.error "OpenAI API call failed: #{e.message}"
        nil
      end
    end

    def parse_recommendation_response(response, campaigns)
      return [] unless response
      
      begin
        content = response.dig("choices", 0, "message", "content")
        return [] unless content
        
        data = JSON.parse(content)
        recommendations = data["recommendations"] || []
        
        recommendations.map do |rec|
          campaign = campaigns.find { |c| c.id == rec["campaign_id"] }
          next unless campaign
          
          {
            campaign: campaign,
            match_score: rec["match_score"],
            reasoning: rec["reasoning"],
            key_alignment_factors: rec["key_alignment_factors"] || [],
            potential_concerns: rec["potential_concerns"] || []
          }
        end.compact
      rescue JSON::ParserError => e
        Rails.logger.error "Failed to parse AI recommendation response: #{e.message}"
        []
      end
    end

    def parse_explanation_response(response)
      return generate_fallback_explanation(nil) unless response
      
      begin
        content = response.dig("choices", 0, "message", "content")
        return generate_fallback_explanation(nil) unless content
        
        JSON.parse(content)
      rescue JSON::ParserError
        { "explanation" => generate_fallback_explanation(nil) }
      end
    end

    def get_campaign_analysis(campaign)
      {
        title: campaign.title,
        category: campaign.category,
        description: campaign.description.to_plain_text.truncate(500),
        goal_amount: campaign.goal_amount,
        current_amount: campaign.current_amount,
        performance_percentage: campaign.performance_percentage,
        ai_deal_score: campaign.ai_deal_score,
        ai_risk_score: campaign.ai_risk_score,
        ai_risk_category: campaign.ai_risk_category,
        location: campaign.location,
        team_strength: campaign.ai_team_assessment,
        market_opportunity: campaign.ai_market_opportunity,
        sentiment: campaign.ai_sentiment
      }
    end

    def calculate_club_alignment(club_profile, campaign_analysis)
      {
        risk: calculate_risk_alignment(club_profile[:risk_tolerance], campaign_analysis[:ai_risk_score]),
        strategic: calculate_strategic_alignment(club_profile, campaign_analysis),
        financial: calculate_financial_alignment(club_profile, campaign_analysis)
      }
    end

    def calculate_risk_alignment(club_risk_tolerance, campaign_risk_score)
      return "unknown" unless campaign_risk_score
      
      case club_risk_tolerance
      when 'conservative'
        campaign_risk_score <= 40 ? "high" : (campaign_risk_score <= 60 ? "medium" : "low")
      when 'moderate'
        campaign_risk_score.between?(30, 70) ? "high" : (campaign_risk_score.between?(20, 80) ? "medium" : "low")
      when 'aggressive'
        campaign_risk_score >= 60 ? "high" : (campaign_risk_score >= 40 ? "medium" : "low")
      else
        "unknown"
      end
    end

    def calculate_strategic_alignment(club_profile, campaign_analysis)
      alignment_score = 0
      
      # Category alignment
      if club_profile[:investment_focus] && 
         campaign_analysis[:category]&.downcase&.include?(club_profile[:investment_focus])
        alignment_score += 50
      end
      
      # Mission alignment
      mission_text = "#{campaign_analysis[:title]} #{campaign_analysis[:description]}".downcase
      club_profile[:mission_alignment].keys.each do |theme|
        alignment_score += 10 if mission_text.include?(theme.to_s)
      end
      
      case alignment_score
      when 0..30 then "low"
      when 31..60 then "medium"
      else "high"
      end
    end

    def calculate_financial_alignment(club_profile, campaign_analysis)
      club_balance = @club.current_balance.to_f
      campaign_goal = campaign_analysis[:goal_amount].to_f
      
      if campaign_goal <= club_balance * 0.2
        "high"
      elsif campaign_goal <= club_balance * 0.5
        "medium"
      else
        "low"
      end
    end

    def extract_key_factors(club_profile, campaign_analysis)
      factors = []
      
      factors << "Risk profile match" if calculate_risk_alignment(club_profile[:risk_tolerance], campaign_analysis[:ai_risk_score]) == "high"
      factors << "Strategic focus alignment" if calculate_strategic_alignment(club_profile, campaign_analysis) == "high"
      factors << "Strong deal quality" if campaign_analysis[:ai_deal_score].to_i >= 70
      factors << "Good market timing" if campaign_analysis[:performance_percentage].to_i >= 50
      
      factors
    end

    def generate_fallback_explanation(campaign)
      return "Unable to generate detailed analysis at this time." unless campaign
      
      "This #{campaign.category} campaign aligns with your club's investment strategy and represents a compelling opportunity based on current market conditions and the campaign's performance metrics."
    end
  end
end