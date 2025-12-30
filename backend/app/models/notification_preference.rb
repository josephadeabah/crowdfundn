# app/models/notification_preference.rb
class NotificationPreference < ApplicationRecord
  belongs_to :user
  
  validates :user_id, uniqueness: true
  validates :summary_frequency, inclusion: { in: %w[daily weekly monthly none] }
  
  after_create :send_welcome_notification, if: -> { email_notifications }
  
  def self.defaults_for_user(user)
    find_or_create_by(user: user) do |pref|
      # Set defaults
      pref.financial_statements = true
      pref.valuation_updates = true
      pref.monthly_reports = true
      pref.quarterly_reports = true
      pref.annual_reports = true
      pref.campaign_updates = true
      pref.portfolio_updates = true
      pref.email_notifications = true
      pref.push_notifications = true
      pref.in_app_notifications = true
      pref.summary_frequency = 'weekly'
      pref.preferred_time = 32400 # 9:00 AM in seconds (9 * 3600)
    end
  rescue ActiveRecord::StatementInvalid => e
    # If table doesn't exist yet, create a new record in memory
    Rails.logger.error "Notification preferences table not found: #{e.message}"
    new(
      user: user,
      financial_statements: true,
      valuation_updates: true,
      monthly_reports: true,
      quarterly_reports: true,
      annual_reports: true,
      campaign_updates: true,
      portfolio_updates: true,
      email_notifications: true,
      push_notifications: true,
      in_app_notifications: true,
      summary_frequency: 'weekly',
      preferred_time: 32400
    )
  end
  
  def enabled_for_report_type?(report_type)
    case report_type.to_sym
    when :financial_statements then financial_statements
    when :valuation_updates then valuation_updates
    when :monthly_reports then monthly_reports
    when :quarterly_reports then quarterly_reports
    when :annual_reports then annual_reports
    when :campaign_updates then campaign_updates
    when :portfolio_updates then portfolio_updates
    else false
    end
  end
  
  def delivery_methods
    methods = []
    methods << :email if email_notifications
    methods << :push if push_notifications
    methods << :in_app if in_app_notifications
    methods
  end
  
  def as_json(options = {})
    super(options).merge(
      delivery_methods: delivery_methods,
      next_summary_at: next_summary_time,
      preferred_time_string: preferred_time_string
    )
  end
  
  def preferred_time_string
    return "09:00" if preferred_time.blank?
    
    # Handle both integer (seconds) and string formats
    seconds = preferred_time.is_a?(String) ? preferred_time.to_i : preferred_time
    hours = (seconds / 3600).to_i
    minutes = ((seconds % 3600) / 60).to_i
    format("%02d:%02d", hours, minutes)
  end
  
  # Convert preferred_time_string back to seconds for saving
  def preferred_time_string=(time_string)
    if time_string.present? && time_string.match?(/\A\d{1,2}:\d{2}\z/)
      hours, minutes = time_string.split(':').map(&:to_i)
      self.preferred_time = (hours * 3600) + (minutes * 60)
    else
      self.preferred_time = 32400 # Default to 9:00 AM
    end
  end
  
  private
  
  def send_welcome_notification
    # Try to use InvestorReporting::NotificationService first
    if defined?(InvestorReporting::NotificationService)
      begin
        InvestorReporting::NotificationService.new(user).send_welcome_notification
        return
      rescue => e
        Rails.logger.error "Failed to send welcome notification via InvestorReporting::NotificationService: #{e.message}"
        # Fallback to direct email service
      end
    end
    
    # Fallback: Use the email service directly
    send_welcome_via_email_service
  rescue => e
    Rails.logger.error "Failed to send welcome notification: #{e.message}"
    # Don't fail the creation if notification fails
  end
  
  def send_welcome_via_email_service
    # Use InvestorNotificationEmailService
    if defined?(InvestorNotificationEmailService)
      InvestorNotificationEmailService.send_notification(
        user, 
        {
          title: "Welcome to Investor Reporting",
          message: "You're now set up to receive notifications about your investments. Manage your preferences anytime in your settings.",
          type: :welcome
        }
      )
    else
      Rails.logger.warn "InvestorNotificationEmailService not available for welcome notification"
    end
  end
  
  def next_summary_time
    return nil if summary_frequency == 'none'
    
    # Use the current preferred time or default to 9:00 AM
    current_time = Time.current
    time_string = preferred_time_string
    preferred_hour = time_string.split(':')[0].to_i
    preferred_minute = time_string.split(':')[1].to_i
    
    # Calculate next summary based on frequency
    case summary_frequency
    when 'daily'
      # Next day at preferred time
      next_time = current_time.beginning_of_day + preferred_hour.hours + preferred_minute.minutes
      next_time += 1.day if next_time <= current_time
    when 'weekly'
      # Next occurrence at preferred time (same day of week)
      target_wday = current_time.wday
      next_time = current_time.beginning_of_day + preferred_hour.hours + preferred_minute.minutes
      next_time += 1.week if next_time <= current_time
    when 'monthly'
      # First day of next month at preferred time
      next_month = current_time.next_month
      next_time = next_month.beginning_of_month.beginning_of_day + preferred_hour.hours + preferred_minute.minutes
    else
      nil
    end
    
    next_time
  end
  
  # Helper method to check if it's time to send summary
  def should_send_summary_now?
    return false if summary_frequency == 'none'
    
    current_time = Time.current
    next_time = next_summary_time
    
    return false unless next_time
    
    # Check if current time is within 30 minutes of the scheduled time
    (current_time - next_time).abs <= 30.minutes
  end
end