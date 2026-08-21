# app/services/investment_value_change_email_service.rb
class InvestmentValueChangeEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'investments@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def template_id
      ENV.fetch('BREVO_INVESTMENT_VALUE_CHANGE_TEMPLATE_ID', 3).to_i
    end

    # Main Method
    def send_notification_email(investment, previous_value: nil)
      # Validate investment
      return false unless validate_investment(investment)
      return false unless investment.user
      return false unless investment.user.email.present?

      user = investment.user
      campaign = investment.campaign
      
      # Extract financial details
      investment_amount = investment.amount.to_f
      current_value = investment.current_value.to_f
      total_returns = investment.total_returns.to_f
      roi = investment.roi.to_f
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Calculate change
      previous_value = previous_value || investment.previous_value || current_value
      value_change = current_value - previous_value
      change_percentage = previous_value > 0 ? (value_change / previous_value * 100).round(2) : 0
      
      # Determine if positive or negative change
      is_positive = value_change >= 0
      change_emoji = is_positive ? '📈' : '📉'
      change_color = is_positive ? '#27ae60' : '#e74c3c'
      change_direction = is_positive ? 'increased' : 'decreased'
      
      # Build URLs
      portfolio_url = build_portfolio_url(user)
      investment_url = build_investment_url(investment)
      support_url = "#{frontend_url}/support"

      subject = build_subject(campaign, is_positive)

      html_content = build_html_content(
        user_name: user.full_name,
        campaign_name: campaign.title,
        investment_amount: investment_amount,
        current_value: current_value,
        total_returns: total_returns,
        roi: roi,
        currency_symbol: currency_symbol,
        previous_value: previous_value,
        value_change: value_change,
        change_percentage: change_percentage,
        is_positive: is_positive,
        change_emoji: change_emoji,
        change_color: change_color,
        change_direction: change_direction,
        update_date: investment.updated_at.strftime('%B %d, %Y'),
        portfolio_url: portfolio_url,
        investment_url: investment_url,
        support_url: support_url,
        campaign: campaign,
        investment: investment
      )

      text_content = build_text_content(
        user_name: user.full_name,
        campaign_name: campaign.title,
        investment_amount: investment_amount,
        current_value: current_value,
        total_returns: total_returns,
        roi: roi,
        currency_symbol: currency_symbol,
        previous_value: previous_value,
        value_change: value_change,
        change_percentage: change_percentage,
        is_positive: is_positive,
        change_direction: change_direction,
        update_date: investment.updated_at.strftime('%B %d, %Y'),
        portfolio_url: portfolio_url,
        investment_url: investment_url,
        support_url: support_url,
        campaign: campaign
      )

      result = send_email(
        user.email,
        user.full_name,
        subject,
        html_content,
        text_content,
        investment
      )

      if result
        log_email_sent(investment, user.email, is_positive)
      end

      result
    end

    private

    # Validation Methods
    def validate_investment(investment)
      return false unless investment
      return false unless investment.is_a?(EquityInvestment)
      return false unless investment.campaign
      return false unless investment.user
      true
    end

    # URL Builders
    def build_portfolio_url(user)
      "#{frontend_url}/investors/portfolio"
    end

    def build_investment_url(investment)
      "#{frontend_url}/investments/#{investment.id}"
    end

    # Subject Builder
    def build_subject(campaign, is_positive)
      if is_positive
        "📈 Good News! Your investment in #{campaign.company_name} has increased"
      else
        "📉 Your investment in #{campaign.company_name} has changed"
      end
    end

    # HTML Content Builder
    def build_html_content(
      user_name:,
      campaign_name:,
      investment_amount:,
      current_value:,
      total_returns:,
      roi:,
      currency_symbol:,
      previous_value:,
      value_change:,
      change_percentage:,
      is_positive:,
      change_emoji:,
      change_color:,
      change_direction:,
      update_date:,
      portfolio_url:,
      investment_url:,
      support_url:,
      campaign:,
      investment:
    )
      formatted_investment = number_with_delimiter(investment_amount)
      formatted_current = number_with_delimiter(current_value)
      formatted_previous = number_with_delimiter(previous_value)
      formatted_change = number_with_delimiter(value_change.abs)
      formatted_returns = number_with_delimiter(total_returns)
      formatted_roi = roi.to_s

      # Determine performance message
      performance_message = if roi > 20
        "🌟 Outstanding performance! Your investment is significantly outperforming expectations."
      elsif roi > 10
        "💪 Strong performance! Your investment continues to grow steadily."
      elsif roi > 0
        "📈 Positive growth! Your investment is moving in the right direction."
      elsif roi > -5
        "📊 Moderate adjustment. Market fluctuations are normal."
      else
        "📉 Significant adjustment. We recommend reviewing your investment strategy."
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Value Update</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{is_positive ? '#27ae60' : '#2c3e50'};">
                <h1>#{change_emoji} Investment Update</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user_name},</p>
                
                <p>Your investment in <strong>#{campaign_name}</strong> has <strong style="color: #{change_color};">#{change_direction}</strong> in value.</p>

                <div class="change-summary" style="border-left-color: #{change_color};">
                  <div class="change-indicator">
                    <span style="font-size: 32px;">#{change_emoji}</span>
                    <span style="font-size: 24px; font-weight: bold; color: #{change_color};">
                      #{is_positive ? '+' : ''}#{change_percentage}%
                    </span>
                  </div>
                  <p style="margin: 5px 0;">Value #{change_direction} by <strong>#{currency_symbol} #{formatted_change}</strong></p>
                </div>

                <div class="investment-stats">
                  <div class="stats-grid">
                    <div class="stat-card">
                      <span class="stat-label">💰 Original Investment</span>
                      <span class="stat-value">#{currency_symbol} #{formatted_investment}</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-label">📊 Previous Value</span>
                      <span class="stat-value">#{currency_symbol} #{formatted_previous}</span>
                    </div>
                    <div class="stat-card highlight">
                      <span class="stat-label">📈 Current Value</span>
                      <span class="stat-value" style="color: #{change_color}; font-weight: bold;">#{currency_symbol} #{formatted_current}</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-label">📈 Total Returns</span>
                      <span class="stat-value" style="color: #{total_returns >= 0 ? '#27ae60' : '#e74c3c'};">#{currency_symbol} #{formatted_returns}</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-label">🎯 ROI</span>
                      <span class="stat-value" style="color: #{roi >= 0 ? '#27ae60' : '#e74c3c'};">#{formatted_roi}%</span>
                    </div>
                    <div class="stat-card">
                      <span class="stat-label">📅 Last Updated</span>
                      <span class="stat-value">#{update_date}</span>
                    </div>
                  </div>
                </div>

                <div class="performance-message">
                  <p>#{performance_message}</p>
                </div>

                <div class="action-section">
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <a href="#{investment_url}" class="cta-button" style="background-color: #3498db;">📊 View Investment Details</a>
                    <a href="#{portfolio_url}" class="cta-button" style="background-color: #2c3e50;">💼 View Portfolio</a>
                    <a href="#{support_url}" class="cta-button" style="background-color: #e67e22;">💬 Contact Advisor</a>
                  </div>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your investment performance?</strong> Our investment team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                <p>Warm Regards,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Content Builder
    def build_text_content(
      user_name:,
      campaign_name:,
      investment_amount:,
      current_value:,
      total_returns:,
      roi:,
      currency_symbol:,
      previous_value:,
      value_change:,
      change_percentage:,
      is_positive:,
      change_direction:,
      update_date:,
      portfolio_url:,
      investment_url:,
      support_url:,
      campaign:
    )
      formatted_investment = number_with_delimiter(investment_amount)
      formatted_current = number_with_delimiter(current_value)
      formatted_previous = number_with_delimiter(previous_value)
      formatted_change = number_with_delimiter(value_change.abs)
      formatted_returns = number_with_delimiter(total_returns)
      formatted_roi = roi.to_s

      text = <<~TEXT
        Dear #{user_name},

        Your investment in #{campaign_name} has #{change_direction} in value.

        Change Summary:
        #{is_positive ? '📈' : '📉'} #{is_positive ? '+' : ''}#{change_percentage}% (#{currency_symbol} #{formatted_change})

        Investment Details:
        - Original Investment: #{currency_symbol} #{formatted_investment}
        - Previous Value: #{currency_symbol} #{formatted_previous}
        - Current Value: #{currency_symbol} #{formatted_current}
        - Total Returns: #{currency_symbol} #{formatted_returns}
        - ROI: #{formatted_roi}%
        - Last Updated: #{update_date}

        #{is_positive ? '📈 Your investment continues to grow!' : '📊 Market fluctuations are normal. Consider reviewing your strategy.'}

        Action Items:
        View Investment Details: #{investment_url}
        View Portfolio: #{portfolio_url}
        Contact Advisor: #{support_url}

        Questions about your investment performance? Contact our investment team: #{support_email}

        Warm Regards,
        #{sender_name}

        You are receiving this email because you have an active investment with Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)
      return false if recipient_email.blank?

      begin
        send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
          to: [{
            email: recipient_email,
            name: recipient_name
          }],
          subject: subject,
          htmlContent: html_content,
          textContent: text_content,
          sender: {
            name: sender_name,
            email: sender_email
          },
          headers: {
            'X-Mailin-custom' => 'investment_value_change',
            'X-Entity-Ref-ID' => "investment_value_change_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_value_change'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent investment value change email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending investment value change to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send investment value change email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(investment, recipient_email, is_positive)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        current_value: investment.current_value,
        roi: investment.roi,
        is_positive: is_positive,
        campaign_id: investment.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Investment value change email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if investment.respond_to?(:update) && investment.respond_to?(:value_change_email_sent_at)
        investment.update(value_change_email_sent_at: Time.current)
      end
    end

    def number_with_delimiter(number)
      return '0' if number.nil? || number == 0
      
      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end

    # Common Styles
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
        .change-summary {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
          text-align: center;
        }
        .change-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        .investment-stats {
          margin: 20px 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .stat-card {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 12px;
          text-align: center;
        }
        .stat-card.highlight {
          background-color: #eaf2f8;
          border: 2px solid #3498db;
        }
        .stat-label {
          display: block;
          font-size: 12px;
          color: #777;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          display: block;
          font-size: 18px;
          font-weight: 600;
          margin-top: 4px;
        }
        .performance-message {
          background-color: #f0faf0;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 5px;
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
        @media only screen and (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr 1fr;
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
          .action-section {
            display: flex;
            flex-direction: column;
          }
          .change-indicator {
            flex-direction: column;
            gap: 5px;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you have an active investment with Bantuhive.</p>
          
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
        </div>
      HTML
    end
  end
end