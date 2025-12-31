# app/services/investor_reporting/notification_service.rb
module InvestorReporting
  class NotificationService
    def initialize(user)
      @user = user
      @preferences = NotificationPreference.defaults_for_user(user)
    end
    
    def notify_valuation_update(campaign, old_valuation, new_valuation)
      return unless @preferences.enabled_for_report_type?(:valuation_updates)
      
      # Check if user is an investor in this campaign
      investment = @user.equity_investments.successful.find_by(campaign_id: campaign.id)
      return unless investment
      
      valuation_change = new_valuation - old_valuation
      percentage_change = old_valuation.zero? ? 0 : (valuation_change / old_valuation * 100).round(2)
      
      # Calculate impact on investment
      old_value = investment.current_value || investment.amount
      new_value = (investment.percentage / 100) * new_valuation
      value_change = new_value - old_value
      
      send_notification(
        type: :valuation_update,
        title: "Valuation Update: #{campaign.company_name}",
        message: "Valuation changed from #{campaign.currency_symbol}#{old_valuation.round(2)} to #{campaign.currency_symbol}#{new_valuation.round(2)} (#{percentage_change}%). Your investment value is now #{campaign.currency_symbol}#{new_value.round(2)}.",
        data: {
          campaign_id: campaign.id,
          old_valuation: old_valuation,
          new_valuation: new_valuation,
          percentage_change: percentage_change,
          investment_value_change: value_change,
          new_investment_value: new_value
        }
      )
    end
    
    def notify_financial_statement_published(statement)
      return unless @preferences.enabled_for_report_type?(:financial_statements)
      
      campaign = statement.campaign
      
      # Check if user is an investor in this campaign
      investment = @user.equity_investments.successful.find_by(campaign_id: campaign.id)
      return unless investment
      
      send_notification(
        type: :financial_statement,
        title: "New Financial Statement: #{campaign.company_name}",
        message: "#{statement.period_type.capitalize} financial statement for #{statement.period_start.to_s(:short)} - #{statement.period_end.to_s(:short)} has been published.",
        data: {
          campaign_id: campaign.id,
          statement_id: statement.id,
          period_type: statement.period_type,
          period_start: statement.period_start,
          period_end: statement.period_end,
          revenue: statement.revenue,
          net_income: statement.net_income
        }
      )
    end
    
    def notify_investor_report_published(report)
      return unless @preferences.enabled_for_report_type?(report.report_type.to_sym)
      
      campaign = report.campaign
      
      # Check if user is an investor in this campaign
      investment = @user.equity_investments.successful.find_by(campaign_id: campaign.id)
      return unless investment
      
      send_notification(
        type: report.report_type.to_sym,
        title: "New #{report.report_type.capitalize} Report: #{campaign.company_name}",
        message: report.title,
        data: {
          campaign_id: campaign.id,
          report_id: report.id,
          report_type: report.report_type,
          report_date: report.report_date,
          period_description: report.period_description
        }
      )
    end
    
    def notify_portfolio_update(portfolio_metrics)
      return unless @preferences.enabled_for_report_type?(:portfolio_updates)
      
      send_notification(
        type: :portfolio_update,
        title: "Portfolio Update",
        message: "Your portfolio value is now #{@user.currency_symbol}#{portfolio_metrics.current_value.round(2)}. ROI: #{portfolio_metrics.roi.round(2)}%",
        data: {
          total_invested: portfolio_metrics.total_invested,
          current_value: portfolio_metrics.current_value,
          total_returns: portfolio_metrics.total_returns,
          roi: portfolio_metrics.roi,
          moic: portfolio_metrics.moic,
          irr: portfolio_metrics.irr
        }
      )
    end
    
    def send_daily_summary
      return unless @preferences.summary_frequency == 'daily'
      return unless should_send_summary_now?
      
      portfolio_metrics = InvestorPortfolioMetric.calculate_for_user(@user.id)
      return unless portfolio_metrics
      
      send_notification(
        type: :daily_summary,
        title: "Daily Portfolio Summary",
        message: build_daily_summary_message(portfolio_metrics),
        data: portfolio_metrics.as_json,
        priority: :low
      )
    end
    
    def send_weekly_summary
      return unless @preferences.summary_frequency == 'weekly'
      return unless should_send_summary_now?
      
      portfolio_metrics = InvestorPortfolioMetric.calculate_for_user(@user.id)
      return unless portfolio_metrics
      
      # Get weekly changes
      week_ago_metrics = InvestorPortfolioMetric
                        .for_user(@user.id)
                        .where('calculation_date >= ?', 7.days.ago)
                        .order(calculation_date: :asc)
                        .first
      
      send_notification(
        type: :weekly_summary,
        title: "Weekly Portfolio Summary",
        message: build_weekly_summary_message(portfolio_metrics, week_ago_metrics),
        data: portfolio_metrics.as_json.merge(weekly_change: calculate_weekly_change(portfolio_metrics, week_ago_metrics)),
        priority: :low
      )
    end
    
    def send_welcome_notification
      send_notification(
        type: :welcome,
        title: "Welcome to Investor Reporting",
        message: "You're now set up to receive notifications about your investments. Manage your preferences anytime in your settings.",
        data: {
          welcome: true,
          setup_date: Time.current
        },
        priority: :low
      )
    end
    
    private
    
    def send_notification(type:, title:, message:, data: {}, priority: :normal)
      notification = {
        user_id: @user.id,
        type: type,
        title: title,
        message: message,
        data: data,
        priority: priority,
        sent_at: Time.current,
        delivery_methods: @preferences.delivery_methods
      }
      
      # Store notification in database
      create_notification_record(notification) rescue nil
      
      # Send via email if enabled
      send_email_notification(notification) if @preferences.email_notifications
      
      # Send push notification if enabled
      send_push_notification(notification) if @preferences.push_notifications
      
      # Send in-app notification
      send_in_app_notification(notification) if @preferences.in_app_notifications
      
      notification
    end
    
    def create_notification_record(notification)
      # Check if UserNotification model exists
      if defined?(UserNotification) && UserNotification.respond_to?(:create!)
        UserNotification.create!(
          user_id: @user.id,
          notification_type: notification[:type],
          title: notification[:title],
          message: notification[:message],
          data: notification[:data],
          read: false,
          sent_at: notification[:sent_at]
        )
      else
        Rails.logger.warn "UserNotification model not defined, skipping database storage"
      end
    rescue => e
      Rails.logger.error "Failed to create notification record: #{e.message}"
      # Don't fail the entire notification if storage fails
    end
    
    def send_email_notification(notification)
      # Use the general notification method
      InvestorNotificationEmailService.send_notification(@user, notification)
    rescue => e
      Rails.logger.error "Failed to send email notification: #{e.message}"
      # Don't fail other notification methods
    end
    
    def send_push_notification(notification)
      # Integrate with your push notification service (e.g., FCM, APNS)
      # For now, we'll just log it
      Rails.logger.info "Push notification sent to user #{@user.id}: #{notification[:title]}"
    end
    
    def send_in_app_notification(notification)
      # Broadcast via ActionCable
      NotificationsChannel.broadcast_to(
        @user,
        type: 'notification',
        data: notification
      )
    end
    
    def should_send_summary_now?
      return false unless @preferences.preferred_time
      
      current_time = Time.current
      preferred_time = current_time.beginning_of_day + @preferences.preferred_time.seconds_since_midnight
      
      # Send within a 1-hour window
      (current_time - preferred_time).abs <= 30.minutes
    end
    
    def build_daily_summary_message(metrics)
      change = metrics.total_returns >= 0 ? "+" : ""
      "Portfolio: #{@user.currency_symbol}#{metrics.current_value.round(2)} (#{change}#{metrics.total_returns.round(2)}). " +
      "ROI: #{metrics.roi.round(2)}%. " +
      "Top performer: #{metrics.breakdown&.keys&.first&.title || 'N/A'}"
    end
    
    def build_weekly_summary_message(current_metrics, week_ago_metrics)
      change = calculate_weekly_change(current_metrics, week_ago_metrics)
      
      message = "Weekly Portfolio Summary:\n"
      message += "Value: #{@user.currency_symbol}#{current_metrics.current_value.round(2)} "
      
      if change[:value_change].abs > 0
        direction = change[:value_change] >= 0 ? "↗" : "↘"
        message += "(#{direction} #{@user.currency_symbol}#{change[:value_change].abs.round(2)})\n"
      else
        message += "\n"
      end
      
      message += "ROI: #{current_metrics.roi.round(2)}% "
      if change[:roi_change].abs > 0
        direction = change[:roi_change] >= 0 ? "+" : ""
        message += "(#{direction}#{change[:roi_change].round(2)}%)\n"
      else
        message += "\n"
      end
      
      message += "Investments: #{current_metrics.breakdown&.size || 0} campaigns"
      
      message
    end
    
    def calculate_weekly_change(current, week_ago)
      return { value_change: 0, roi_change: 0 } unless week_ago
      
      {
        value_change: current.current_value - week_ago.current_value,
        roi_change: current.roi - week_ago.roi
      }
    end
  end
end