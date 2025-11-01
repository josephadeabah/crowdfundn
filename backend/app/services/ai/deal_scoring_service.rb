# app/services/ai/deal_scoring_service.rb
module AI
  class DealScoringService
    include Rails.application.routes.url_helpers

    def initialize(campaign, analysis_type: 'manual')
      @campaign = campaign
      @analysis_type = analysis_type
      @client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
    end

    def analyze
      start_time = Time.current
      
      begin
        prompt = build_prompt
        response = call_openai_api(prompt)
        analysis_data = parse_response(response)
        
        deal_score_log = create_deal_score_log(prompt, response, analysis_data, start_time)
        deal_score_log.update_campaign_scores
        
        # Generate embedding if available
        generate_embedding if embedding_column_exists?
        
        { success: true, analysis: analysis_data, log: deal_score_log }
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

    def build_prompt
      campaign_data = extract_campaign_data
      
      <<~PROMPT
        You are an expert investment analyst specializing in startup funding and equity campaigns. 
        Analyze this investment opportunity and provide a comprehensive risk assessment and deal scoring.

        CAMPAIGN DATA:
        #{format_campaign_data(campaign_data)}

        ANALYSIS FRAMEWORK:
        1. Deal Score (0-100): Overall investment attractiveness
        2. Risk Score (0-100): Overall risk level (higher = more risky)
        3. Risk Category: low/medium/high/very_high
        4. Key Risks: List 3-5 major risk factors
        5. Strengths: List 3-5 key strengths
        6. Recommendations: List 2-3 actionable recommendations for investors

        RESPONSE FORMAT (JSON only):
        {
          "deal_score": number,
          "risk_score": number,
          "risk_category": "low/medium/high/very_high",
          "key_risks": ["risk1", "risk2", "risk3"],
          "strengths": ["strength1", "strength2", "strength3"],
          "recommendations": ["rec1", "rec2", "rec3"],
          "analysis_summary": "Brief summary of analysis"
        }

        Be objective, data-driven, and focus on investor protection.
      PROMPT
    end

    def extract_campaign_data
      {
        basic_info: {
          title: @campaign.title,
          type: @campaign.class.name,
          status: @campaign.status,
          description: @campaign.description.to_plain_text.truncate(1000),
          category: @campaign.category,
          location: @campaign.location
        },
        financials: {
          goal_amount: @campaign.goal_amount,
          current_amount: @campaign.current_amount,
          transferred_amount: @campaign.transferred_amount,
          performance_percentage: @campaign.performance_percentage,
          currency: @campaign.currency,
          days_remaining: @campaign.remaining_days,
          total_days: @campaign.total_days
        },
        equity_info: extract_equity_data,
        team_info: extract_team_data,
        engagement: {
          total_donors: @campaign.total_donors,
          total_social_media_shares: @campaign.total_social_media_shares,
          updates_count: @campaign.updates.count,
          comments_count: @campaign.comments.count
        },
        fundraiser: {
          experience: extract_fundraiser_experience,
          kyc_status: @campaign.fundraiser.kyc_status_info
        },
        timing: {
          created_at: @campaign.created_at,
          start_date: @campaign.start_date,
          end_date: @campaign.end_date
        }
      }
    end

    def extract_equity_data
      return {} unless @campaign.is_a?(EquityCampaign)
      
      {
        valuation: @campaign.valuation,
        equity_offered: @campaign.equity_offered,
        minimum_investment: @campaign.minimum_investment,
        shares_available: @campaign.shares_available,
        shares_issued: @campaign.shares_issued,
        price_per_share: @campaign.price_per_share,
        funding_round: @campaign.funding_round,
        company_info: {
          name: @campaign.company_name,
          description: @campaign.company_description,
          headquarters: @campaign.company_headquarters
        }
      }
    end

    def extract_team_data
      team_members = @campaign.campaign_team_members.includes(:user).map do |member|
        {
          name: member.name,
          role: member.role,
          equity_percentage: member.equity_percentage,
          experience: member.description
        }
      end
      
      { team_members: team_members, total_members: team_members.size }
    end

    def extract_fundraiser_experience
      fundraiser = @campaign.fundraiser
      {
        total_campaigns: fundraiser.campaigns.count,
        successful_campaigns: fundraiser.campaigns.where(status: 'completed').count,
        total_raised: fundraiser.campaigns.sum(:transferred_amount),
        member_since: fundraiser.created_at
      }
    end

    def format_campaign_data(data)
      data.deep_transform_keys { |key| key.to_s.humanize }.to_yaml
    end

    def call_openai_api(prompt)
      @client.chat(
        parameters: {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are an expert investment analyst. Always respond with valid JSON." },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        }
      )
    end

    def parse_response(response)
      content = response.dig("choices", 0, "message", "content")
      
      begin
        JSON.parse(content)
      rescue JSON::ParserError
        fallback_analysis(content)
      end
    end

    def fallback_analysis(content)
      {
        "deal_score" => 50,
        "risk_score" => 50,
        "risk_category" => "medium",
        "key_risks" => ["Unable to parse AI response"],
        "strengths" => ["Analysis service temporarily unavailable"],
        "recommendations" => ["Wait for system recovery"],
        "analysis_summary" => "Fallback analysis due to parsing error"
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
        key_risks: analysis_data["key_risks"],
        strengths: analysis_data["strengths"],
        recommendations: analysis_data["recommendations"],
        analysis_type: @analysis_type,
        analyzed_at: start_time
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
      
      embedding = response.dig("data", 0, "embedding")
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
      TEXT
    end
  end
end