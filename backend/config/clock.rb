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
    config[:sleep_timeout] = 5  # seconds between checks
    config[:tz] = 'UTC'         # Change if your app needs a specific zone
    config[:thread] = 1
    config[:max_threads] = 1
  end

  # ---------------------------------------
  # Error Handling
  # ---------------------------------------
  error_handler do |error|
    Rails.logger.error "[Clockwork Error] #{error.class}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
    # Optional: Notify error tracking services here (e.g., Sentry, Bugsnag)
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

  # 1️⃣ Send campaign webhooks every 8 hours
  every(8.hours, 'send_webhook') do
    Rails.logger.info "[Clockwork] Enqueuing SendWebhookJob batch at #{Time.current}"

    Campaign.active.find_each(batch_size: 100) do |campaign|
      SendWebhookJob.perform_later(campaign.id)
    rescue => e
      Rails.logger.error "[Clockwork] Failed enqueue for Campaign #{campaign.id}: #{e.message}"
    end
  end

  # 2️⃣ Transfer platform fees daily at noon UTC
  every(1.day, 'transfer_platform_fees', at: '12:00') do
    Rails.logger.info "[Clockwork] Enqueuing TransferPlatformFeesJob at #{Time.current}"
    TransferPlatformFeesJob.perform_later
  rescue => e
    Rails.logger.error "[Clockwork] Failed to enqueue TransferPlatformFeesJob: #{e.message}"
  end

  # 3️⃣ Finalize committed investments every hour
  every(1.hour, 'finalize_committed_investments') do
    Rails.logger.info "[Clockwork] Enqueuing FinalizeCommittedInvestmentsJob at #{Time.current}"
    FinalizeCommittedInvestmentsJob.perform_later
  rescue => e
    Rails.logger.error "[Clockwork] Failed to enqueue FinalizeCommittedInvestmentsJob: #{e.message}"
  end
end
