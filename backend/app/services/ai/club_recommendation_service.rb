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
        # Get comprehensive club profile
        club_profile = build_comprehensive_club_profile
        available_campaigns = find_comprehensive_eligible_campaigns
        
        # DEBUG: Log what campaigns we found
        Rails.logger.info "AI Recommendation - Found #{available_campaigns.count} eligible campaigns for club #{@club.id}"
        available_campaigns.each do |campaign|
          Rails.logger.info "Campaign: #{campaign.id} - #{campaign.title} - Type: #{campaign.class.name}"
        end
        
        if available_campaigns.any?
          # Use enhanced AI-powered matching with comprehensive data
          recommendations = enhanced_ai_powered_recommendations(available_campaigns, club_profile, limit)
        else
          # Enhanced rule-based matching as fallback
          recommendations = enhanced_rule_based_recommendations(available_campaigns, club_profile, limit)
        end

        # DEBUG: Log final recommendations
        Rails.logger.info "AI Recommendation - Final #{recommendations.count} recommendations"
        recommendations.each do |rec|
          Rails.logger.info "Recommended: #{rec[:campaign].id} - #{rec[:campaign].title} - Score: #{rec[:match_score]}"
        end

        {
          success: true,
          recommendations: recommendations,
          matching_criteria: {
            risk_tolerance: club_profile[:risk_tolerance],
            investment_focus: club_profile[:investment_focus],
            mission_alignment: club_profile[:mission_alignment],
            financial_constraints: club_profile[:financial_constraints]
          },
          total_considered: available_campaigns.count,
          club_risk_profile: club_profile.slice(:risk_tolerance, :investment_focus, :mission_alignment, :financial_constraints)
        }
      rescue => e
        Rails.logger.error "AI Club Recommendation failed for club #{@club.id}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
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
        club_profile = build_comprehensive_club_profile
        campaign_analysis = get_comprehensive_campaign_analysis(campaign)
        
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
      club_profile = build_comprehensive_club_profile
      club_profile.slice(:risk_tolerance, :investment_focus, :mission_alignment, :member_preferences, :financial_constraints)
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

    def build_comprehensive_club_profile
      {
        name: @club.name,
        mission: @club.mission,
        investment_focus: extract_investment_focus,
        risk_tolerance: calculate_enhanced_risk_tolerance,
        mission_alignment: extract_mission_alignment,
        historical_investments: analyze_historical_investments,
        member_preferences: analyze_member_preferences,
        financial_constraints: {
          min_contribution: @club.minimum_monthly_contribution,
          current_balance: @club.current_balance,
          average_investment: calculate_average_investment,
          max_single_investment: calculate_max_single_investment
        },
        member_demographics: analyze_member_demographics,
        investment_preferences: extract_investment_preferences
      }
    end

    def find_comprehensive_eligible_campaigns
      campaigns = Campaign.active
                          .where(is_public: true)
                          .where(appear_in_search_results: true)
                          .where.not(status: 'canceled')
                          .includes(
                            :fundraiser,
                            :campaign_team_members,
                            :reports,
                            fundraiser: [:latest_kyc, :reports_against]
                          )
      
      Rails.logger.info "Base comprehensive query found: #{campaigns.count} campaigns"
      
      # Apply enhanced filters one by one with debugging
      campaigns = enhanced_filter_by_investment_focus(campaigns)
      Rails.logger.info "After investment focus filter: #{campaigns.count} campaigns"
      
      campaigns = enhanced_filter_by_risk_tolerance(campaigns)
      Rails.logger.info "After risk tolerance filter: #{campaigns.count} campaigns"
      
      campaigns = enhanced_filter_by_financial_constraints(campaigns)
      Rails.logger.info "After financial constraints filter: #{campaigns.count} campaigns"
      
      campaigns = filter_by_fundraiser_trustworthiness(campaigns)
      Rails.logger.info "After fundraiser trustworthiness filter: #{campaigns.count} campaigns"
      
      campaigns = filter_by_campaign_quality(campaigns)
      Rails.logger.info "After campaign quality filter: #{campaigns.count} campaigns"
      
      # Handle both arrays and relations
      if campaigns.is_a?(ActiveRecord::Relation)
        campaigns.order(created_at: :desc)
      else
        campaigns.sort_by(&:created_at).reverse
      end
    end
    
    def enhanced_filter_by_investment_focus(campaigns)
      focus = extract_investment_focus
      return campaigns unless focus
      
      # Use comprehensive category matching based on all available categories
      case focus
      when 'technology'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%tech%', '%software%', '%ai%', '%artificial intelligence%', '%machine learning%', 
          '%blockchain%', '%crypto%', '%digital%', '%innovation%', '%saas%', '%cloud%',
          '%iot%', '%cyber%', '%data%', '%developer%', '%enterprise%', '%augmented%',
          '%virtual reality%', '%quantum%', '%robotics%', '%hardware%', '%microchip%',
          '%voice%', '%open source%', '%b2b%', '%digital media%', '%social network%',
          '%consumer app%', '%creator%', '%future of work%', '%gaming%'])
      when 'real_estate'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%real estate%', '%property%', '%housing%', '%commercial%', '%residential%',
          '%proptech%', '%urban development%', '%smart cities%', '%green architecture%',
          '%housing and homelessness%'])
      when 'renewable_energy'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%energy%', '%renewable%', '%solar%', '%wind%', '%clean%', '%green%', '%sustainability%',
          '%climate%', '%carbon%', '%environment%', '%greentech%'])
      when 'healthcare'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%health%', '%medical%', '%healthcare%', '%biotech%', '%pharma%', '%wellness%',
          '%digital health%', '%healthtech%', '%femtech%', '%community health%', '%public health%',
          '%elderly%', '%disability%', '%crisis%', '%humanitarian%'])
      when 'financial_services'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%finance%', '%fintech%', '%banking%', '%investment%', '%insurance%', '%insurtech%',
          '%financial literacy%', '%impact investing%', '%micro-investing%', '%payments%',
          '%personal finance%', '%digital banking%', '%crowdfunding%'])
      when 'education'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%education%', '%edtech%', '%access to education%', '%digital literacy%',
          '%innovation in education%', '%youth development%', '%arts education%'])
      when 'agriculture'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%agriculture%', '%agtech%', '%sustainable agriculture%', '%organic farming%',
          '%local farmers%', '%food security%', '%forestry%', '%rural development%',
          '%urban farming%', '%marine%'])
      when 'social_impact'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%social impact%', '%charity%', '%community empowerment%', '%community support%',
          '%poverty%', '%gender%', '%women%', '%veterans%', '%family%', '%peer support%',
          '%social enterprise%', '%civic%', '%public safety%', '%disaster%'])
      when 'environmental'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%environmental%', '%clean water%', '%water and sanitation%', '%plastic%',
          '%wildlife%', '%animal%', '%eco-tourism%', '%marine%'])
      when 'transportation'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%transport%', '%mobility%', '%sustainable transport%', '%public transport%',
          '%logistics%', '%traveltech%', '%smart cities%'])
      when 'consumer_goods'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%retail%', '%consumer%', '%product%', '%brand%', '%ecommerce%', '%retail tech%',
          '%marketplaces%', '%foodtech%', '%wearables%'])
      when 'industrial'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%industrial%', '%industrial tech%', '%supply chain%', '%manufacturing%', '%space%'])
      when 'arts_culture'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%arts%', '%culture%', '%arts and culture%', '%cultural%', '%honor%', '%memorial%'])
      when 'sports_recreation'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%sports%', '%recreation%', '%sports and recreation%', '%sportstech%'])
      when 'government'
        campaigns.where("category ILIKE ANY (array[?])", 
          ['%govtech%', '%public sector%', '%civic%', '%economic development%'])
      else
        campaigns
      end
    end

    def enhanced_filter_by_risk_tolerance(campaigns)
      tolerance = calculate_enhanced_risk_tolerance
      
      # More nuanced risk filtering that considers multiple factors
      case tolerance
      when 'conservative'
        campaigns.where("ai_risk_score <= 35 OR ai_risk_score IS NULL")
      when 'aggressive'
        campaigns.where("ai_risk_score >= 55 OR ai_risk_score IS NULL")
      else # moderate
        campaigns.where("(ai_risk_score BETWEEN 25 AND 65) OR ai_risk_score IS NULL")
      end
    end

    def enhanced_filter_by_financial_constraints(campaigns)
      current_balance = @club.current_balance.to_f
      
      # More flexible financial constraints
      if current_balance > 0
        # Allow investments up to 50% of club balance for good opportunities
        max_investment = current_balance * 0.5
        campaigns.where("goal_amount <= ? OR current_amount >= goal_amount * 0.7", max_investment)
      else
        campaigns
      end
    end

    def filter_by_fundraiser_trustworthiness(campaigns)
      # Convert to array first since we're doing complex filtering
      campaign_array = campaigns.to_a
      
      campaign_array.select do |campaign|
        fundraiser = campaign.fundraiser
        next false unless fundraiser
        
        # Check for KYC verification
        next false unless fundraiser.kyc_verified?
        
        # Check for recent reports against fundraiser
        recent_reports = fundraiser.reports_against
                                  .where('created_at >= ?', 6.months.ago)
                                  .where(status: ['pending', 'under_review', 'resolved'])
        
        # Allow campaigns if reports are minimal or resolved favorably
        recent_reports.count < 3
      end
    end

    def filter_by_campaign_quality(campaigns)
      # Convert to array for complex filtering
      campaign_array = campaigns.to_a
      
      campaign_array.select do |campaign|
        # Basic quality checks
        next false if campaign.description.blank?
        next false if campaign.goal_amount.to_f <= 0
        
        # For equity campaigns, additional checks
        if campaign.is_a?(EquityCampaign)
          next false unless campaign.equity_status.in?(%w[approved live])
          next false if campaign.shares_available.to_f <= 0
          next false if campaign.valuation.to_f <= 0
        end
        
        true
      end
    end

    def enhanced_ai_powered_recommendations(campaigns, club_profile, limit)
      # Use OpenAI with comprehensive campaign data
      prompt = build_comprehensive_recommendation_prompt(campaigns, club_profile, limit)
      response = call_openai_api(prompt)
      
      parsed_recommendations = parse_recommendation_response(response, campaigns)
      
      # Fallback if AI parsing fails
      if parsed_recommendations.empty?
        enhanced_rule_based_recommendations(campaigns, club_profile, limit)
      else
        parsed_recommendations
      end
    end

    def enhanced_rule_based_recommendations(campaigns, club_profile, limit)
      scored_campaigns = campaigns.map do |campaign|
        {
          campaign: campaign,
          match_score: calculate_enhanced_match_score(campaign, club_profile),
          reasoning: generate_enhanced_reasoning(campaign, club_profile),
          key_alignment_factors: identify_enhanced_alignment_factors(campaign, club_profile),
          potential_concerns: identify_potential_concerns(campaign)
        }
      end
      
      scored_campaigns.sort_by { |rec| -rec[:match_score] }.first(limit)
    end

    def calculate_enhanced_match_score(campaign, club_profile)
      score = 0
      max_score = 100
      
      # Calculate performance percentage
      performance_percentage = calculate_performance_percentage(campaign)
      
      # 1. Risk alignment (20 points)
      risk_score = campaign.ai_risk_score || 50
      club_risk = case club_profile[:risk_tolerance]
                  when 'conservative' then 25
                  when 'aggressive' then 65
                  else 45
                  end
      
      risk_diff = (risk_score - club_risk).abs
      score += [20 - (risk_diff / 3), 0].max
      
      # 2. Category alignment (15 points)
      if club_profile[:investment_focus] && 
         campaign.category&.downcase&.include?(club_profile[:investment_focus].to_s)
        score += 15
      end
      
      # 3. Financial fit (15 points)
      club_balance = @club.current_balance.to_f
      if club_balance > 0
        if campaign.goal_amount <= club_balance * 0.3
          score += 15
        elsif campaign.goal_amount <= club_balance * 0.6
          score += 10
        elsif campaign.goal_amount <= club_balance
          score += 5
        end
      end
      
      # 4. Performance potential (15 points)
      if campaign.ai_deal_score && campaign.ai_deal_score >= 80
        score += 15
      elsif performance_percentage >= 70
        score += 12
      elsif performance_percentage >= 40
        score += 8
      elsif performance_percentage >= 20
        score += 5
      end
      
      # 5. Mission alignment (10 points)
      score += 10 if check_enhanced_mission_alignment(campaign, club_profile)
      
      # 6. Fundraiser trustworthiness (10 points)
      score += calculate_fundraiser_trust_score(campaign.fundraiser)
      
      # 7. Campaign quality (10 points)
      score += calculate_campaign_quality_score(campaign)
      
      # 8. Team strength (5 points)
      score += calculate_team_strength_score(campaign)
      
      score
    end

    def calculate_fundraiser_trust_score(fundraiser)
      return 0 unless fundraiser
      
      score = 0
      
      # KYC verification (4 points)
      score += 4 if fundraiser.kyc_verified?
      
      # No recent reports (3 points)
      recent_reports = fundraiser.reports_against
                                .where('created_at >= ?', 6.months.ago)
                                .where(status: ['pending', 'under_review'])
      score += 3 if recent_reports.empty?
      
      # Successful campaign history (3 points)
      successful_campaigns = fundraiser.campaigns.where(status: 'completed')
      score += [successful_campaigns.count, 3].min
      
      score
    end

    def calculate_campaign_quality_score(campaign)
      score = 0
      
      # Comprehensive description (3 points)
      score += 3 if campaign.description.present? && campaign.description.to_plain_text.length > 200
      
      # Media attached (2 points)
      score += 2 if campaign.media_attached?
      
      # Regular updates (2 points)
      score += 2 if campaign.updates.any?
      
      # For equity campaigns - additional quality checks
      if campaign.is_a?(EquityCampaign)
        score += 2 if campaign.campaign_team_members.any?
        score += 1 if campaign.offering_documents_present?
      end
      
      score
    end

    def calculate_team_strength_score(campaign)
      return 0 unless campaign.campaign_team_members.any?
      
      team_members = campaign.campaign_team_members
      founder_count = team_members.where(role: 'founder').count
      experienced_members = team_members.where.not(experience: nil).count
      
      [founder_count + experienced_members, 5].min
    end

    def check_enhanced_mission_alignment(campaign, club_profile)
      mission_text = "#{campaign.title} #{campaign.description} #{campaign.try(:company_description)}".downcase
      club_mission_keywords = club_profile[:mission_alignment].keys
      
      club_mission_keywords.any? { |keyword| mission_text.include?(keyword.to_s) }
    end

    def identify_potential_concerns(campaign)
      concerns = []
      
      # Fundraiser concerns
      fundraiser = campaign.fundraiser
      if fundraiser
        concerns << "Fundraiser has recent reports" if fundraiser.reports_against.recent.exists?
        concerns << "Fundraiser KYC not verified" unless fundraiser.kyc_verified?
      end
      
      # Campaign concerns
      concerns << "Low performance percentage" if campaign.performance_percentage < 20
      concerns << "No AI analysis available" unless campaign.ai_analysis_present?
      
      # Equity campaign specific concerns
      if campaign.is_a?(EquityCampaign)
        concerns << "Limited shares available" if campaign.shares_available.to_f < campaign.total_shares.to_f * 0.1
        concerns << "High valuation" if campaign.valuation.to_f > 10_000_000
      end
      
      concerns
    end

    def build_comprehensive_recommendation_prompt(campaigns, club_profile, limit)
      campaigns_data = campaigns.map do |campaign|
        campaign_analysis = get_comprehensive_campaign_analysis(campaign)
        {
          id: campaign.id,
          title: campaign.title,
          category: campaign.category,
          type: campaign.class.name,
          description: campaign.description.to_plain_text.truncate(300),
          goal_amount: campaign.goal_amount,
          current_amount: campaign.current_amount,
          performance_percentage: campaign.performance_percentage,
          ai_deal_score: campaign.ai_deal_score,
          ai_risk_score: campaign.ai_risk_score,
          ai_risk_category: campaign.ai_risk_category,
          location: campaign.location,
          fundraiser: {
            id: campaign.fundraiser.id,
            name: campaign.fundraiser.full_name,
            kyc_verified: campaign.fundraiser.kyc_verified?,
            kyc_status: campaign.fundraiser.latest_kyc&.status,
            reports_count: campaign.fundraiser.reports_against.recent.count
          },
          team_strength: campaign_analysis[:team_strength],
          market_opportunity: campaign_analysis[:market_opportunity],
          trust_score: campaign_analysis[:trust_score],
          # Equity campaign specific data
          equity_data: campaign.is_a?(EquityCampaign) ? {
            valuation: campaign.valuation,
            equity_offered: campaign.equity_offered,
            shares_available: campaign.shares_available,
            equity_status: campaign.equity_status,
            company_name: campaign.company_name,
            funding_round: campaign.funding_round
          } : nil
        }
      end
      
      <<~PROMPT
        You are an expert investment advisor for investment clubs. Recommend the best campaigns for this club based on their comprehensive profile and the detailed campaign data.

        CLUB PROFILE:
        - Name: #{club_profile[:name]}
        - Mission: #{club_profile[:mission]}
        - Investment Focus: #{club_profile[:investment_focus]}
        - Risk Tolerance: #{club_profile[:risk_tolerance]}
        - Current Balance: $#{@club.current_balance}
        - Member Count: #{club_profile[:member_preferences][:total_members]}
        - Mission Alignment Themes: #{club_profile[:mission_alignment].keys.join(', ')}
        - Financial Constraints: #{club_profile[:financial_constraints]}

        COMPREHENSIVE CAMPAIGN DATA:
        #{campaigns_data.to_json}

        Please recommend the top #{limit} campaigns that best match this club's profile. Consider these factors:
        1. Risk tolerance alignment (AI risk scores, performance history)
        2. Investment focus matching (category, industry alignment)  
        3. Mission alignment with club's stated values
        4. Financial suitability (goal amount vs club balance)
        5. Fundraiser trustworthiness (KYC status, report history)
        6. Campaign quality (team strength, documentation, updates)
        7. Growth potential and market opportunity
        8. For equity campaigns: valuation, equity structure, funding round

        Pay special attention to:
        - Fundraisers with verified KYC and clean report history
        - Campaigns with strong performance metrics
        - Teams with relevant experience
        - Campaigns that align with the club's mission keywords: #{club_profile[:mission_alignment].keys.join(', ')}

        RESPONSE FORMAT (JSON only):
        {
          "recommendations": [
            {
              "campaign_id": number,
              "match_score": number (0-100),
              "reasoning": "Comprehensive explanation covering risk, alignment, trustworthiness, and potential",
              "key_alignment_factors": ["factor1", "factor2", "factor3", "factor4"],
              "potential_concerns": ["concern1", "concern2"],
              "investment_confidence": "high/medium/low"
            }
          ]
        }

        Be objective and focus on long-term value creation while considering risk management and trust factors.
      PROMPT
    end

    def get_comprehensive_campaign_analysis(campaign)
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
        sentiment: campaign.ai_sentiment,
        trust_score: calculate_fundraiser_trust_score(campaign.fundraiser),
        fundraiser: {
          kyc_verified: campaign.fundraiser&.kyc_verified?,
          kyc_status: campaign.fundraiser&.latest_kyc&.status,
          reports_count: campaign.fundraiser&.reports_against&.recent&.count || 0
        },
        # Equity campaign specific
        equity_data: campaign.is_a?(EquityCampaign) ? {
          valuation: campaign.valuation,
          equity_offered: campaign.equity_offered,
          shares_available: campaign.shares_available,
          equity_status: campaign.equity_status,
          company_name: campaign.company_name,
          funding_round: campaign.funding_round
        } : nil
      }
    end

    def calculate_enhanced_risk_tolerance
      # More sophisticated risk assessment
      investments = @club.club_investments.executed
      
      if investments.any?
        # Consider both AI risk scores and actual performance
        avg_risk_score = investments.joins(:campaign)
                                  .where.not(campaigns: { ai_risk_score: nil })
                                  .average('campaigns.ai_risk_score')
                                  .to_f
        
        success_rate = calculate_investment_success_rate(investments)
        
        # Combine risk score with success rate for better assessment
        if avg_risk_score > 0
          adjusted_risk = (avg_risk_score + (100 - success_rate)) / 2
          
          case adjusted_risk
          when 0..35 then 'conservative'
          when 36..65 then 'moderate'
          else 'aggressive'
          end
        else
          'moderate'
        end
      else
        # For new clubs, consider member composition and stated mission
        assess_enhanced_member_risk_profile
      end
    end

    def assess_enhanced_member_risk_profile
      # More sophisticated assessment
      active_members = @club.investment_club_memberships.active.count
      mission_text = @club.mission.to_s.downcase
      
      # Check mission for risk indicators
      if mission_text.include?('conservative') || mission_text.include?('stable')
        'conservative'
      elsif mission_text.include?('aggressive') || mission_text.include?('high growth')
        'aggressive'
      else
        'moderate'
      end
    end

    def analyze_member_demographics
      {
        total_members: @club.current_members_count,
        active_members: @club.investment_club_memberships.active.count,
        average_age: calculate_average_member_age,
        geographic_distribution: calculate_geographic_distribution
      }
    end

    def calculate_average_member_age
      # This is a placeholder - you might need to add age/birth_date to User model
      # For now, return a default value
      35
    end

    def calculate_geographic_distribution
      # This is a placeholder - you might need to add location data to users
      # For now, return a default value
      { "Unknown" => @club.current_members_count }
    end

    def extract_investment_preferences
      mission_text = @club.mission.to_s.downcase
      
      preferences = {
        early_stage: mission_text.include?('early') || mission_text.include?('startup'),
        growth_stage: mission_text.include?('growth') || mission_text.include?('scale'),
        impact_investing: mission_text.include?('impact') || mission_text.include?('social'),
        tech_focused: mission_text.include?('tech') || mission_text.include?('innovation')
      }
      
      preferences.select { |_, value| value }
    end

    def calculate_max_single_investment
      current_balance = @club.current_balance.to_f
      # Conservative approach - max 25% of balance in one investment
      current_balance * 0.25
    end

    def extract_investment_focus
      focus_keywords = {
        'technology' => [
          'tech', 'software', 'ai', 'artificial intelligence', 'machine learning', 'blockchain', 
          'crypto', 'digital', 'innovation', 'developer tools', 'enterprise software', 'saas',
          'cloud computing', 'iot', 'internet of things', 'cybersecurity', 'data analytics',
          'augmented reality', 'virtual reality', 'quantum computing', 'robotics', 'hardware',
          'microchip', 'voice technology', 'open source', 'b2b software', 'digital media',
          'social networking', 'consumer apps', 'creator economy', 'future of work', 'gaming'
        ],
        'real_estate' => [
          'property', 'real estate', 'housing', 'commercial', 'residential', 'proptech',
          'urban development', 'smart cities', 'green architecture', 'housing and homelessness'
        ],
        'renewable_energy' => [
          'solar', 'wind', 'renewable', 'green energy', 'sustainability', 'clean energy',
          'energy efficiency', 'climate tech', 'greentech', 'carbon footprint reduction',
          'climate change', 'environment', 'environmental justice'
        ],
        'healthcare' => [
          'health', 'medical', 'biotech', 'pharmaceutical', 'wellness', 'digital health',
          'healthtech', 'femtech', 'community health', 'public health', 'elderly care',
          'disability support', 'crisis response', 'humanitarian aid'
        ],
        'financial_services' => [
          'fintech', 'banking', 'finance', 'investment', 'insurance', 'insurtech',
          'financial literacy', 'impact investing', 'micro-investing', 'payments',
          'personal finance', 'digital banking', 'crowdfunding platforms'
        ],
        'education' => [
          'education', 'edtech', 'access to education', 'digital literacy', 
          'innovation in education', 'youth development', 'arts education'
        ],
        'agriculture' => [
          'agriculture', 'agtech', 'sustainable agriculture', 'organic farming',
          'local farmers support', 'food security', 'forestry management', 'rural development',
          'urban farming', 'marine conservation'
        ],
        'social_impact' => [
          'social impact', 'charity', 'community empowerment', 'community support',
          'poverty reduction', 'gender equality', "women's empowerment", 'veterans support',
          'family services', 'peer support', 'social enterprise', 'civic engagement',
          'public safety', 'disaster preparedness'
        ],
        'environmental' => [
          'environmental', 'clean water', 'water and sanitation', 'plastic recycling',
          'wildlife conservation', 'animal welfare', 'eco-tourism', 'marine conservation'
        ],
        'transportation' => [
          'transport', 'mobility', 'sustainable transport', 'public transport', 'logistics',
          'traveltech', 'smart cities'
        ],
        'consumer_goods' => [
          'retail', 'consumer', 'product', 'brand', 'ecommerce', 'retail tech', 'marketplaces',
          'foodtech', 'wearables'
        ],
        'industrial' => [
          'industrial', 'industrial tech', 'supply chain tech', 'manufacturing', 'space tech'
        ],
        'arts_culture' => [
          'arts', 'culture', 'arts and culture', 'cultural preservation', 'honor memorial'
        ],
        'sports_recreation' => [
          'sports', 'recreation', 'sports and recreation', 'sportstech'
        ],
        'government' => [
          'govtech', 'public sector', 'civic engagement', 'economic development'
        ]
      }
      
      # Use only mission since description doesn't exist on InvestmentClub
      text = @club.mission.to_s.downcase
      matches = focus_keywords.map do |sector, keywords|
        matches = keywords.count { |keyword| text.include?(keyword.downcase) }
        [sector, matches]
      end.to_h
      
      primary_focus = matches.max_by { |_, count| count }
      primary_focus[0] if primary_focus && primary_focus[1] > 0
    end

    def extract_mission_alignment
      # Extract key mission themes for alignment scoring
      mission_text = @club.mission.to_s.downcase
      
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

    def calculate_investment_success_rate(investments)
      return 0 unless investments.any?
      
      # Simple success metric based on campaign performance
      successful_investments = investments.joins(:campaign)
                                         .where('campaigns.performance_percentage >= ?', 80)
                                         .count
      
      (successful_investments.to_f / investments.count * 100).round(2)
    end

    def analyze_member_preferences
      {
        total_members: @club.current_members_count,
        average_contribution: @club.investment_club_contributions.completed.average(:amount).to_f,
        engagement_level: calculate_engagement_level
      }
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

    def calculate_average_investment
      investments = @club.club_investments.executed
      investments.any? ? investments.average(:investment_amount).to_f : 0
    end

    def generate_enhanced_reasoning(campaign, club_profile)
      factors = []
      
      factors << "matches your #{club_profile[:investment_focus]} focus" if club_profile[:investment_focus]
      factors << "aligns with your #{club_profile[:risk_tolerance]} risk profile"
      factors << "fits within your club's investment capacity"
      factors << "has a verified and trustworthy fundraiser" if campaign.fundraiser&.kyc_verified?
      factors << "shows strong performance momentum" if campaign.performance_percentage >= 50
      
      "This campaign #{factors.join(', ')}."
    end

    def identify_enhanced_alignment_factors(campaign, club_profile)
      factors = []
      
      factors << "risk_tolerance" if campaign.ai_risk_score && 
                                    ((club_profile[:risk_tolerance] == 'conservative' && campaign.ai_risk_score <= 35) ||
                                     (club_profile[:risk_tolerance] == 'aggressive' && campaign.ai_risk_score >= 55) ||
                                     (club_profile[:risk_tolerance] == 'moderate' && campaign.ai_risk_score.between?(25, 65)))
      
      factors << "investment_focus" if club_profile[:investment_focus] && 
                                      campaign.category&.downcase&.include?(club_profile[:investment_focus].to_s)
      
      factors << "financial_fit" if @club.current_balance.to_f >= campaign.goal_amount * 0.2
      factors << "mission_alignment" if check_enhanced_mission_alignment(campaign, club_profile)
      factors << "trustworthy_fundraiser" if campaign.fundraiser&.kyc_verified? && campaign.fundraiser.reports_against.recent.empty?
      factors << "strong_performance" if campaign.performance_percentage >= 60
      
      factors
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
        4. Fundraiser trustworthiness and track record
        5. Key strengths and potential concerns
        6. How it compares to the club's historical investments
        
        Format the response as a compelling investment rationale that club members would understand.
        
        RESPONSE FORMAT (JSON only):
        {
          "explanation": "Comprehensive explanation text",
          "alignment_summary": {
            "risk_alignment": "high/medium/low",
            "strategic_fit": "high/medium/low", 
            "financial_fit": "high/medium/low",
            "trust_score": "high/medium/low"
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
            potential_concerns: rec["potential_concerns"] || [],
            investment_confidence: rec["investment_confidence"] || "medium"
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

    def calculate_club_alignment(club_profile, campaign_analysis)
      {
        risk: calculate_risk_alignment(club_profile[:risk_tolerance], campaign_analysis[:ai_risk_score]),
        strategic: calculate_strategic_alignment(club_profile, campaign_analysis),
        financial: calculate_financial_alignment(club_profile, campaign_analysis),
        trust: calculate_trust_alignment(campaign_analysis[:trust_score])
      }
    end

    def calculate_risk_alignment(club_risk_tolerance, campaign_risk_score)
      return "unknown" unless campaign_risk_score
      
      case club_risk_tolerance
      when 'conservative'
        campaign_risk_score <= 35 ? "high" : (campaign_risk_score <= 55 ? "medium" : "low")
      when 'moderate'
        campaign_risk_score.between?(25, 65) ? "high" : (campaign_risk_score.between?(15, 75) ? "medium" : "low")
      when 'aggressive'
        campaign_risk_score >= 55 ? "high" : (campaign_risk_score >= 35 ? "medium" : "low")
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

    def calculate_trust_alignment(trust_score)
      case trust_score
      when 8..10 then "high"
      when 5..7 then "medium"
      else "low"
      end
    end

    def extract_key_factors(club_profile, campaign_analysis)
      factors = []
      
      factors << "Risk profile match" if calculate_risk_alignment(club_profile[:risk_tolerance], campaign_analysis[:ai_risk_score]) == "high"
      factors << "Strategic focus alignment" if calculate_strategic_alignment(club_profile, campaign_analysis) == "high"
      factors << "Strong deal quality" if campaign_analysis[:ai_deal_score].to_i >= 70
      factors << "Good market timing" if campaign_analysis[:performance_percentage].to_i >= 50
      factors << "Trustworthy fundraiser" if campaign_analysis[:trust_score].to_i >= 7
      
      factors
    end

    def generate_fallback_explanation(campaign)
      return "Unable to generate detailed analysis at this time." unless campaign
      
      "This #{campaign.category} campaign aligns with your club's investment strategy and represents a compelling opportunity based on current market conditions and the campaign's performance metrics."
    end
  end
end