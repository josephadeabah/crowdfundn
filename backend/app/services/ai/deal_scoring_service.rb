# app/services/ai/deal_scoring_service.rb
module AI
  class DealScoringService
    include Rails.application.routes.url_helpers

    def initialize(campaign, analysis_type: 'manual')
      @campaign = campaign
      @analysis_type = analysis_type
      
      # Make sure API key is present
      api_key = ENV['OPENAI_API_KEY']
      if api_key.blank?
        raise "OpenAI API key is missing. Please set OPENAI_API_KEY environment variable."
      end
      
      # Initialize client with proper configuration and timeout settings
      @client = OpenAI::Client.new(
        access_token: api_key,
        log_errors: true,
        request_timeout: 60 # Increase timeout to 60 seconds
      )
    end

    def analyze
      start_time = Time.current
      
      begin
        # Check API key first
        if ENV['OPENAI_API_KEY'].blank?
          return { success: false, error: "OpenAI API key not configured" }
        end
        
        prompt = build_comprehensive_prompt
        response = call_openai_api(prompt)
        
        # Handle API response errors
        if response.nil?
          return { success: false, error: "OpenAI API returned no response" }
        end
        
        # Handle cases where API returns true (success but no content)
        if response == true
          return { success: false, error: "OpenAI API returned success but no content" }
        end
        
        analysis_data = parse_response(response)
        
        deal_score_log = create_deal_score_log(prompt, response, analysis_data, start_time)
        deal_score_log.update_campaign_scores
        
        { success: true, analysis: analysis_data, log: deal_score_log }
      rescue OpenAI::Error => e
        Rails.logger.error "OpenAI API Error for campaign #{@campaign.id}: #{e.message}"
        { success: false, error: "OpenAI API error: #{e.message}" }
      rescue => e
        Rails.logger.error "AI Deal Scoring failed for campaign #{@campaign.id}: #{e.message}"
        { success: false, error: e.message }
      end
    end

    def self.analyze_campaign(campaign, analysis_type: 'manual')
      new(campaign, analysis_type: analysis_type).analyze
    end

    def self.batch_analyze_campaigns(campaign_ids, analysis_type: 'weekly')
      campaigns = Campaign.where(id: campaign_ids)
      results = []
      
      campaigns.find_each do |campaign|
        result = analyze_campaign(campaign, analysis_type: analysis_type)
        results << { campaign_id: campaign.id, result: result }
      end
      
      results
    end

    def self.generate_embeddings(campaign)
      new(campaign).generate_embedding
    end

    private

    def embedding_column_exists?
      Campaign.column_names.include?('ai_embedding')
    end

    def build_comprehensive_prompt
      campaign_data = extract_comprehensive_campaign_data
      
      <<~PROMPT
        You are an expert investment analyst specializing in startup funding and equity campaigns. 
        Analyze this investment opportunity comprehensively, weighing both upside potential and downside risks.

        CAMPAIGN DATA:
        #{format_campaign_data(campaign_data)}

        COMPREHENSIVE ANALYSIS FRAMEWORK:
        1. Deal Score (0-100): Overall investment attractiveness considering both upside and downside
        2. Risk Score (0-100): Overall risk level (higher = more risky)
        3. Risk Category: low/medium/high/very_high
        4. Upside Potential: List 3-5 key upside factors and growth opportunities
        5. Downside Risks: List 3-5 major risk factors and concerns
        6. Strengths: List 3-5 key strengths and competitive advantages
        7. Recommendations: List 2-3 actionable recommendations for investors
        8. Sentiment Analysis: Overall sentiment from community engagement (positive/neutral/negative)
        9. Team Assessment: Evaluation of team strength and experience (strong/adequate/weak)
        10. Market Opportunity: Assessment of market size and competitive positioning (large/medium/small)
        
        ADDITIONAL KEY METRICS FOR INVESTORS:
        11. Funding Potential: Assessment of likelihood to reach funding goal (high/medium/low)
        12. Timing Assessment: Evaluation of market timing and campaign timing (excellent/good/average/poor)
        13. Competitive Advantage: Strength of competitive moat (strong/moderate/weak)
        14. Exit Potential: Likelihood of successful exit for investors (high/medium/low)
        15. Scalability Assessment: Potential for business model scalability (high/medium/low)
        16. Product-Market Fit: Evidence of product-market fit (strong/moderate/weak)
        17. Technology Assessment: Brief assessment of technology innovation and defensibility
        18. Regulatory Risks: List 2-3 key regulatory considerations and risks
        19. Market Trends: List 2-3 relevant market trends supporting or challenging the opportunity
        20. Investor Alignment: How well this fits different investor profiles (e.g., "Suitable for risk-tolerant investors seeking growth opportunities")
        21. Social Impact: Brief social and environmental impact assessment
        22. Sustainability Score: Environmental sustainability rating (0-100)

        IMPORTANT CONSIDERATIONS FOR INVESTORS:
        - For equity campaigns, focus on valuation, equity structure, and investor terms
        - Analyze community sentiment from comments and updates
        - Evaluate team composition and founder experience
        - Assess market timing and competitive landscape
        - Consider regulatory and execution risks
        - Factor in social proof and traction metrics
        - Evaluate scalability and growth potential
        - Consider exit opportunities and timelines
        - Assess technology defensibility and IP
        - Evaluate ESG factors and social impact

        RESPONSE FORMAT (JSON only):
        {
          "deal_score": number,
          "risk_score": number,
          "risk_category": "low/medium/high/very_high",
          "upside_potential": ["factor1", "factor2", "factor3"],
          "downside_risks": ["risk1", "risk2", "risk3"],
          "strengths": ["strength1", "strength2", "strength3"],
          "recommendations": ["rec1", "rec2", "rec3"],
          "sentiment_analysis": "positive/neutral/negative",
          "team_assessment": "strong/adequate/weak",
          "market_opportunity": "large/medium/small",
          "funding_potential": "high/medium/low",
          "timing_assessment": "excellent/good/average/poor",
          "competitive_advantage": "strong/moderate/weak",
          "exit_potential": "high/medium/low",
          "scalability_assessment": "high/medium/low",
          "product_market_fit": "strong/moderate/weak",
          "technology_assessment": "Brief assessment of technology innovation",
          "regulatory_risks": ["risk1", "risk2"],
          "market_trends": ["trend1", "trend2"],
          "investor_alignment": "Suitable for [investor types]",
          "social_impact": "Brief social impact assessment",
          "sustainability_score": number,
          "analysis_summary": "Comprehensive summary of investment thesis",
          "investment_thesis": "Detailed investment thesis covering both upside and downside"
        }

        Be objective, data-driven, and focus on investor protection. Balance upside potential against downside risks.
        Provide actionable insights for both supporters and investors.
      PROMPT
    end

    def extract_comprehensive_campaign_data
      {
        basic_info: {
          title: @campaign.title,
          type: @campaign.class.name,
          status: @campaign.status,
          description: @campaign.description.to_plain_text.truncate(1000),
          category: @campaign.category,
          location: @campaign.location,
          created_at: @campaign.created_at,
          days_running: (Date.current - @campaign.created_at.to_date).to_i
        },
        financials: {
          goal_amount: @campaign.goal_amount,
          current_amount: @campaign.current_amount,
          transferred_amount: @campaign.transferred_amount,
          performance_percentage: @campaign.performance_percentage,
          currency: @campaign.currency,
          days_remaining: @campaign.remaining_days,
          total_days: @campaign.total_days,
          funding_velocity: calculate_funding_velocity
        },
        equity_info: extract_comprehensive_equity_data,
        team_info: extract_comprehensive_team_data,
        engagement: extract_comprehensive_engagement_data,
        community_sentiment: extract_community_sentiment,
        updates_timeline: extract_updates_timeline,
        fundraiser: {
          experience: extract_fundraiser_experience,
          kyc_status: @campaign.fundraiser.kyc_status_info,
          track_record: extract_fundraiser_track_record
        },
        market_context: extract_market_context,
        competitive_landscape: extract_competitive_analysis
      }
    end

    def extract_fundraiser_experience
      fundraiser = @campaign.fundraiser
      {
        total_campaigns: fundraiser.campaigns.count,
        successful_campaigns: fundraiser.campaigns.where(status: 'completed').count,
        total_raised: fundraiser.campaigns.sum(:transferred_amount),
        member_since: fundraiser.created_at,
        kyc_verified: fundraiser.kyc_verified?,
        investor_verified: fundraiser.investor_kyc_verified?,
        issuer_verified: fundraiser.issuer_kyc_verified?
      }
    end

    def extract_fundraiser_track_record
      fundraiser = @campaign.fundraiser
      previous_campaigns = fundraiser.campaigns.where.not(id: @campaign.id)
      
      {
        total_previous_campaigns: previous_campaigns.count,
        successful_campaigns: previous_campaigns.where(status: 'completed').count,
        total_historical_raise: previous_campaigns.sum(:transferred_amount),
        average_campaign_performance: calculate_average_performance(previous_campaigns),
        campaign_success_rate: calculate_success_rate(previous_campaigns)
      }
    end

    def extract_competitive_analysis
      similar_campaigns = Campaign.where(category: @campaign.category)
                              .where.not(id: @campaign.id)
                              .where('created_at >= ?', 6.months.ago)
      
      # Calculate performance percentages in Ruby since it's not a database column
      campaigns_with_performance = similar_campaigns.map do |campaign|
        {
          campaign: campaign,
          performance_percentage: campaign.performance_percentage
        }
      end
      
      successful_campaigns = campaigns_with_performance.select { |c| c[:performance_percentage] >= 100 }
      
      {
        total_similar_campaigns: similar_campaigns.count,
        average_goal: similar_campaigns.average(:goal_amount).to_f.round(2),
        average_performance: calculate_average_performance_from_array(campaigns_with_performance),
        success_rate: similar_campaigns.any? ? (successful_campaigns.count.to_f / similar_campaigns.count * 100).round(2) : 0
      }
    end

    def calculate_average_performance(campaigns)
      return 0 if campaigns.empty?
      
      # Calculate average performance in Ruby since it's a method, not a column
      total_performance = campaigns.sum { |campaign| campaign.performance_percentage }
      (total_performance.to_f / campaigns.count).round(2)
    end

    def calculate_success_rate(campaigns)
      return 0 if campaigns.empty?
      
      successful_count = campaigns.count { |campaign| campaign.performance_percentage >= 100 }
      (successful_count.to_f / campaigns.count * 100).round(2)
    end

    def calculate_average_performance_from_array(campaigns_with_performance)
      return 0 if campaigns_with_performance.empty?
      
      total_performance = campaigns_with_performance.sum { |c| c[:performance_percentage] }
      (total_performance.to_f / campaigns_with_performance.count).round(2)
    end

    def extract_comprehensive_equity_data
      return {} unless @campaign.is_a?(EquityCampaign)
      
      {
        valuation: @campaign.valuation,
        equity_offered: @campaign.equity_offered,
        minimum_investment: @campaign.minimum_investment,
        maximum_investment: @campaign.maximum_investment,
        shares_available: @campaign.shares_available,
        shares_issued: @campaign.shares_issued,
        price_per_share: @campaign.price_per_share,
        funding_round: @campaign.funding_round,
        total_investors: @campaign.total_investors,
        percentage_raised: @campaign.percentage_raised,
        company_info: {
          name: @campaign.company_name,
          description: @campaign.company_description,
          headquarters: @campaign.company_headquarters,
          website: @campaign.company_website,
          contract_term: @campaign.contract_term
        },
        equity_structure: {
          founder_equity: @campaign.founder_equity_percentage,
          public_equity: @campaign.equity_offered,
          employee_pool: 100 - (@campaign.founder_equity_percentage + @campaign.equity_offered.to_f)
        },
        investment_terms: {
          stock_type: @campaign.stock_type,
          min_shares: @campaign.min_shares,
          max_shares: @campaign.max_shares
        }
      }
    end

    def extract_comprehensive_team_data
      team_members = @campaign.campaign_team_members.includes(:user).map do |member|
        {
          name: member.name,
          role: member.role,
          title: member.title,
          equity_percentage: member.equity_percentage,
          experience: member.description,
          background: extract_member_background(member),
          kyc_status: member.user&.kyc_status_info
        }
      end
      
      {
        team_members: team_members,
        total_members: team_members.size,
        founder_count: team_members.count { |m| m[:role] == 'founder' },
        advisor_count: team_members.count { |m| m[:role] == 'advisor' },
        team_strength: assess_team_strength(team_members)
      }
    end

    def extract_comprehensive_engagement_data
      {
        total_donors: @campaign.total_donors,
        total_investors: @campaign.is_a?(EquityCampaign) ? @campaign.total_investors : 0,
        total_social_media_shares: @campaign.total_social_media_shares,
        updates_count: @campaign.updates.count,
        comments_count: @campaign.comments.count,
        favorites_count: @campaign.favorites.count,
        engagement_velocity: calculate_engagement_velocity,
        backer_retention: calculate_backer_retention
      }
    end

    def extract_community_sentiment
      comments = @campaign.comments.includes(:user).last(50) # Analyze recent comments
      updates = @campaign.updates.last(10)
      
      comment_sentiment = analyze_text_sentiment(comments.map(&:content))
      update_sentiment = analyze_text_sentiment(updates.map(&:content))
      
      {
        comment_analysis: {
          total_comments: comments.size,
          recent_comment_count: comments.size,
          sentiment_score: comment_sentiment[:score],
          sentiment: comment_sentiment[:label],
          key_themes: extract_comment_themes(comments)
        },
        update_analysis: {
          total_updates: updates.size,
          update_frequency: calculate_update_frequency(updates),
          sentiment_score: update_sentiment[:score],
          sentiment: update_sentiment[:label],
          progress_reporting: assess_progress_reporting(updates)
        },
        overall_sentiment: calculate_overall_sentiment(comment_sentiment, update_sentiment)
      }
    end

    def extract_updates_timeline
      updates = @campaign.updates.order(created_at: :desc).limit(20)
      
      updates.map do |update|
        {
          title: update.title,
          content: update.content.truncate(200),
          created_at: update.created_at,
          engagement: {
            likes: 0, # Add if you have likes/reactions
            comments: update.comments_count || 0
          }
        }
      end
    end

    def extract_member_background(member)
      # Extract key information from member description
      description = member.description.to_s.downcase
      {
        has_previous_experience: description.include?('experience') || description.include?('previous'),
        has_industry_background: description.include?('industry') || description.include?('sector'),
        has_education_mention: description.include?('degree') || description.include?('university') || description.include?('education'),
        description_length: description.length,
        key_qualifications: extract_qualifications(description)
      }
    end

    def assess_team_strength(team_members)
      strength_score = 0
      strength_score += 30 if team_members.any? { |m| m[:role] == 'founder' }
      strength_score += 20 if team_members.count { |m| m[:role] == 'advisor' } >= 1
      strength_score += 25 if team_members.any? { |m| m[:background][:has_previous_experience] }
      strength_score += 25 if team_members.any? { |m| m[:background][:has_industry_background] }
      
      case strength_score
      when 80..100 then 'strong'
      when 60..79 then 'adequate'
      else 'weak'
      end
    end

    def analyze_text_sentiment(texts)
      return { score: 0.5, label: 'neutral' } if texts.empty?
      
      # Simple sentiment analysis based on keyword matching
      # In production, you might want to use a proper sentiment analysis service
      positive_words = %w[great amazing excellent awesome love excited happy progress success milestone achievement]
      negative_words = %w[bad terrible awful concern risk warning delay problem issue challenge]
      
      all_text = texts.join(' ').downcase
      positive_count = positive_words.count { |word| all_text.include?(word) }
      negative_count = negative_words.count { |word| all_text.include?(word) }
      total_words = positive_count + negative_count
      
      return { score: 0.5, label: 'neutral' } if total_words.zero?
      
      sentiment_score = positive_count.to_f / total_words
      
      {
        score: sentiment_score,
        label: sentiment_score > 0.6 ? 'positive' : (sentiment_score < 0.4 ? 'negative' : 'neutral')
      }
    end

    def extract_comment_themes(comments)
      themes = Hash.new(0)
      common_themes = %w[support question concern excitement feedback update payment investment equity valuation team product market]
      
      comments.each do |comment|
        common_themes.each do |theme|
          themes[theme] += 1 if comment.content.downcase.include?(theme)
        end
      end
      
      themes.sort_by { |_, count| -count }.first(5).to_h
    end

    def calculate_update_frequency(updates)
      return 'low' if updates.size < 2
      
      days_between_updates = updates.each_cons(2).map do |a, b|
        (a.created_at.to_date - b.created_at.to_date).to_i
      end
      
      avg_days = days_between_updates.sum.to_f / days_between_updates.size
      
      if avg_days <= 7
        'high'
      elsif avg_days <= 14
        'medium'
      else
        'low'
      end
    end

    def assess_progress_reporting(updates)
      progress_indicators = %w[progress milestone update achievement goal reached target completed]
      updates_with_progress = updates.count do |update|
        progress_indicators.any? { |word| update.content.downcase.include?(word) }
      end
      
      progress_ratio = updates_with_progress.to_f / updates.size
      
      case progress_ratio
      when 0.8..1.0 then 'excellent'
      when 0.6..0.79 then 'good'
      when 0.4..0.59 then 'moderate'
      else 'poor'
      end
    end

    def calculate_overall_sentiment(comment_sentiment, update_sentiment)
      avg_score = (comment_sentiment[:score] + update_sentiment[:score]) / 2.0
      
      if avg_score > 0.6
        'positive'
      elsif avg_score < 0.4
        'negative'
      else
        'neutral'
      end
    end

    def calculate_funding_velocity
      return 0 unless @campaign.start_date
      
      days_running = (Date.current - @campaign.start_date.to_date).to_i
      return 0 if days_running.zero?
      
      (@campaign.current_amount.to_f / days_running).round(2)
    end

    def calculate_engagement_velocity
      days_running = (Date.current - @campaign.created_at.to_date).to_i
      return 0 if days_running.zero?
      
      total_engagement = @campaign.comments.count + @campaign.updates.count + @campaign.favorites.count
      (total_engagement.to_f / days_running).round(2)
    end

    def calculate_backer_retention
      return 0 if @campaign.total_donors.zero?
      
      # Simple retention metric - in production you might want more sophisticated analysis
      repeat_backers = 0 # You'd need to calculate this based on your data model
      (repeat_backers.to_f / @campaign.total_donors * 100).round(2)
    end

    def extract_market_context
      {
        category_growth: assess_category_growth(@campaign.category),
        competitive_intensity: assess_competitive_intensity(@campaign.category),
        market_timing: assess_market_timing
      }
    end

    def assess_category_growth(category)
      # Simplified growth assessment - in production, use actual market data
      growth_categories = %w[technology ai blockchain renewable\ energy healthcare]
      declining_categories = %w[traditional\ retail print\ media fossil\ fuels]
      
      if growth_categories.include?(category.downcase)
        'high_growth'
      elsif declining_categories.include?(category.downcase)
        'declining'
      else
        'stable'
      end
    end

    def assess_competitive_intensity(category)
      campaign_count = Campaign.where(category: category)
                              .where('created_at >= ?', 3.months.ago)
                              .count
      
      case campaign_count
      when 0..2 then 'low'
      when 3..5 then 'medium'
      else 'high'
      end
    end

    def assess_market_timing
      # Simplified market timing assessment
      current_quarter = Date.today.month / 4 + 1
      # Q1 and Q4 typically have higher funding activity
      if current_quarter == 1 || current_quarter == 4
        'favorable'
      else
        'neutral'
      end
    end

    def extract_qualifications(description)
      qualifications = []
      qualifications << 'industry_experience' if description.include?('industry') || description.include?('sector')
      qualifications << 'technical_expertise' if description.include?('technical') || description.include?('engineer') || description.include?('developer')
      qualifications << 'business_development' if description.include?('business') || description.include?('sales') || description.include?('marketing')
      qualifications << 'leadership' if description.include?('lead') || description.include?('manager') || description.include?('director') || description.include?('ceo')
      qualifications
    end

    def format_campaign_data(data)
      data.deep_transform_keys { |key| key.to_s.humanize }.to_yaml
    end

    def call_openai_api(prompt)
      Rails.logger.info "Calling OpenAI API with prompt length: #{prompt.length}"
      
      begin
        response = @client.chat(
          parameters: {
            model: "gpt-5",
            messages: [
              { role: "system", content: "You are an expert investment analyst. Always respond with valid JSON. Provide balanced analysis weighing both upside potential and downside risks." },
              { role: "user", content: prompt }
            ],
            max_completion_tokens: 2500,
            response_format: { type: "json_object" }
          }
        )
        
        Rails.logger.info "GPT-5 Mini API response received successfully"
        Rails.logger.info "API Response type: #{response.class}" # Debug logging
        
        # Validate response structure
        if response.nil?
          Rails.logger.error "API returned nil response"
          return nil
        end
        
        # Handle case where API returns simple true/false
        if response == true || response == false
          Rails.logger.error "API returned boolean instead of hash: #{response}"
          return nil
        end
        
        # Ensure response is a hash
        unless response.is_a?(Hash)
          Rails.logger.error "API returned non-hash response: #{response.class} - #{response.inspect}"
          return nil
        end
        
        response
      rescue => e
        Rails.logger.error "GPT-5 Mini API call failed: #{e.message}"
        Rails.logger.error "Backtrace: #{e.backtrace.join("\n")}"
        nil
      end
    end

    def parse_response(response)
      return fallback_analysis("No response from API") if response.nil?
      
      # Safely extract content with proper error handling
      content = if response.is_a?(Hash) && response["choices"] && response["choices"][0] && response["choices"][0]["message"]
                  response["choices"][0]["message"]["content"].to_s.strip
                else
                  Rails.logger.error "Invalid response structure: #{response.inspect}"
                  ""
                end

      # Try to extract valid JSON portion between braces
      json_text = content[/\{.*\}/m] || content

      begin
        parsed_data = JSON.parse(json_text)
        Rails.logger.info "Successfully parsed analysis data"
        parsed_data
      rescue JSON::ParserError => e
        Rails.logger.error "Failed to parse JSON response: #{e.message}"
        Rails.logger.error "Response content: #{content}"
        fallback_analysis(content)
      end
    end

    def fallback_analysis(content)
      Rails.logger.warn "Using fallback analysis due to parsing failure"
      {
        "deal_score" => 50,
        "risk_score" => 50,
        "risk_category" => "medium",
        "upside_potential" => ["Market growth potential", "Strong team background", "Innovative product/service"],
        "downside_risks" => ["Market competition", "Execution risk", "Regulatory challenges"],
        "strengths" => ["Experienced team", "Clear value proposition", "Market need"],
        "recommendations" => ["Conduct due diligence", "Assess market fit", "Review financial projections"],
        "sentiment_analysis" => "neutral",
        "team_assessment" => "adequate",
        "market_opportunity" => "medium",
        "funding_potential" => "medium",
        "timing_assessment" => "average",
        "competitive_advantage" => "moderate",
        "exit_potential" => "medium",
        "scalability_assessment" => "medium",
        "product_market_fit" => "moderate",
        "technology_assessment" => "Standard technology implementation",
        "regulatory_risks" => ["Standard industry regulations", "Compliance requirements"],
        "market_trends" => ["Growing market demand", "Increased competition"],
        "investor_alignment" => "Suitable for moderate risk investors",
        "social_impact" => "Standard social impact for industry",
        "sustainability_score" => 50,
        "analysis_summary" => "Standard analysis due to parsing limitations",
        "investment_thesis" => "Balanced opportunity with moderate risk-reward profile"
      }
    end

    def create_deal_score_log(prompt, response, analysis_data, start_time)
      DealScoreLog.create!(
        campaign: @campaign,
        prompt: prompt,
        response: response.to_json,
        analysis_data: analysis_data,
        deal_score: analysis_data["deal_score"],
        risk_score: analysis_data["risk_score"],
        risk_category: analysis_data["risk_category"],
        key_risks: analysis_data["downside_risks"],
        strengths: analysis_data["strengths"],
        recommendations: analysis_data["recommendations"],
        analysis_type: @analysis_type,
        analyzed_at: start_time,
        metadata: {
          upside_potential: analysis_data["upside_potential"],
          sentiment_analysis: analysis_data["sentiment_analysis"],
          team_assessment: analysis_data["team_assessment"],
          market_opportunity: analysis_data["market_opportunity"],
          investment_thesis: analysis_data["investment_thesis"],
          funding_potential: analysis_data["funding_potential"],
          timing_assessment: analysis_data["timing_assessment"],
          competitive_advantage: analysis_data["competitive_advantage"],
          exit_potential: analysis_data["exit_potential"],
          scalability_assessment: analysis_data["scalability_assessment"],
          product_market_fit: analysis_data["product_market_fit"],
          technology_assessment: analysis_data["technology_assessment"],
          regulatory_risks: analysis_data["regulatory_risks"],
          market_trends: analysis_data["market_trends"],
          investor_alignment: analysis_data["investor_alignment"],
          social_impact: analysis_data["social_impact"],
          sustainability_score: analysis_data["sustainability_score"]
        }
      )
    end

    def generate_embedding
      return nil unless embedding_column_exists?
      
      text = generate_embedding_text
      
      response = @client.embeddings(
        parameters: {
          model: "text-embedding-ada-002",
          input: text
        }
      )
      
      embedding = response.dig("data", 0, "embedding") if response.is_a?(Hash)
      if embedding
        @campaign.update(ai_embedding: embedding)
        return embedding
      end
      
      nil
    end

    def generate_embedding_text
      <<~TEXT
        Campaign: #{@campaign.title}
        Description: #{@campaign.description.to_plain_text}
        Category: #{@campaign.category}
        Type: #{@campaign.class.name}
        Equity: #{@campaign.is_a?(EquityCampaign) ? "Yes" : "No"}
        Goal: #{@campaign.goal_amount} #{@campaign.currency}
        Status: #{@campaign.status}
        Performance: #{@campaign.performance_percentage}%
        Team Size: #{@campaign.campaign_team_members.count}
        Updates: #{@campaign.updates.count}
        Comments: #{@campaign.comments.count}
        Sentiment: #{extract_community_sentiment[:overall_sentiment]}
      TEXT
    end
  end
end