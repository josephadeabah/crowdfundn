# config/clock.rb
require './config/boot'
require './config/environment'

require 'clockwork'
include Clockwork

every(8.hours, 'send_webhook') do
  Rails.logger.info "Triggering 'send_webhook' job at #{Time.current}"
  Campaign.active.find_each do |campaign|
    campaign.send_status_update_webhook
  end
end

every(1.day, 'transfer_platform_fees', at: '12:00') do
  Rails.logger.info "Triggering 'transfer_platform_fees' job at #{Time.current}"
  PlatformFeeService.transfer_platform_fees
end

# Add this new job to update investment values daily
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