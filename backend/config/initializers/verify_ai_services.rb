# This initializer verifies that all AI services are properly loaded
Rails.application.config.after_initialize do
  Rails.logger.info "Verifying AI services loading..."
  
  # Check if SentimentAnalysisService is available
  sentiment_service_available = defined?(AI::SentimentAnalysisService)
  Rails.logger.info "AI::SentimentAnalysisService available: #{sentiment_service_available}"
  
  # Check if DealScoringService is available
  deal_scoring_service_available = defined?(AI::DealScoringService)
  Rails.logger.info "AI::DealScoringService available: #{deal_scoring_service_available}"
  
  # Check if SimilarDealsService is available
  similar_deals_service_available = defined?(AI::SimilarDealsService)
  Rails.logger.info "AI::SimilarDealsService available: #{similar_deals_service_available}"
  
  if !sentiment_service_available
    Rails.logger.warn "AI::SentimentAnalysisService is not available. Deal scoring will use basic sentiment analysis."
  end
  
  Rails.logger.info "AI services verification completed."
end