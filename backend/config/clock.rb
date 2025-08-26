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

  # Send webhooks every 8 hours
  every(8.hours, 'send_webhook', at: '**:00') do
    Rails.logger.info "Triggering 'send_webhook' job at #{Time.current}"
    
    begin
      Campaign.active.find_each do |campaign|
        begin
          Rails.logger.info "Sending webhook for Campaign ID: #{campaign.id}"
          campaign.send_status_update_webhook
        rescue => e
          Rails.logger.error "Failed to send webhook for Campaign #{campaign.id}: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
        end
      end
    rescue => e
      Rails.logger.error "Failed to process send_webhook job: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end

  # Transfer platform fees daily at 12:00 UTC
  every(1.day, 'transfer_platform_fees', at: '12:00') do
    Rails.logger.info "Triggering 'transfer_platform_fees' job at #{Time.current}"
    begin
      # Make sure PlatformFeeService exists and has the transfer_platform_fees method
      if defined?(PlatformFeeService) && PlatformFeeService.respond_to?(:transfer_platform_fees)
        PlatformFeeService.transfer_platform_fees
      else
        Rails.logger.error "PlatformFeeService.transfer_platform_fees is not defined"
      end
    rescue => e
      Rails.logger.error "Failed to transfer platform fees: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
    end
  end

  # Error handler
  error_handler do |error|
    Rails.logger.error "[Clockwork Error] #{error.class.name}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end
end