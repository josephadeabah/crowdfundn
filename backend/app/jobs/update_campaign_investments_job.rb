# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(campaign_id)
    campaign = EquityCampaign.find(campaign_id)
    campaign.equity_investments.completed.find_each do |investment|
      InvestmentUpdateJob.perform_later(investment.id)
    end
  end
end

# app/jobs/investment_update_job.rb
class InvestmentUpdateJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find(investment_id)
    investment.touch # This forces updated_at to change
    
    # Broadcast update via ActionCable if you're using it
    if defined?(InvestmentsChannel)
      InvestmentsChannel.broadcast_to(
        investment.user,
        {
          type: 'investment_update',
          investment_id: investment.id,
          current_value: investment.current_value,
          total_returns: investment.total_returns,
          roi: investment.roi
        }
      )
    end
    
    # Optionally send email notification for significant changes
    if investment.saved_change_to_percentage? || investment.campaign.saved_change_to_valuation?
      InvestmentValueChangeMailer.notify(investment).deliver_later
    end
  end
end