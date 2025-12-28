# app/mailers/investor_notification_mailer.rb
class InvestorNotificationMailer < ApplicationMailer
  default from: 'Bantuhive Investor Relations <investor@bantuhive.com>'
  
  def send_notification(user, notification)
    @user = user
    @notification = notification
    
    mail(
      to: @user.email,
      subject: @notification[:title]
    ) do |format|
      format.html { render "investor_notification" }
      format.text { render "investor_notification" }
    end
  end
  
  def valuation_update(user, campaign, old_valuation, new_valuation, investment)
    @user = user
    @campaign = campaign
    @old_valuation = old_valuation
    @new_valuation = new_valuation
    @investment = investment
    @percentage_change = old_valuation.zero? ? 0 : ((new_valuation - old_valuation) / old_valuation * 100).round(2)
    
    mail(
      to: @user.email,
      subject: "Valuation Update: #{@campaign.company_name}"
    )
  end
  
  def financial_statement_published(user, statement)
    @user = user
    @statement = statement
    @campaign = statement.campaign
    
    mail(
      to: @user.email,
      subject: "New Financial Statement: #{@campaign.company_name}"
    )
  end
  
  def investor_report_published(user, report)
    @user = user
    @report = report
    @campaign = report.campaign
    
    mail(
      to: @user.email,
      subject: "New #{report.report_type.capitalize} Report: #{@campaign.company_name}"
    )
  end
  
  def portfolio_summary(user, portfolio_data, period)
    @user = user
    @portfolio_data = portfolio_data
    @period = period
    
    mail(
      to: @user.email,
      subject: "#{period.capitalize} Portfolio Summary - #{Date.current.to_formatted_s(:long)}"
    )
  end
end