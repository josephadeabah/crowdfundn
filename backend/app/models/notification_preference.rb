# app/models/notification_preference.rb
class NotificationPreference < ApplicationRecord
  belongs_to :user
  
  validates :user_id, uniqueness: true
  validates :summary_frequency, inclusion: { in: %w[daily weekly monthly none] }
  
  after_create :send_welcome_notification
  
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
      pref.preferred_time = 9.hours # 9:00 AM
    end
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
    
    hours = (preferred_time.to_i / 3600).to_i
    minutes = ((preferred_time.to_i % 3600) / 60).to_i
    format("%02d:%02d", hours, minutes)
  end
  
  private
  
  def send_welcome_notification
    # Use the namespaced service
    InvestorReporting::NotificationService.new(user).send_welcome_notification
  rescue => e
    Rails.logger.error "Failed to send welcome notification: #{e.message}"
    # Don't fail the creation if notification fails
  end
  
  def next_summary_time
    return nil if summary_frequency == 'none'
    
    # Use the current preferred time or default to 9:00 AM
    current_time = Time.current
    preferred_hour = preferred_time_string.split(':')[0].to_i
    preferred_minute = preferred_time_string.split(':')[1].to_i
    
    # Calculate next summary based on frequency
    case summary_frequency
    when 'daily'
      # Next day at preferred time
      next_time = current_time.beginning_of_day + preferred_hour.hours + preferred_minute.minutes
      next_time += 1.day if next_time <= current_time
    when 'weekly'
      # Next Monday at preferred time
      next_time = current_time.next_occurring(:monday).beginning_of_day + preferred_hour.hours + preferred_minute.minutes
    when 'monthly'
      # First day of next month at preferred time
      next_month = current_time.next_month
      next_time = next_month.beginning_of_month.beginning_of_day + preferred_hour.hours + preferred_minute.minutes
    else
      nil
    end
    
    next_time
  end
end