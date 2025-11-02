# app/services/ai/sentiment_analysis_service.rb
module AI
  class SentimentAnalysisService
    STRATEGIES = [:openai_enhanced, :keyword_based].freeze

    def initialize(campaign)
      @campaign = campaign
    end

    def analyze
      texts = extract_campaign_texts
      return default_sentiment if texts.empty?

      # Try primary strategy first, fall back to others
      results = STRATEGIES.map { |strategy| send("analyze_with_#{strategy}", texts) }
                          .compact
                          .reject { |r| r[:confidence] < 0.3 }

      aggregate_results(results) || perform_advanced_keyword_analysis(texts)
    end

    private

    def analyze_with_openai_enhanced(texts)
      return nil unless ENV['OPENAI_API_KEY'].present?
      
      begin
        client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
        prompt = build_sentiment_prompt(texts)
        
        response = client.chat(
          parameters: {
            model: "gpt-3.5-turbo",
            messages: [
              { 
                role: "system", 
                content: "You are a sentiment analysis expert. Analyze the emotional tone and sentiment of the provided texts from a fundraising campaign. Consider context, enthusiasm, concerns, and overall community engagement." 
              },
              { role: "user", content: prompt }
            ],
            temperature: 0.1,
            max_tokens: 500
          }
        )

        parse_sentiment_response(response)
      rescue => e
        Rails.logger.error "OpenAI sentiment analysis failed: #{e.message}"
        nil
      end
    end

    def analyze_with_keyword_based(texts)
      perform_advanced_keyword_analysis(texts)
    end

    def build_sentiment_prompt(texts)
      sample_texts = texts.first(30).join("\n---\n")
      
      <<~PROMPT
        Analyze the sentiment of these campaign comments and updates:

        #{sample_texts}

        Provide a JSON response with:
        - overall_sentiment: "positive", "neutral", or "negative"
        - sentiment_score: 0.0 to 1.0 (1.0 being most positive)
        - confidence: 0.0 to 1.0
        - key_positive_themes: array of positive themes
        - key_concerns: array of concerns or negative themes
        - engagement_level: "high", "medium", or "low"

        JSON Response:
      PROMPT
    end

    def parse_sentiment_response(response)
      content = response.dig("choices", 0, "message", "content")
      
      begin
        data = JSON.parse(content)
        {
          score: data['sentiment_score'].to_f,
          label: data['overall_sentiment']&.downcase,
          confidence: data['confidence'].to_f,
          positive_themes: data['key_positive_themes'] || [],
          concerns: data['key_concerns'] || [],
          engagement_level: data['engagement_level'],
          method: 'openai_enhanced'
        }
      rescue JSON::ParserError
        perform_fallback_analysis(content)
      end
    end

    def perform_fallback_analysis(content)
      # Simple analysis based on content keywords
      content_lower = content.downcase
      positive_indicators = %w[positive excellent great amazing love excited happy success progress]
      negative_indicators = %w[negative concern risk problem issue bad poor disappointing]
      
      positive_count = positive_indicators.count { |word| content_lower.include?(word) }
      negative_count = negative_indicators.count { |word| content_lower.include?(word) }
      total = positive_count + negative_count
      
      sentiment_score = total.zero? ? 0.5 : positive_count.to_f / total
      
      {
        score: sentiment_score,
        label: sentiment_score > 0.6 ? 'positive' : (sentiment_score < 0.4 ? 'negative' : 'neutral'),
        confidence: 0.5,
        method: 'fallback'
      }
    end

    def perform_advanced_keyword_analysis(texts)
      all_text = texts.join(' ').downcase
      
      # Enhanced keyword sets with weights
      positive_indicators = {
        'excellent' => 2.0, 'amazing' => 2.0, 'great' => 1.5, 'love' => 2.0, 'excited' => 1.5,
        'impressive' => 1.5, 'outstanding' => 2.0, 'brilliant' => 1.5, 'innovative' => 1.0,
        'promising' => 1.0, 'success' => 1.0, 'progress' => 0.5, 'achievement' => 0.5,
        'milestone' => 0.5, 'breakthrough' => 1.5, 'revolutionary' => 1.5, 'support' => 0.5,
        'congratulations' => 1.0, 'awesome' => 1.5, 'fantastic' => 1.5, 'wonderful' => 1.0
      }
      
      negative_indicators = {
        'concern' => 1.5, 'worry' => 1.5, 'risk' => 1.0, 'problem' => 1.5, 'issue' => 1.0,
        'disappointing' => 2.0, 'poor' => 1.5, 'bad' => 1.0, 'failure' => 2.0, 'delay' => 1.0,
        'expensive' => 0.5, 'overpriced' => 1.0, 'skeptical' => 1.0, 'doubt' => 1.0,
        'concerned' => 1.5, 'worried' => 1.5, 'risky' => 1.0, 'problematic' => 1.5
      }

      positive_score = calculate_weighted_score(all_text, positive_indicators)
      negative_score = calculate_weighted_score(all_text, negative_indicators)
      
      total_score = positive_score + negative_score
      return { score: 0.5, label: 'neutral', confidence: 0.1, method: 'keyword_based' } if total_score.zero?

      sentiment_score = positive_score / total_score
      confidence = [positive_score, negative_score].max / 10.0 # Normalize confidence

      {
        score: sentiment_score,
        label: score_to_label(sentiment_score),
        confidence: [confidence, 0.9].min, # Cap confidence for keyword analysis
        method: 'keyword_based'
      }
    end

    def calculate_weighted_score(text, keywords)
      keywords.sum do |word, weight|
        count = text.scan(/\b#{Regexp.escape(word)}\b/i).count
        count * weight
      end
    end

    def aggregate_results(results)
      return nil if results.empty?

      # Weight results by confidence
      total_weight = results.sum { |r| r[:confidence] }
      return results.first if total_weight.zero?

      weighted_score = results.sum { |r| r[:score] * r[:confidence] } / total_weight
      average_confidence = results.sum { |r| r[:confidence] } / results.size

      {
        score: weighted_score,
        label: score_to_label(weighted_score),
        confidence: average_confidence,
        method: 'aggregated',
        source_count: results.size
      }
    end

    def extract_campaign_texts
      comments = @campaign.comments.last(100).map(&:content)
      updates = @campaign.updates.last(20).map(&:content)
      (comments + updates).reject { |text| text.blank? || text.length < 10 }
    end

    def score_to_label(score)
      if score >= 0.7
        'positive'
      elsif score <= 0.3
        'negative'
      else
        'neutral'
      end
    end

    def default_sentiment
      { score: 0.5, label: 'neutral', confidence: 0, method: 'default' }
    end
  end
end