# app/jobs/update_campaign_shares_job.rb
class UpdateCampaignSharesJob < ApplicationJob
  queue_as :default
  
  def perform(campaign_id, investment_id)
    campaign = EquityCampaign.find(campaign_id)
    investment = EquityInvestment.find(investment_id)
    
    campaign.with_lock do
      if investment.successful?
        campaign.decrement!(:shares_available, investment.shares)
      elsif investment.refunded?
        campaign.increment!(:shares_available, investment.shares)
      end
    end
  end
end