# config/clock.rb
require './config/boot'
require './config/environment'

require 'clockwork'
include Clockwork

every(8.hours, 'send_webhook') do
  Rails.logger.info "Triggering 'send_webhook' job at #{Time.current}"
  
  # Find all active campaigns and trigger the webhook
  Campaign.active.find_each do |campaign|
    Rails.logger.info "Sending webhook for Campaign ID: #{campaign.id}"
    campaign.send_status_update_webhook
  end
end

every(1.day, 'transfer_platform_fees', at: '12:00') do
  Rails.logger.info "Triggering 'transfer_platform_fees' job at #{Time.current}"
  PlatformFeeService.transfer_platform_fees
end
