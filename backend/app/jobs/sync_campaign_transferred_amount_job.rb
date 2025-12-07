# app/jobs/sync_campaign_transferred_amount_job.rb
class SyncCampaignTransferredAmountJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = Campaign.find_by(id: campaign_id)
    return unless campaign

    # Calculate the sum of all successful equity investments
    total_transferred = campaign.equity_investments
                                .successful
                                .sum(:net_amount)
    
    # Update the campaign's transferred_amount if it's different
    if campaign.transferred_amount != total_transferred
      campaign.update_column(:transferred_amount, total_transferred)
      Rails.logger.info "Synced transferred_amount for campaign #{campaign_id}: #{total_transferred}"
    end
  end
end