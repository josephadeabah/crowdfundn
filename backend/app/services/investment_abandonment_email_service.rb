# app/services/investment_abandonment_email_service.rb
class InvestmentAbandonmentEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments Support')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def max_attempts
      ENV.fetch('INVESTMENT_ABANDONMENT_MAX_ATTEMPTS', 3).to_i
    end

    # Main Method
    def send_abandonment_email(investment:, recipient_email:, recipient_name:, attempt_count:, gateway_response: nil)
      # Validate investment
      return false unless investment
      return false unless investment.is_a?(EquityInvestment) || investment.respond_to?(:campaign)
      
      # Validate required associations
      return false unless investment.campaign
      return false unless recipient_email.present?

      # Check if we've already sent too many abandonment emails
      if attempt_count >= max_attempts
        Rails.logger.warn "Max abandonment attempts (#{max_attempts}) reached for investment #{investment.id}"
        return false
      end

      campaign = investment.campaign
      
      # Extract financial details
      amount = investment.amount&.round(2)
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign)
      resume_url = build_resume_url(investment)
      support_url = "#{frontend_url}/support"
      
      # Build subject with attempt-specific messaging
      subject = build_subject(campaign, attempt_count)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        resume_url: resume_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        investment: investment,
        attempt_count: attempt_count,
        gateway_response: gateway_response
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        resume_url: resume_url,
        support_url: support_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        investment: investment,
        attempt_count: attempt_count,
        gateway_response: gateway_response
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)

      if result
        log_email_sent(investment, recipient_email, attempt_count)
      end

      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign)
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_resume_url(investment)
      if investment.respond_to?(:token) && investment.token.present?
        "#{frontend_url}/investments/resume/#{investment.token}"
      else
        "#{frontend_url}/investments/#{investment.id}/resume"
      end
    end

    # Subject Builder
    def build_subject(campaign, attempt_count)
      base = "Complete Your Investment in #{campaign.company_name}"
      
      case attempt_count
      when 0
        "#{base} - Don't miss out!"
      when 1
        "#{base} - Your investment is still pending"
      else
        "#{base} - Final reminder!"
      end
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      resume_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      investment:,
      attempt_count:,
      gateway_response:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_valuation = number_with_delimiter(campaign.valuation.to_f.round(2))
      
      # Determine urgency messaging based on attempt count
      urgency_message = case attempt_count
      when 0
        "Your selected investment amount is temporarily reserved. Complete your investment to secure your shares."
      when 1
        "⏰ Your investment reservation is about to expire due to high demand. Complete it now!"
      else
        "⚠️ FINAL REMINDER: Your investment reservation is expiring soon. This is your last chance to complete it!"
      end

      # Determine reminder intensity
      reminder_intensity = case attempt_count
      when 0
        "We noticed you started an investment in <strong>#{campaign.company_name}</strong> but didn't complete the process."
      when 1
        "Your investment in <strong>#{campaign.company_name}</strong> is still pending. Don't miss this opportunity!"
      else
        "This is your final reminder to complete your investment in <strong>#{campaign.company_name}</strong> before it expires."
      end

      # Gateway error handling
      gateway_error = extract_gateway_error(gateway_response)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Complete Your Investment</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{attempt_count >= 2 ? '#e74c3c' : '#f39c12'};">
                <h1>#{attempt_count >= 2 ? '⚠️ Final Reminder' : 'Complete Your Investment'}</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p>#{reminder_intensity}</p>

                <div class="abandonment-notice" style="background-color: #{attempt_count >= 2 ? '#fdedec' : '#fff3cd'};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="font-weight: 600; color: #{attempt_count >= 2 ? '#c0392b' : '#856404'};">
                      Incomplete - Reminder ##{attempt_count + 1}
                    </span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Last Activity:</span>
                    <span class="detail-value">#{investment.created_at.strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>Gateway Status:</span>
                    <span class='detail-value' style='color: #c0392b;'>#{gateway_error}</span>
                  </div>" if gateway_error}
                </div>

                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">💰 Investment Amount:</span>
                    <span class="detail-value" style="font-size: 18px; font-weight: bold; color: #2c3e50;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🏢 Company:</span>
                    <span class="detail-value">#{campaign.company_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📋 Campaign:</span>
                    <span class="detail-value">#{campaign.title}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Valuation:</span>
                    <span class="detail-value">#{currency_symbol} #{formatted_valuation}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📈 Equity Offered:</span>
                    <span class="detail-value">#{campaign.equity_offered}%</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>🔑 Reference:</span>
                    <span class='detail-value'>#{investment.reference || 'N/A'}</span>
                  </div>" if investment.respond_to?(:reference)}
                </div>

                <div class="support-info">
                  <h3 style="margin-top: 0; color: #2c3e50;">📌 Your Investment is Reserved</h3>
                  <p>#{urgency_message}</p>
                  
                  <div class="steps">
                    <h4>To secure your investment:</h4>
                    <ol>
                      <li>Complete the payment process</li>
                      <li>Review your investment details</li>
                      <li>Receive your investment certificate</li>
                    </ol>
                  </div>
                  
                  <p><strong>⏰ Time-sensitive:</strong> This reservation will expire soon due to high demand.</p>
                </div>

                <div class="action-section">
                  <a href="#{resume_url}" class="cta-button" style="background-color: #27ae60;">💳 Complete Your Investment</a>
                </div>

                <div class="support-section">
                  <p><strong>Need help?</strong> Our investment team is ready to assist you.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit Support Center</a></p>
                </div>

                <p>Don't miss this opportunity to invest in #{campaign.company_name}!<br>
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
      campaign:,
      campaign_url:,
      resume_url:,
      support_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      investment:,
      attempt_count:,
      gateway_response:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_valuation = number_with_delimiter(campaign.valuation.to_f.round(2))
      
      reminder_intensity = case attempt_count
      when 0
        "We noticed you started an investment in #{campaign.company_name} but didn't complete the process."
      when 1
        "Your investment in #{campaign.company_name} is still pending. Don't miss this opportunity!"
      else
        "⚠️ FINAL REMINDER: Complete your investment in #{campaign.company_name} before it expires!"
      end

      gateway_error = extract_gateway_error(gateway_response)

      text = <<~TEXT
        Dear #{recipient_name},

        #{reminder_intensity}

        STATUS: Incomplete - Reminder ##{attempt_count + 1}
        Last Activity: #{investment.created_at.strftime('%B %d, %Y at %H:%M')}
        #{gateway_error ? "Gateway Status: #{gateway_error}" : ""}

        Investment Details:
        - Investment Amount: #{currency_symbol} #{formatted_amount}
        - Company: #{campaign.company_name}
        - Campaign: #{campaign.title}
        - Valuation: #{currency_symbol} #{formatted_valuation}
        - Equity Offered: #{campaign.equity_offered}%
        #{investment.respond_to?(:reference) ? "- Reference: #{investment.reference}" : ""}

        YOUR INVESTMENT IS RESERVED
        #{attempt_count >= 2 ? "⚠️ This is your final reminder before expiration!" : "Complete your investment to secure your shares."}

        To secure your investment:
        1. Complete the payment process
        2. Review your investment details
        3. Receive your investment certificate

        ⏰ Time-sensitive: This reservation will expire soon due to high demand.

        Complete Your Investment: #{resume_url}

        Need help? Our investment team is ready to assist you.
        Email: #{support_email}
        Support Center: #{support_url}

        Don't miss this opportunity to invest in #{campaign.company_name}!
        #{sender_name}

        You are receiving this email because you started an investment process through Bantuhive.

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
            'X-Mailin-custom' => 'investment_abandonment',
            'X-Entity-Ref-ID' => "investment_abandonment_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_abandonment'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent investment abandonment email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending investment abandonment to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send investment abandonment email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def extract_gateway_error(gateway_response)
      return nil unless gateway_response.present?
      
      if gateway_response.is_a?(Hash)
        gateway_response['error_message'] || gateway_response['message'] || gateway_response['error'] || nil
      elsif gateway_response.is_a?(String)
        gateway_response
      else
        nil
      end
    end

    def log_email_sent(investment, recipient_email, attempt_count)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        attempt_count: attempt_count,
        sent_at: Time.current.iso8601,
        campaign_id: investment.campaign_id
      }
      
      Rails.logger.info "Investment abandonment email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if investment.respond_to?(:update) && investment.respond_to?(:last_abandonment_email_sent_at)
        investment.update(
          last_abandonment_email_sent_at: Time.current,
          abandonment_email_count: (investment.abandonment_email_count || 0) + 1
        )
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
          background-color: #f39c12;
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
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .abandonment-notice {
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          background-color: #fff3cd;
          border: 1px solid #ffeaa7;
        }
        .investment-details {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
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
        .detail-label {
          font-weight: 600;
          width: 180px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .support-info {
          background-color: #e8f4fd;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .support-info h3 {
          margin-top: 0;
        }
        .steps {
          background-color: white;
          border-radius: 4px;
          padding: 15px;
          margin: 10px 0;
        }
        .steps ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .steps li {
          margin-bottom: 5px;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #27ae60;
          color: white;
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 16px;
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
            font-size: 20px;
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
          <p>You are receiving this email because you started an investment process through Bantuhive.</p>
          
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