# app/jobs/send_portfolio_summaries_job.rb
class SendPortfolioSummariesJob < ApplicationJob
  queue_as :default
  
  def perform
    # Get all users with notification preferences
    User.joins(:notification_preferences)
        .where(notification_preferences: { summary_frequency: ['daily', 'weekly', 'monthly'] })
        .find_each(batch_size: 100) do |user|
      
      preferences = user.notification_preferences
      
      case preferences.summary_frequency
      when 'daily'
        InvestorReporting::NotificationService.new(user).send_daily_summary
      when 'weekly'
        # Only send on specific days (e.g., Monday)
        InvestorReporting::NotificationService.new(user).send_weekly_summary if Date.current.monday?
      when 'monthly'
        # Only send on first day of month
        InvestorReporting::NotificationService.new(user).send_monthly_summary if Date.current.day == 1
      end
    end
  end
end