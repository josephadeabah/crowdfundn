# config/clock.rb
require 'clockwork'
require './config/boot'
require './config/environment'

module Clockwork
  # Configure the logger
  configure do |config|
    config[:logger] = Rails.logger
    config[:sleep_timeout] = 5  # seconds between checks
    config[:tz] = 'UTC'         # set your timezone if different
  end

  # Job handler
  handler do |job|
    Rails.logger.info "[Clockwork] Starting job: #{job}"
  end

  every(8.hours, 'send_webhook', at: '**:00') do
    Rails.logger.info "Triggering 'send_webhook' job at #{Time.current}"
    
    Campaign.active.find_each do |campaign|
      begin
        Rails.logger.info "Sending webhook for Campaign ID: #{campaign.id}"
        campaign.send_status_update_webhook
      rescue => e
        Rails.logger.info "Failed to send webhook for Campaign #{campaign.id}: #{e.message}"
      end
    end
  end

  every(1.day, 'transfer_platform_fees', at: '12:00') do
    Rails.logger.info "Triggering 'transfer_platform_fees' job at #{Time.current}"
    begin
      PlatformFeeService.transfer_platform_fees
    rescue => e
      Rails.logger.info "Failed to transfer platform fees: #{e.message}"
    end
  end

  # Finalize committed investments every hour (check for expired cancellation windows)
  every(1.hour, 'finalize_committed_investments') do
    Rails.logger.info "Triggering 'finalize_committed_investments' job at #{Time.current}"
    begin
      FinalizeCommittedInvestmentsJob.perform_later
    rescue => e
      Rails.logger.error "Failed to finalize committed investments: #{e.message}"
    end
  end

  # Error handler
  error_handler do |error|
    Rails.logger.info "[Clockwork Error] #{error.class.name}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end
end