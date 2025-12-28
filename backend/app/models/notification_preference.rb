# app/models/notification_preference.rb
class NotificationPreference < ApplicationRecord
  belongs_to :user
  
  validates :user_id, uniqueness: true
  validates :summary_frequency, inclusion: { in: %w[daily weekly monthly none] }
  
  after_create :send_welcome_notification
  
  def self.defaults_for_user(user)
    find_or_create_by(user: user) do |pref|
      # Set defaults
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
      next_summary_at: next_summary_time
    )
  end
  
  private
  
  def send_welcome_notification
    NotificationService.new(user).send_welcome_notification
  end
  
  def next_summary_time
    return nil if summary_frequency == 'none'
    
    last_summary = Time.current.beginning_of_day + (preferred_time&.seconds_since_midnight || 9.hours)
    
    case summary_frequency
    when 'daily'
      last_summary + 1.day
    when 'weekly'
      last_summary + 1.week
    when 'monthly'
      last_summary + 1.month
    end
  end
end