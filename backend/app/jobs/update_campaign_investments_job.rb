# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = EquityCampaign.find(campaign_id)
    
    campaign.equity_investments.successful.find_each do |investment|
      # Recalculate shares based on new valuation/total_shares
      price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
      new_shares = (investment.amount / price_per_share).round(4)
      
      # Maintain the original ownership percentage
      investment.update_columns(
        shares: new_shares
        # percentage remains unchanged to preserve ownership stake
      )
    end
    
    # Optional: Recalculate campaign statistics if needed
    campaign.touch # Force cache invalidation
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Campaign not found: #{e.message}"
  end
end