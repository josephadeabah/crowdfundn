# lib/tasks/ai_analysis.rake
namespace :ai_analysis do
  desc "Run AI analysis for all active campaigns"
  task run_all: :environment do
    puts "Starting AI analysis for all active campaigns..."
    
    Campaign.active.find_each do |campaign|
      puts "Analyzing campaign: #{campaign.title}"
      result = AI::DealScoringService.analyze_campaign(campaign)
      puts result[:success] ? "✓ Success" : "✗ Failed: #{result[:error]}"
    end
    
    puts "AI analysis completed!"
  end

  desc "Generate embeddings for all campaigns"
  task generate_embeddings: :environment do
    puts "Generating embeddings for all campaigns..."
    AI::SimilarDealsService.update_all_embeddings
    puts "Embeddings generation completed!"
  end

  desc "Clean up old analysis logs"
  task cleanup_logs: :environment do
    cutoff_date = 3.months.ago
    old_logs = DealScoreLog.where('created_at < ?', cutoff_date)
    
    puts "Deleting #{old_logs.count} old analysis logs..."
    old_logs.destroy_all
    puts "Cleanup completed!"
  end
end