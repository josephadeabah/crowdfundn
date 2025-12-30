# app/services/investor_notification_email_service.rb
class InvestorNotificationEmailService
  DEFAULT_FROM = 'Bantuhive Investor Relations <investor@bantuhive.com>'.freeze

  def self.send_notification(user, notification)
    return false unless user.is_a?(User) && notification.is_a?(Hash)

    html_content = build_notification_html(user, notification)
    text_content = build_notification_text(user, notification)

    send_email(
      to_email: user.email,
      to_name: user.full_name,
      subject: notification[:title],
      html_content: html_content,
      text_content: text_content,
      category: 'investor_notification'
    )
  end

  def self.valuation_update(user, campaign, old_valuation, new_valuation, investment)
    return false unless validate_valuation_params(user, campaign, old_valuation, new_valuation, investment)

    percentage_change = old_valuation.zero? ? 0 : ((new_valuation - old_valuation) / old_valuation * 100).round(2)
    new_investment_value = (investment.percentage / 100) * new_valuation
    value_change = new_investment_value - (investment.current_value || investment.amount)

    html_content = build_valuation_update_html(user, campaign, old_valuation, new_valuation, 
                                               percentage_change, investment, new_investment_value, value_change)
    text_content = build_valuation_update_text(user, campaign, old_valuation, new_valuation,
                                               percentage_change, investment, new_investment_value, value_change)

    send_email(
      to_email: user.email,
      to_name: user.full_name,
      subject: "Valuation Update: #{campaign.company_name}",
      html_content: html_content,
      text_content: text_content,
      category: 'valuation_update'
    )
  end

  def self.financial_statement_published(user, statement)
    return false unless validate_financial_statement_params(user, statement)

    campaign = statement.campaign
    html_content = build_financial_statement_html(user, statement, campaign)
    text_content = build_financial_statement_text(user, statement, campaign)

    send_email(
      to_email: user.email,
      to_name: user.full_name,
      subject: "New Financial Statement: #{campaign.company_name}",
      html_content: html_content,
      text_content: text_content,
      category: 'financial_statement'
    )
  end

  def self.investor_report_published(user, report)
    return false unless validate_report_params(user, report)

    campaign = report.campaign
    html_content = build_investor_report_html(user, report, campaign)
    text_content = build_investor_report_text(user, report, campaign)

    send_email(
      to_email: user.email,
      to_name: user.full_name,
      subject: "New #{report.report_type.capitalize} Report: #{campaign.company_name}",
      html_content: html_content,
      text_content: text_content,
      category: 'investor_report'
    )
  end

  def self.portfolio_summary(user, portfolio_data, period)
    return false unless validate_portfolio_params(user, portfolio_data, period)

    html_content = build_portfolio_summary_html(user, portfolio_data, period)
    text_content = build_portfolio_summary_text(user, portfolio_data, period)

    send_email(
      to_email: user.email,
      to_name: user.full_name,
      subject: "#{period.capitalize} Portfolio Summary - #{Date.current.to_formatted_s(:long)}",
      html_content: html_content,
      text_content: text_content,
      category: 'portfolio_summary'
    )
  end

  private

  def self.validate_valuation_params(user, campaign, old_valuation, new_valuation, investment)
    user.is_a?(User) && campaign.is_a?(Campaign) && 
    old_valuation.is_a?(Numeric) && new_valuation.is_a?(Numeric) &&
    investment.is_a?(EquityInvestment)
  end

  def self.validate_financial_statement_params(user, statement)
    user.is_a?(User) && statement.is_a?(FinancialStatement)
  end

  def self.validate_report_params(user, report)
    user.is_a?(User) && report.is_a?(InvestorReport)
  end

  def self.validate_portfolio_params(user, portfolio_data, period)
    user.is_a?(User) && portfolio_data.is_a?(Hash) && period.is_a?(String)
  end

  def self.build_notification_html(user, notification)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>#{notification[:title]}</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2c3e50;
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-message {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .footer {
              background-color: #f0f2f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e1e4e8;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Investor Notification</h1>
            </div>

            <div class="content">
              <p>Hello #{user.full_name},</p>
              
              <div class="notification-message">
                <h3>#{notification[:title]}</h3>
                <p>#{notification[:message]}</p>
              </div>

              <p>You can view more details in your investor dashboard.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Investor Relations Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you are an investor on Bantuhive.</p>
              <p>© #{Time.current.year} Bantuhive Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_notification_text(user, notification)
    <<~TEXT
      Investor Notification
      
      Hello #{user.full_name},
      
      #{notification[:title]}
      
      #{notification[:message]}
      
      You can view more details in your investor dashboard.
      
      Best regards,
      The Bantuhive Investor Relations Team
      
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.build_valuation_update_html(user, campaign, old_valuation, new_valuation, 
                                      percentage_change, investment, new_investment_value, value_change)
    direction = value_change >= 0 ? 'increase' : 'decrease'
    arrow = value_change >= 0 ? '↗' : '↘'
    
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Valuation Update</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2c3e50;
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-message {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .footer {
              background-color: #f0f2f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e1e4e8;
            }
          
            .valuation-details {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #{value_change >= 0 ? '#27ae60' : '#e74c3c'};
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: 600;
              width: 200px;
              color: #555;
            }
            .detail-value {
              flex: 1;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Valuation Update</h1>
            </div>

            <div class="content">
              <p>Hello #{user.full_name},</p>
              <p>The valuation of <strong>#{campaign.company_name}</strong> has been updated.</p>
              
              <div class="valuation-details">
                <div class="detail-row">
                  <span class="detail-label">Previous Valuation:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{old_valuation.round(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">New Valuation:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{new_valuation.round(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Change:</span>
                  <span class="detail-value">#{arrow} #{percentage_change}%</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Your Investment Value:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{new_investment_value.round(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Value Change:</span>
                  <span class="detail-value">#{campaign.currency_symbol}#{value_change.abs.round(2)} #{direction}</span>
                </div>
              </div>

              <p>This valuation update reflects the company's current market position and performance.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Investor Relations Team</strong></p>
            </div>

            <div class="footer">
              <p>© #{Time.current.year} Bantuhive Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_valuation_update_text(user, campaign, old_valuation, new_valuation,
                                      percentage_change, investment, new_investment_value, value_change)
    direction = value_change >= 0 ? 'increase' : 'decrease'
    
    <<~TEXT
      Valuation Update: #{campaign.company_name}
      
      Hello #{user.full_name},
      
      The valuation of #{campaign.company_name} has been updated:
      
      Previous Valuation: #{campaign.currency_symbol}#{old_valuation.round(2)}
      New Valuation: #{campaign.currency_symbol}#{new_valuation.round(2)}
      Change: #{percentage_change}%
      Your Investment Value: #{campaign.currency_symbol}#{new_investment_value.round(2)}
      Value Change: #{campaign.currency_symbol}#{value_change.abs.round(2)} #{direction}
      
      This valuation update reflects the company's current market position and performance.
      
      Best regards,
      The Bantuhive Investor Relations Team
      
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.build_financial_statement_html(user, statement, campaign)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Financial Statement</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2c3e50;
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-message {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .footer {
              background-color: #f0f2f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e1e4e8;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Financial Statement Published</h1>
            </div>

            <div class="content">
              <p>Hello #{user.full_name},</p>
              <p>A new financial statement has been published for <strong>#{campaign.company_name}</strong>.</p>
              
              <div class="financial-details">
                <p><strong>Period:</strong> #{statement.period_start.to_s(:short)} - #{statement.period_end.to_s(:short)}</p>
                <p><strong>Type:</strong> #{statement.period_type.capitalize}</p>
                <p><strong>Revenue:</strong> #{campaign.currency_symbol}#{statement.revenue.round(2)}</p>
                <p><strong>Net Income:</strong> #{campaign.currency_symbol}#{statement.net_income.round(2)}</p>
                <p><strong>Gross Margin:</strong> #{statement.gross_margin}%</p>
                <p><strong>Net Margin:</strong> #{statement.net_margin}%</p>
              </div>

              <p>You can view the full financial statement in your investor dashboard.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Investor Relations Team</strong></p>
            </div>

            <div class="footer">
              <p>© #{Time.current.year} Bantuhive Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_financial_statement_text(user, statement, campaign)
    <<~TEXT
      New Financial Statement: #{campaign.company_name}
      
      Hello #{user.full_name},
      
      A new financial statement has been published for #{campaign.company_name}:
      
      Period: #{statement.period_start.to_s(:short)} - #{statement.period_end.to_s(:short)}
      Type: #{statement.period_type.capitalize}
      Revenue: #{campaign.currency_symbol}#{statement.revenue.round(2)}
      Net Income: #{campaign.currency_symbol}#{statement.net_income.round(2)}
      Gross Margin: #{statement.gross_margin}%
      Net Margin: #{statement.net_margin}%
      
      You can view the full financial statement in your investor dashboard.
      
      Best regards,
      The Bantuhive Investor Relations Team
      
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.build_investor_report_html(user, report, campaign)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investor Report</title>
           <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2c3e50;
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-message {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .footer {
              background-color: #f0f2f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e1e4e8;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Investor Report Published</h1>
            </div>

            <div class="content">
              <p>Hello #{user.full_name},</p>
              <p>A new #{report.report_type} report has been published for <strong>#{campaign.company_name}</strong>.</p>
              
              <div class="report-details">
                <p><strong>Title:</strong> #{report.title}</p>
                <p><strong>Report Date:</strong> #{report.report_date.to_formatted_s(:long)}</p>
                <p><strong>Period:</strong> #{report.period_description}</p>
              </div>

              <p>You can download the full report from your investor dashboard.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Investor Relations Team</strong></p>
            </div>

            <div class="footer">
              <p>© #{Time.current.year} Bantuhive Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_investor_report_text(user, report, campaign)
    <<~TEXT
      New #{report.report_type.capitalize} Report: #{campaign.company_name}
      
      Hello #{user.full_name},
      
      A new #{report.report_type} report has been published for #{campaign.company_name}:
      
      Title: #{report.title}
      Report Date: #{report.report_date.to_formatted_s(:long)}
      Period: #{report.period_description}
      
      You can download the full report from your investor dashboard.
      
      Best regards,
      The Bantuhive Investor Relations Team
      
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.build_portfolio_summary_html(user, portfolio_data, period)
    summary = portfolio_data[:summary] || {}
    currency_symbol = summary[:currency_symbol] || '$'
    
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Portfolio Summary</title>
          <style>
            body {
              font-family: 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f5f7fa;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2c3e50;
              padding: 30px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .content {
              padding: 30px;
            }
            .notification-message {
              background-color: #f8f9fa;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .footer {
              background-color: #f0f2f5;
              padding: 20px;
              text-align: center;
              font-size: 14px;
              color: #666;
              border-top: 1px solid #e1e4e8;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Portfolio Summary</h1>
            </div>

            <div class="content">
              <p>Hello #{user.full_name},</p>
              <p>Here's your #{period} portfolio summary:</p>
              
              <div class="portfolio-summary">
                <p><strong>Total Invested:</strong> #{currency_symbol}#{summary[:total_invested]&.round(2) || 0}</p>
                <p><strong>Current Value:</strong> #{currency_symbol}#{summary[:current_value]&.round(2) || 0}</p>
                <p><strong>Total Returns:</strong> #{currency_symbol}#{summary[:total_returns]&.round(2) || 0}</p>
                <p><strong>ROI:</strong> #{summary[:roi]&.round(2) || 0}%</p>
                <p><strong>MOIC:</strong> #{summary[:moic]&.round(2) || 0}x</p>
              </div>

              <p>You can view your detailed portfolio in your investor dashboard.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Investor Relations Team</strong></p>
            </div>

            <div class="footer">
              <p>© #{Time.current.year} Bantuhive Ltd. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_portfolio_summary_text(user, portfolio_data, period)
    summary = portfolio_data[:summary] || {}
    currency_symbol = summary[:currency_symbol] || '$'
    
    <<~TEXT
      #{period.capitalize} Portfolio Summary
      
      Hello #{user.full_name},
      
      Here's your #{period} portfolio summary:
      
      Total Invested: #{currency_symbol}#{summary[:total_invested]&.round(2) || 0}
      Current Value: #{currency_symbol}#{summary[:current_value]&.round(2) || 0}
      Total Returns: #{currency_symbol}#{summary[:total_returns]&.round(2) || 0}
      ROI: #{summary[:roi]&.round(2) || 0}%
      MOIC: #{summary[:moic]&.round(2) || 0}x
      
      You can view your detailed portfolio in your investor dashboard.
      
      Best regards,
      The Bantuhive Investor Relations Team
      
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.send_email(to_email:, to_name:, subject:, html_content:, text_content:, category:)
    begin
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: to_email,
          name: to_name
        }],
        subject: subject,
        htmlContent: html_content,
        textContent: text_content,
        sender: {
          name: 'Bantuhive Investor Relations',
          email: 'investor@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => category
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent #{category} email to #{to_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send #{category} email: #{e.message}"
      false
    end
  end
end