# app/jobs/generate_portfolio_metrics_job.rb
class GeneratePortfolioMetricsJob < ApplicationJob
  queue_as :default
  
  def perform(user_id = nil)
    if user_id
      generate_for_user(user_id)
    else
      generate_for_all_investors
    end
  end
  
  private
  
  def generate_for_user(user_id)
    user = User.find(user_id)
    
    # Only generate for users with investments
    return unless user.equity_investments.successful.any?
    
    InvestorPortfolioMetric.calculate_for_user(user.id)
  rescue => e
    Rails.logger.error "Failed to generate portfolio metrics for user #{user_id}: #{e.message}"
  end
  
  def generate_for_all_investors
    # Find all users with successful investments
    user_ids = EquityInvestment.successful.distinct.pluck(:user_id)
    
    user_ids.each do |user_id|
      GeneratePortfolioMetricsJob.perform_later(user_id)
    end
  end
end