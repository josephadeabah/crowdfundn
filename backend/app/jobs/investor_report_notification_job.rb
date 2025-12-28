# app/jobs/investor_report_notification_job.rb
class InvestorReportNotificationJob < ApplicationJob
  queue_as :default
  
  def perform(report_id)
    report = InvestorReport.find(report_id)
    campaign = report.campaign
    
    # Get all investors in this campaign
    investor_ids = campaign.equity_investments.successful.distinct.pluck(:user_id)
    
    investor_ids.each do |investor_id|
      user = User.find(investor_id)
      notification_service = InvestorReporting::NotificationService.new(user)
      notification_service.notify_investor_report_published(report)
    end
  end
end