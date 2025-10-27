class AdminNotificationService
  def self.new_report_created(report)
    # Log the notification
    Rails.logger.info "New report created: Report ##{report.id} - #{report.report_type} by User ##{report.reporter.id}"
    
    # Send email notifications to admins
    ReportMailerService.send_new_report_notification_to_admins(report)
    
    # You can add other notification methods here (in-app notifications, etc.)
  end
end