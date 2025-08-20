# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = EquityCampaign.find(campaign_id)
    
    # Update all successful investments for this campaign
    campaign.equity_investments.successful.each do |investment|
      # Recalculate shares and percentage based on new valuation
      price_per_share = campaign.valuation.to_f / campaign.total_shares.to_f
      new_shares = (investment.amount / price_per_share).round(4)
      new_percentage = ((investment.amount / (campaign.valuation.to_f * campaign.equity_offered.to_f / 100)) * 100).round(6)
      
      investment.update_columns(
        shares: new_shares,
        percentage: new_percentage
      )
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "Campaign not found: #{e.message}"
  end
end