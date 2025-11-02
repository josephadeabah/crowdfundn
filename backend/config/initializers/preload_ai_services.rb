# Preload AI services to ensure they're available
Rails.application.config.after_initialize do
  Rails.logger.info "Preloading AI services..."
  
  # Preload the AI services
  services_to_preload = [
    'app/services/ai/deal_scoring_service.rb',
    'app/services/ai/sentiment_analysis_service.rb',
    'app/services/ai/similar_deals_service.rb'
  ]
  
  services_to_preload.each do |service_path|
    full_path = Rails.root.join(service_path)
    if File.exist?(full_path)
      begin
        require full_path
        Rails.logger.info "Successfully loaded: #{service_path}"
      rescue => e
        Rails.logger.error "Failed to load #{service_path}: #{e.message}"
      end
    else
      Rails.logger.warn "Service file not found: #{service_path}"
    end
  end
  
  # Verify services are loaded
  Rails.logger.info "AI::DealScoringService loaded: #{defined?(AI::DealScoringService)}"
  Rails.logger.info "AI::SentimentAnalysisService loaded: #{defined?(AI::SentimentAnalysisService)}"
  Rails.logger.info "AI::SimilarDealsService loaded: #{defined?(AI::SimilarDealsService)}"
  
  Rails.logger.info "AI services preloading completed."
end