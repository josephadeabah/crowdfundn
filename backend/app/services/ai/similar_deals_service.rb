# app/services/ai/similar_deals_service.rb
module AI
  class SimilarDealsService
    def initialize(campaign, limit: 5)
      @campaign = campaign
      @limit = limit
    end

    def find_similar
      return find_similar_basic unless @campaign.respond_to?(:ai_embedding) && @campaign.ai_embedding.present?
      
      if using_vector_extension?
        find_similar_with_vector
      else
        find_similar_with_json
      end
    end

    def self.update_all_embeddings
      Campaign.find_each do |campaign|
        begin
          AI::DealScoringService.generate_embeddings(campaign)
          Rails.logger.info "Generated embedding for campaign #{campaign.id}"
        rescue => e
          Rails.logger.error "Failed to generate embedding for campaign #{campaign.id}: #{e.message}"
        end
      end
    end

    private

    def using_vector_extension?
      # Check if vector extension is enabled
      @vector_enabled ||= begin
        result = ActiveRecord::Base.connection.execute(
          "SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector') as enabled"
        )
        result[0]['enabled']
      rescue
        false
      end
    end

    def find_similar_with_vector
      query_vector = @campaign.ai_embedding
      
      similar_campaigns = Campaign
        .where.not(id: @campaign.id)
        .where.not(ai_embedding: nil)
        .order(Arel.sql("ai_embedding <-> '#{Pgvector.encode(query_vector)}'"))
        .limit(@limit)

      similar_campaigns.map do |campaign|
        distance = Pgvector.distance(query_vector, campaign.ai_embedding, :cosine)
        similarity = (1 - distance) * 100
        
        {
          campaign: campaign,
          similarity_score: similarity.round(2),
          common_features: extract_common_features(campaign),
          method: 'vector_similarity'
        }
      end
    end

    def find_similar_with_json
      query_embedding = @campaign.ai_embedding
      
      similar_campaigns = Campaign
        .where.not(id: @campaign.id)
        .where.not(ai_embedding: nil)
        .to_a
        .select { |campaign| valid_json_embedding?(campaign.ai_embedding) }
        .sort_by { |campaign| -calculate_cosine_similarity(query_embedding, campaign.ai_embedding) }
        .first(@limit)

      similar_campaigns.map do |campaign|
        similarity = calculate_cosine_similarity(query_embedding, campaign.ai_embedding) * 100
        
        {
          campaign: campaign,
          similarity_score: similarity.round(2),
          common_features: extract_common_features(campaign),
          method: 'json_similarity'
        }
      end
    end

    def find_similar_basic
      similar_campaigns = Campaign
        .where.not(id: @campaign.id)
        .where(category: @campaign.category)
        .order("ABS(goal_amount - #{@campaign.goal_amount}) ASC")
        .limit(@limit)

      similar_campaigns.map do |campaign|
        {
          campaign: campaign,
          similarity_score: calculate_basic_similarity_score(campaign),
          common_features: extract_common_features(campaign),
          method: 'basic_matching'
        }
      end
    end

    def valid_json_embedding?(embedding)
      embedding.is_a?(Array) && embedding.all? { |x| x.is_a?(Numeric) }
    end

    def calculate_cosine_similarity(a, b)
      return 0 unless a.is_a?(Array) && b.is_a?(Array) && a.size == b.size
      
      dot_product = a.zip(b).sum { |x, y| x * y }
      norm_a = Math.sqrt(a.sum { |x| x * x })
      norm_b = Math.sqrt(b.sum { |x| x * x })
      
      return 0 if norm_a.zero? || norm_b.zero?
      
      dot_product / (norm_a * norm_b)
    end

    def calculate_basic_similarity_score(other_campaign)
      score = 0
      score += 40 if @campaign.category == other_campaign.category
      
      if @campaign.goal_amount > 0 && other_campaign.goal_amount > 0
        goal_ratio = @campaign.goal_amount / other_campaign.goal_amount.to_f
        score += 30 if goal_ratio.between?(0.5, 2.0)
      end
      
      score += 30 if @campaign.class == other_campaign.class
      score
    end

    def extract_common_features(other_campaign)
      features = []
      features << "same_category" if @campaign.category == other_campaign.category
      features << "similar_goal" if goal_similar?(other_campaign)
      features << "same_campaign_type" if @campaign.class == other_campaign.class
      features << "similar_performance" if performance_similar?(other_campaign)
      features
    end

    def goal_similar?(other_campaign)
      return false if @campaign.goal_amount.zero? || other_campaign.goal_amount.zero?
      ratio = @campaign.goal_amount / other_campaign.goal_amount.to_f
      ratio.between?(0.5, 2.0)
    end

    def performance_similar?(other_campaign)
      this_performance = @campaign.performance_percentage
      other_performance = other_campaign.performance_percentage
      (this_performance - other_performance).abs <= 20
    end
  end
end