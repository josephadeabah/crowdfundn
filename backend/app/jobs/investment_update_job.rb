# app/jobs/investment_update_job.rb (kept as job for compatibility)
class InvestmentUpdateJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    InvestmentUpdateService.update_investment(investment_id)
  end
end