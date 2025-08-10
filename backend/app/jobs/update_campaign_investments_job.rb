# app/jobs/update_campaign_investments_job.rb
# app/jobs/update_campaign_investments_job.rb (kept as job for compatibility)
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    UpdateCampaignInvestmentsService.update_for_campaign(campaign_id)
  end
end
