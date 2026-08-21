# app/services/investor_notification_email_service.rb
class InvestorNotificationEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investor Relations')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Public Methods
    def send_notification(user, notification)
      return false unless validate_user(user)
      return false unless notification.is_a?(Hash)

      html_content = build_notification_html(user, notification)
      text_content = build_notification_text(user, notification)

      send_email(
        to_email: user.email,
        to_name: user.full_name,
        subject: notification[:title],
        html_content: html_content,
        text_content: text_content,
        category: 'investor_notification',
        user: user
      )
    end

    def valuation_update(user, campaign, old_valuation, new_valuation, investment)
      return false unless validate_valuation_params(user, campaign, old_valuation, new_valuation, investment)

      percentage_change = calculate_percentage_change(old_valuation, new_valuation)
      new_investment_value = (investment.percentage / 100) * new_valuation
      value_change = new_investment_value - (investment.current_value || investment.amount)

      html_content = build_valuation_update_html(
        user, campaign, old_valuation, new_valuation,
        percentage_change, investment, new_investment_value, value_change
      )
      text_content = build_valuation_update_text(
        user, campaign, old_valuation, new_valuation,
        percentage_change, investment, new_investment_value, value_change
      )

      send_email(
        to_email: user.email,
        to_name: user.full_name,
        subject: "Valuation Update: #{campaign.company_name}",
        html_content: html_content,
        text_content: text_content,
        category: 'valuation_update',
        user: user
      )
    end

    def financial_statement_published(user, statement)
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
        category: 'financial_statement',
        user: user
      )
    end

    def investor_report_published(user, report)
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
        category: 'investor_report',
        user: user
      )
    end

    def portfolio_summary(user, portfolio_data, period)
      return false unless validate_portfolio_params(user, portfolio_data, period)

      html_content = build_portfolio_summary_html(user, portfolio_data, period)
      text_content = build_portfolio_summary_text(user, portfolio_data, period)

      send_email(
        to_email: user.email,
        to_name: user.full_name,
        subject: "#{period.capitalize} Portfolio Summary - #{Date.current.strftime('%B %d, %Y')}",
        html_content: html_content,
        text_content: text_content,
        category: 'portfolio_summary',
        user: user
      )
    end

    def test_email(user)
      return false unless validate_user(user)

      test_notification = {
        title: "Test Email Notification",
        message: "This is a test email to verify that the investor notification system is working properly.",
        type: :test,
        timestamp: Time.current.iso8601
      }

      send_notification(user, test_notification)
    end

    def send_welcome_email(user)
      return false unless validate_user(user)

      welcome_notification = {
        title: "Welcome to Bantuhive Investor Relations",
        message: "Thank you for joining Bantuhive as an investor. You will receive notifications about your investments, financial statements, and reports here.",
        type: :welcome,
        action_text: "View Your Dashboard",
        action_url: "#{frontend_url}/investors/dashboard"
      }

      send_notification(user, welcome_notification)
    end

    def send_bulk_notification(users, notification)
      return false unless users.is_a?(Array) && users.all? { |u| u.is_a?(User) }
      return false unless notification.is_a?(Hash)

      results = []
      users.each_slice(50) do |batch|
        batch.each do |user|
          result = send_notification(user, notification)
          results << result
        end
        sleep 0.5 # Rate limiting
      end

      results.all?
    end

    private

    # Validation Methods
    def validate_user(user)
      user.is_a?(User) && user.email.present?
    end

    def validate_valuation_params(user, campaign, old_valuation, new_valuation, investment)
      validate_user(user) &&
      campaign.is_a?(Campaign) &&
      old_valuation.is_a?(Numeric) &&
      new_valuation.is_a?(Numeric) &&
      investment.is_a?(EquityInvestment)
    end

    def validate_financial_statement_params(user, statement)
      validate_user(user) &&
      statement.is_a?(FinancialStatement) &&
      statement.campaign.present?
    end

    def validate_report_params(user, report)
      validate_user(user) &&
      report.is_a?(InvestorReport) &&
      report.campaign.present?
    end

    def validate_portfolio_params(user, portfolio_data, period)
      validate_user(user) &&
      portfolio_data.is_a?(Hash) &&
      period.is_a?(String)
    end

    # Helper Methods
    def calculate_percentage_change(old_value, new_value)
      return 0 if old_value.zero?
      ((new_value - old_value) / old_value * 100).round(2)
    end

    def number_with_delimiter(number)
      return '0' if number.nil? || number == 0

      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end

    def format_date(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y')
    rescue => e
      date.to_s
    end

    # Builders - HTML
    def build_notification_html(user, notification)
      action_url = notification[:action_url] || "#{frontend_url}/investors/dashboard"
      action_text = notification[:action_text] || "View Dashboard"
      timestamp = notification[:timestamp] || Time.current.iso8601

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>#{notification[:title]}</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2c3e50;">
                <h1>📬 Investor Notification</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user.full_name},</p>

                <div class="notification-message">
                  <h3>#{notification[:title]}</h3>
                  <p>#{notification[:message]}</p>
                  #{"<p><small>Sent: #{timestamp}</small></p>" if notification[:type] == :test}
                </div>

                <div class="action-section">
                  <a href="#{action_url}" class="cta-button">#{action_text}</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions?</strong> Contact our investor relations team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_valuation_update_html(user, campaign, old_valuation, new_valuation,
                                   percentage_change, investment, new_investment_value, value_change)
      direction = value_change >= 0 ? 'increase' : 'decrease'
      arrow = value_change >= 0 ? '📈' : '📉'
      color = value_change >= 0 ? '#27ae60' : '#e74c3c'

      formatted_old = number_with_delimiter(old_valuation)
      formatted_new = number_with_delimiter(new_valuation)
      formatted_value = number_with_delimiter(new_investment_value)
      formatted_change = number_with_delimiter(value_change.abs)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Valuation Update</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{color};">
                <h1>#{arrow} Valuation Update</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user.full_name},</p>

                <p>The valuation of <strong>#{campaign.company_name}</strong> has been updated.</p>

                <div class="investment-details" style="border-left-color: #{color};">
                  <div class="detail-row">
                    <span class="detail-label">📊 Previous Valuation:</span>
                    <span class="detail-value">#{campaign.currency_symbol} #{formatted_old}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📊 New Valuation:</span>
                    <span class="detail-value" style="font-weight: bold; color: #{color};">#{campaign.currency_symbol} #{formatted_new}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📈 Change:</span>
                    <span class="detail-value" style="color: #{color};">#{arrow} #{percentage_change}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">💰 Your Investment Value:</span>
                    <span class="detail-value">#{campaign.currency_symbol} #{formatted_value}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Value Change:</span>
                    <span class="detail-value" style="color: #{color};">#{campaign.currency_symbol} #{formatted_change} #{direction}</span>
                  </div>
                </div>

                <p>This valuation update reflects the company's current market position and performance.</p>

                <div class="action-section">
                  <a href="#{frontend_url}/investments/#{investment.id}" class="cta-button">View Investment Details</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this valuation?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_financial_statement_html(user, statement, campaign)
      period_start = format_date(statement.period_start)
      period_end = format_date(statement.period_end)

      formatted_revenue = number_with_delimiter(statement.revenue)
      formatted_net_income = number_with_delimiter(statement.net_income)
      formatted_ebitda = number_with_delimiter(statement.ebitda) if statement.respond_to?(:ebitda)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Financial Statement</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2980b9;">
                <h1>📊 Financial Statement Published</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user.full_name},</p>

                <p>A new financial statement has been published for <strong>#{campaign.company_name}</strong>.</p>

                <div class="investment-details" style="border-left-color: #2980b9;">
                  <div class="detail-row">
                    <span class="detail-label">📅 Period:</span>
                    <span class="detail-value">#{period_start} - #{period_end}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Type:</span>
                    <span class="detail-value">#{statement.period_type.capitalize}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">💰 Revenue:</span>
                    <span class="detail-value" style="font-weight: bold;">#{campaign.currency_symbol} #{formatted_revenue}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Net Income:</span>
                    <span class="detail-value">#{campaign.currency_symbol} #{formatted_net_income}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📈 EBITDA:</span>
                    <span class='detail-value'>#{campaign.currency_symbol} #{formatted_ebitda}</span>
                  </div>" if formatted_ebitda}
                  <div class="detail-row">
                    <span class="detail-label">📊 Gross Margin:</span>
                    <span class="detail-value">#{statement.gross_margin}%</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Net Margin:</span>
                    <span class="detail-value">#{statement.net_margin}%</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/investments/#{campaign.id}/financials" class="cta-button">View Full Statement</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about these financials?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_investor_report_html(user, report, campaign)
      report_date = format_date(report.report_date)

      period_desc = if report.period_start && report.period_end
        "#{format_date(report.period_start)} - #{format_date(report.period_end)}"
      else
        "As of #{report_date}"
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investor Report</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #8e44ad;">
                <h1>📄 Investor Report Published</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user.full_name},</p>

                <p>A new <strong>#{report.report_type}</strong> report has been published for <strong>#{campaign.company_name}</strong>.</p>

                <div class="investment-details" style="border-left-color: #8e44ad;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Title:</span>
                    <span class="detail-value">#{report.title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Report Date:</span>
                    <span class="detail-value">#{report_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Period:</span>
                    <span class="detail-value">#{period_desc}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📝 Summary:</span>
                    <span class='detail-value'>#{report.summary}</span>
                  </div>" if report.respond_to?(:summary) && report.summary.present?}
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/investments/#{campaign.id}/reports/#{report.id}" class="cta-button">Download Report</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about this report?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_portfolio_summary_html(user, portfolio_data, period)
      summary = portfolio_data[:summary] || {}
      currency_symbol = summary[:currency_symbol] || '$'

      formatted_invested = number_with_delimiter(summary[:total_invested])
      formatted_current = number_with_delimiter(summary[:current_value])
      formatted_returns = number_with_delimiter(summary[:total_returns])
      roi = summary[:roi]&.round(2) || 0
      roi_color = roi >= 0 ? '#27ae60' : '#e74c3c'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Portfolio Summary</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #16a085;">
                <h1>💼 Portfolio Summary</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user.full_name},</p>

                <p>Here's your <strong>#{period}</strong> portfolio summary:</p>

                <div class="investment-details" style="border-left-color: #16a085;">
                  <div class="detail-row">
                    <span class="detail-label">💰 Total Invested:</span>
                    <span class="detail-value">#{currency_symbol} #{formatted_invested}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📈 Current Value:</span>
                    <span class="detail-value" style="font-weight: bold;">#{currency_symbol} #{formatted_current}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Total Returns:</span>
                    <span class="detail-value" style="color: #{summary[:total_returns]&.>= 0 ? '#27ae60' : '#e74c3c'};">#{currency_symbol} #{formatted_returns}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🎯 ROI:</span>
                    <span class="detail-value" style="font-weight: bold; color: #{roi_color};">#{roi}%</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📈 MOIC:</span>
                    <span class='detail-value'>#{summary[:moic]&.round(2) || 0}x</span>
                  </div>" if summary[:moic].present?}
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/investors/portfolio" class="cta-button">View Full Portfolio</a>
                </div>

                <div class="support-section">
                  <p><strong>Need investment advice?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Best regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_notification_text(user, notification)
      action_text = notification[:action_text] || "View Dashboard"
      action_url = notification[:action_url] || "#{frontend_url}/investors/dashboard"

      <<~TEXT
        Investor Notification

        Dear #{user.full_name},

        #{notification[:title]}

        #{notification[:message]}

        #{action_text}: #{action_url}

        Questions? Contact our investor relations team: #{support_email}

        Best regards,
        #{sender_name}

        You are receiving this email because you are an investor on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    def build_valuation_update_text(user, campaign, old_valuation, new_valuation,
                                   percentage_change, investment, new_investment_value, value_change)
      direction = value_change >= 0 ? 'increase' : 'decrease'
      formatted_old = number_with_delimiter(old_valuation)
      formatted_new = number_with_delimiter(new_valuation)
      formatted_value = number_with_delimiter(new_investment_value)
      formatted_change = number_with_delimiter(value_change.abs)

      <<~TEXT
        Valuation Update: #{campaign.company_name}

        Dear #{user.full_name},

        The valuation of #{campaign.company_name} has been updated:

        Previous Valuation: #{campaign.currency_symbol} #{formatted_old}
        New Valuation: #{campaign.currency_symbol} #{formatted_new}
        Change: #{percentage_change}%
        Your Investment Value: #{campaign.currency_symbol} #{formatted_value}
        Value Change: #{campaign.currency_symbol} #{formatted_change} #{direction}

        This valuation update reflects the company's current market position and performance.

        View Investment Details: #{frontend_url}/investments/#{investment.id}

        Questions about this valuation? Contact our team: #{support_email}

        Best regards,
        #{sender_name}

        You are receiving this email because you are an investor on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    def build_financial_statement_text(user, statement, campaign)
      period_start = format_date(statement.period_start)
      period_end = format_date(statement.period_end)
      formatted_revenue = number_with_delimiter(statement.revenue)
      formatted_net_income = number_with_delimiter(statement.net_income)

      <<~TEXT
        New Financial Statement: #{campaign.company_name}

        Dear #{user.full_name},

        A new financial statement has been published for #{campaign.company_name}:

        Period: #{period_start} - #{period_end}
        Type: #{statement.period_type.capitalize}
        Revenue: #{campaign.currency_symbol} #{formatted_revenue}
        Net Income: #{campaign.currency_symbol} #{formatted_net_income}
        Gross Margin: #{statement.gross_margin}%
        Net Margin: #{statement.net_margin}%

        View Full Statement: #{frontend_url}/investments/#{campaign.id}/financials

        Questions about these financials? Contact our team: #{support_email}

        Best regards,
        #{sender_name}

        You are receiving this email because you are an investor on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    def build_investor_report_text(user, report, campaign)
      report_date = format_date(report.report_date)

      period_desc = if report.period_start && report.period_end
        "#{format_date(report.period_start)} - #{format_date(report.period_end)}"
      else
        "As of #{report_date}"
      end

      text = <<~TEXT
        New #{report.report_type.capitalize} Report: #{campaign.company_name}

        Dear #{user.full_name},

        A new #{report.report_type} report has been published for #{campaign.company_name}:

        Title: #{report.title}
        Report Date: #{report_date}
        Period: #{period_desc}
      TEXT

      if report.respond_to?(:summary) && report.summary.present?
        text += "\nSummary: #{report.summary}"
      end

      text += <<~TEXT

        Download Report: #{frontend_url}/investments/#{campaign.id}/reports/#{report.id}

        Questions about this report? Contact our team: #{support_email}

        Best regards,
        #{sender_name}

        You are receiving this email because you are an investor on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    def build_portfolio_summary_text(user, portfolio_data, period)
      summary = portfolio_data[:summary] || {}
      currency_symbol = summary[:currency_symbol] || '$'

      formatted_invested = number_with_delimiter(summary[:total_invested])
      formatted_current = number_with_delimiter(summary[:current_value])
      formatted_returns = number_with_delimiter(summary[:total_returns])
      roi = summary[:roi]&.round(2) || 0

      text = <<~TEXT
        #{period.capitalize} Portfolio Summary

        Dear #{user.full_name},

        Here's your #{period} portfolio summary:

        Total Invested: #{currency_symbol} #{formatted_invested}
        Current Value: #{currency_symbol} #{formatted_current}
        Total Returns: #{currency_symbol} #{formatted_returns}
        ROI: #{roi}%
      TEXT

      if summary[:moic].present?
        text += "MOIC: #{summary[:moic]&.round(2) || 0}x"
      end

      text += <<~TEXT

        View Full Portfolio: #{frontend_url}/investors/portfolio

        Need investment advice? Contact our team: #{support_email}

        Best regards,
        #{sender_name}

        You are receiving this email because you are an investor on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(to_email:, to_name:, subject:, html_content:, text_content:, category:, user: nil)
      return false if to_email.blank?

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
            name: sender_name,
            email: sender_email
          },
          headers: {
            'X-Mailin-custom' => category,
            'X-Entity-Ref-ID' => "#{category}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => category,
            'X-Priority' => '3 (Normal)',
            'List-Unsubscribe' => "<#{frontend_url}/unsubscribe?email=#{to_email}>"
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(to_email, category, user)
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending #{category} to #{to_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send #{category} email to #{to_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(to_email, category, user)
      log_data = {
        recipient_email: to_email,
        category: category,
        user_id: user&.id,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Investor notification email sent: #{log_data.to_json}"
    end

    # Email Styles
    def email_styles
      <<~CSS
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
          font-size: 28px;
          font-weight: 600;
        }
        .content {
          padding: 30px;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .notification-message {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .notification-message h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .investment-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px solid #e8e8e8;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-row.highlight {
          background-color: #eaf2f8;
          border-radius: 4px;
          padding: 8px 0;
        }
        .detail-label {
          font-weight: 600;
          width: 200px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px 0;
        }
        .cta-button:hover {
          opacity: 0.9;
        }
        .support-section {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          text-align: center;
        }
        .support-section a {
          color: #2980b9;
          text-decoration: none;
        }
        .support-section a:hover {
          text-decoration: underline;
        }
        .footer {
          background-color: #f0f2f5;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #e1e4e8;
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: #2c3e50;
          text-decoration: none;
          margin: 0 10px;
          font-weight: 500;
        }
        .social-links a:hover {
          text-decoration: underline;
        }
        .company-address {
          font-size: 13px;
          color: #777;
          margin-top: 15px;
        }
        .unsubscribe {
          font-size: 12px;
          color: #999;
          margin-top: 15px;
        }
        @media only screen and (max-width: 480px) {
          .detail-row {
            flex-direction: column;
          }
          .detail-label {
            width: 100%;
            margin-bottom: 2px;
          }
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 22px;
          }
          .cta-button {
            display: block;
            margin: 10px 0;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you are an investor on Bantuhive.</p>

          <div class="social-links">
            <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
            <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
            <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
          </div>

          <div class="company-address">
            27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
          </div>

          <p style="margin-top: 15px;">
            <a href="#{frontend_url}" style="color: #2c3e50; text-decoration: none;">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a>
          </p>

          <p class="unsubscribe">
            <a href="#{frontend_url}/unsubscribe" style="color: #999; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      HTML
    end
  end
end