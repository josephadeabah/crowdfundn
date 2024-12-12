# config/clock.rb
require 'clockwork'
include Clockwork

every(5.minutes, 'send_webhook') do
  Campaign.active.find_each do |campaign|
    campaign.send_status_update_webhook
  end
end
