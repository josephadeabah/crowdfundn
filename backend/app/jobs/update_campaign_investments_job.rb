# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = EquityCampaign.find_by(id: campaign_id)
    
    return unless campaign
    
    # Update all successful investments for this campaign
    campaign.equity_investments.successful.find_each do |investment|
      investment.current_value
      investment.save! if investment.changed?
    end
    
    # Also update the campaign's shares available to ensure consistency
    campaign.update_shares_available_from_investments
    
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "UpdateCampaignInvestmentsJob: Campaign #{campaign_id} not found - #{e.message}"
  rescue StandardError => e
    Rails.logger.error "UpdateCampaignInvestmentsJob: Error updating investments for campaign #{campaign_id} - #{e.message}"
    # Retry the job with exponential backoff
    retry_job(wait: 1.minute) if executions < 5
  end
end