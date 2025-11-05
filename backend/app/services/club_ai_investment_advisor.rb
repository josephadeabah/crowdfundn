# app/services/club_ai_investment_advisor.rb
module AI
  class ClubInvestmentAdvisor
    def initialize(investment_club, campaign)
      @club = investment_club
      @campaign = campaign
    end

    def generate_investment_recommendation
      # Get AI analysis of the campaign using your existing service
      ai_analysis = ::AI::DealScoringService.analyze_campaign(@campaign)
      
      return { success: false, error: 'AI analysis failed' } unless ai_analysis[:success]

      analysis = ai_analysis[:analysis]
      
      # Match against club's investment focus and risk profile
      compatibility_score = calculate_compatibility_score(analysis)
      recommendation = generate_recommendation(analysis, compatibility_score)
      
      {
        success: true,
        recommendation: recommendation,
        ai_analysis: analysis,
        compatibility_score: compatibility_score,
        club_fit: assess_club_fit(analysis)
      }
    end

    def generate_voting_insights(voting_session_id)
      votes = Vote.where(votable_type: 'ClubInvestment', voting_session_id: voting_session_id)
      vote_breakdown = votes.group(:vote_type).count
      
      # Analyze voting patterns and provide insights
      insights = {
        total_votes: votes.count,
        vote_distribution: vote_breakdown,
        participation_rate: calculate_participation_rate(votes),
        key_concerns: extract_voting_concerns(votes),
        sentiment_analysis: analyze_voting_sentiment(votes)
      }
      
      # Compare with AI recommendation
      ai_recommendation = generate_investment_recommendation
      if ai_recommendation[:success]
        insights[:ai_alignment] = calculate_ai_alignment(vote_breakdown, ai_recommendation[:recommendation])
      end
      
      insights
    end

    private

    def calculate_compatibility_score(analysis)
      score = 0
      
      # Align with club's investment focus
      if @club.investment_focus.present?
        focus_keywords = extract_focus_keywords(@club.investment_focus)
        campaign_description = @campaign.description.to_plain_text.downcase
        
        focus_match = focus_keywords.count { |keyword| campaign_description.include?(keyword) }
        score += (focus_match.to_f / focus_keywords.count * 30) # 30% weight
      end
      
      # Risk profile alignment (clubs might be more risk-averse)
      risk_score = analysis['risk_score'].to_f
      if risk_score <= 30
        score += 40 # Low risk - high compatibility
      elsif risk_score <= 60
        score += 25 # Medium risk - moderate compatibility
      else
        score += 10 # High risk - low compatibility
      end
      
      # Deal quality (using your existing AI deal score)
      deal_score = analysis['deal_score'].to_f
      score += (deal_score * 0.3) # 30% weight
      
      score.round(2)
    end

    def generate_recommendation(analysis, compatibility_score)
      deal_score = analysis['deal_score'].to_f
      risk_score = analysis['risk_score'].to_f
      
      if compatibility_score >= 70 && deal_score >= 75 && risk_score <= 40
        {
          action: 'strong_invest',
          confidence: 'high',
          reasoning: "High compatibility with club focus, strong deal quality, and acceptable risk profile",
          suggested_amount: calculate_suggested_amount
        }
      elsif compatibility_score >= 50 && deal_score >= 60 && risk_score <= 60
        {
          action: 'consider_invest',
          confidence: 'medium',
          reasoning: "Moderate compatibility and deal quality, evaluate risks carefully",
          suggested_amount: calculate_suggested_amount(0.5) # Half of max
        }
      else
        {
          action: 'avoid_invest',
          confidence: 'high',
          reasoning: "Low compatibility, poor deal quality, or high risk detected",
          suggested_amount: 0
        }
      end
    end

    def calculate_suggested_amount(multiplier = 1.0)
      # Suggest investment amount based on club balance and campaign
      max_per_investment = @club.current_balance * 0.2 # Max 20% of balance per investment
      campaign_appropriate = [@campaign.goal_amount * 0.05, max_per_investment].min # Max 5% of campaign goal
      
      (campaign_appropriate * multiplier).round(2)
    end

    def extract_focus_keywords(investment_focus)
      case investment_focus.downcase
      when 'climate' then ['climate', 'environment', 'sustainable', 'green', 'renewable']
      when 'technology' then ['tech', 'software', 'ai', 'blockchain', 'innovation']
      when 'agriculture' then ['agriculture', 'farming', 'food', 'agritech', 'sustainable']
      when 'healthcare' then ['health', 'medical', 'healthcare', 'biotech', 'wellness']
      else investment_focus.downcase.split(' ')
      end
    end

    def assess_club_fit(analysis)
      {
        focus_alignment: calculate_focus_alignment(analysis),
        risk_alignment: calculate_risk_alignment(analysis),
        deal_quality: analysis['deal_score'],
        team_assessment: analysis['team_assessment'],
        market_opportunity: analysis['market_opportunity']
      }
    end

    def calculate_focus_alignment(analysis)
      # Implementation depends on how focus is stored and matched
      75.0 # Placeholder
    end

    def calculate_risk_alignment(analysis)
      risk_score = analysis['risk_score'].to_f
      # Clubs typically more risk-averse than individual investors
      if risk_score <= 30
        'excellent'
      elsif risk_score <= 50
        'good'
      elsif risk_score <= 70
        'moderate'
      else
        'poor'
      end
    end

    def calculate_participation_rate(votes)
      total_members = @club.active_members.count
      return 0 if total_members.zero?
      
      (votes.distinct.count(:user_id).to_f / total_members * 100).round(2)
    end

    def extract_voting_concerns(votes)
      concerns = votes.where.not(reason: [nil, '']).pluck(:reason)
      # Simple keyword extraction for common concerns
      concern_keywords = {
        'risk' => concerns.count { |r| r.downcase.include?('risk') },
        'valuation' => concerns.count { |r| r.downcase.include?('valuation') },
        'team' => concerns.count { |r| r.downcase.include?('team') },
        'market' => concerns.count { |r| r.downcase.include?('market') }
      }
      
      concern_keywords.select { |_, count| count > 0 }
    end

    def analyze_voting_sentiment(votes)
      positive_votes = votes.where(vote_type: ['invest', 'yes']).count
      total_votes = votes.count
      
      return 'neutral' if total_votes.zero?
      
      positive_ratio = positive_votes.to_f / total_votes
      
      if positive_ratio >= 0.7
        'very_positive'
      elsif positive_ratio >= 0.6
        'positive'
      elsif positive_ratio >= 0.4
        'mixed'
      elsif positive_ratio >= 0.2
        'negative'
      else
        'very_negative'
      end
    end

    def calculate_ai_alignment(vote_breakdown, recommendation)
      total_votes = vote_breakdown.values.sum
      return 'no_data' if total_votes.zero?
      
      invest_votes = vote_breakdown['invest'] || 0
      positive_ratio = invest_votes.to_f / total_votes
      
      case recommendation[:action]
      when 'strong_invest'
        positive_ratio >= 0.6 ? 'aligned' : 'misaligned'
      when 'consider_invest'
        positive_ratio >= 0.4 ? 'aligned' : 'misaligned'
      when 'avoid_invest'
        positive_ratio <= 0.3 ? 'aligned' : 'misaligned'
      else
        'unknown'
      end
    end
  end
end