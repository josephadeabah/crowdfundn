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
        Rails.logger.error "Failed to send webhook for Campaign #{campaign.id}: #{e.message}"
      end
    end
  end

  every(1.day, 'transfer_platform_fees', at: '12:00') do
    Rails.logger.info "Triggering 'transfer_platform_fees' job at #{Time.current}"
    begin
      PlatformFeeService.transfer_platform_fees
    rescue => e
      Rails.logger.error "Failed to transfer platform fees: #{e.message}"
    end
  end

  every(1.day, 'update_investment_values', at: '04:00') do
    Rails.logger.info "Updating investment values at #{Time.current}"
    EquityCampaign.live.find_each do |campaign|
      UpdateCampaignInvestmentsJob.perform_later(campaign.id)
    end
  end

  # Add this new block at the end for certificate retries
  every(1.hour, 'retry_failed_certificates') do
    Rails.logger.info "Checking for failed certificate generations at #{Time.current}"
    
    EquityInvestment.success
      .where.not(certificate_number: nil)
      .left_outer_joins(:certificate_attachment)
      .where(active_storage_attachments: { id: nil })
      .find_each(batch_size: 100) do |investment|
        CertificateGenerationJob.perform_later(investment.id)
        Rails.logger.info "Enqueued certificate generation for investment #{investment.id}"
      end
  end

  # Error handler
  error_handler do |error|
    Rails.logger.error "[Clockwork Error] #{error.class.name}: #{error.message}"
    Rails.logger.error error.backtrace.join("\n")
  end
end