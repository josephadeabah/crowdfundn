# config/clock.rb
require 'clockwork'
require './config/boot'
require './config/environment'

module Clockwork
  # ---------------------------------------
  # Configuration
  # ---------------------------------------
  configure do |config|
    config[:logger] = Rails.logger
    config[:sleep_timeout] = 5  # how often Clockwork checks for due jobs
    config[:tz] = 'UTC'
    config[:max_threads] = 5    # ✅ allow multiple jobs concurrently
    config[:thread] = true      # ✅ enable threading (not 1)
  end

  # ---------------------------------------
  # Error Handling
  # ---------------------------------------
  error_handler do |error|
    Rails.logger.error "[Clockwork Error] #{error.class}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n") if error.backtrace
  end

  # ---------------------------------------
  # Job Handler (for debugging)
  # ---------------------------------------
  handler do |job|
    Rails.logger.info "[Clockwork] Triggered job: #{job} at #{Time.current}"
  end

  # ---------------------------------------
  # Scheduled Jobs
  # ---------------------------------------

  # 1️⃣ Send campaign webhooks every 1 hour
  every(1.hour, 'send_webhook') do
    Campaign.active.find_each(batch_size: 100) do |campaign|
      SendWebhookJob.perform_later(campaign.id)
    rescue => e
      Rails.logger.error "[Clockwork] Failed enqueue for Campaign #{campaign.id}: #{e.message}"
    end
  end

  # 2️⃣ Transfer platform fees daily at noon UTC
  every(1.day, 'transfer_platform_fees', at: '12:00') do
    TransferPlatformFeesJob.perform_later
  rescue => e
    Rails.logger.error "[Clockwork] Failed to enqueue TransferPlatformFeesJob: #{e.message}"
  end

  # 3️⃣ Finalize committed investments every hour
  every(1.hour, 'finalize_committed_investments') do
    FinalizeCommittedInvestmentsJob.perform_later
  rescue => e
    Rails.logger.error "[Clockwork] Failed to enqueue FinalizeCommittedInvestmentsJob: #{e.message}"
  end

    # 4️⃣ Weekly AI re-analysis every Monday at 2 AM UTC
  every(1.week, 'weekly_ai_analysis', at: 'Monday 02:00') do
    Rails.logger.info "[Clockwork] Starting weekly AI analysis for active campaigns"
    
    Campaign.active.find_each(batch_size: 50) do |campaign|
      begin
        AI::DealScoringService.analyze_campaign(campaign, analysis_type: 'weekly')
        Rails.logger.info "[Clockwork] AI analysis completed for campaign #{campaign.id}"
      rescue => e
        Rails.logger.error "[Clockwork] AI analysis failed for campaign #{campaign.id}: #{e.message}"
      end
    end
  end

  # 5️⃣ Update embeddings for all campaigns monthly
  every(1.month, 'update_campaign_embeddings', at: '01 03:00') do
    Rails.logger.info "[Clockwork] Starting monthly campaign embeddings update"
    AI::SimilarDealsService.update_all_embeddings
  end
  
end
