# app/jobs/update_campaign_investments_job.rb
class UpdateCampaignInvestmentsJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    
    return unless investment && investment.successful?
    
    investment.current_value
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "InvestmentUpdateJob: Investment #{investment_id} not found - #{e.message}"
  rescue StandardError => e
    Rails.logger.error "InvestmentUpdateJob: Error updating investment #{investment_id} - #{e.message}"
    # You might want to retry the job or send to error monitoring
  end
end