# app/jobs/send_webhook_job.rb
class SendWebhookJob < ApplicationJob
  queue_as :campaign_status_webhooks

  def perform(campaign_id)
    campaign = Campaign.find_by(id: campaign_id)
    return unless campaign&.active?

    campaign.send_status_update_webhook
  rescue => e
    Rails.logger.error "[SendWebhookJob] Failed for Campaign #{campaign_id}: #{e.message}"
  end
end
