# app/services/investment_confirmation_email_service.rb
class InvestmentConfirmationEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Investments')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_confirmation_email(investment:, recipient_email:, recipient_name:, metadata: {})
      # Validate investment
      return false unless validate_investment(investment)
      return false unless recipient_email.present?

      campaign = investment.campaign
      amount = investment.amount&.round(2)
      currency_symbol = campaign.currency_symbol || 'GHS'
      
      # Extract investment details
      shares = investment.shares&.round(4) || 0
      percentage = investment.percentage&.round(4) || 0
      investment_date = investment.created_at.strftime('%B %d, %Y')
      certificate_number = investment.certificate_number || generate_certificate_number(investment)
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      investment_url = build_investment_url(investment, metadata)
      portfolio_url = build_portfolio_url(investment, metadata)
      certificate_url = build_certificate_url(investment, metadata)

      subject = build_subject(campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        investment_url: investment_url,
        portfolio_url: portfolio_url,
        certificate_url: certificate_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        shares: shares,
        percentage: percentage,
        investment_date: investment_date,
        certificate_number: certificate_number,
        investment: investment,
        metadata: metadata
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        investment_url: investment_url,
        portfolio_url: portfolio_url,
        certificate_url: certificate_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        shares: shares,
        percentage: percentage,
        investment_date: investment_date,
        certificate_number: certificate_number,
        investment: investment,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, investment)

      if result
        log_email_sent(investment, recipient_email)
      end

      result
    end

    private

    # Validation Methods
    def validate_investment(investment)
      return false unless investment
      return false unless investment.is_a?(EquityInvestment)
      return false unless investment.successful?
      return false unless investment.campaign
      return false unless investment.campaign.present?
      true
    end

    # URL Builders
    def build_campaign_url(campaign, metadata)
      return metadata[:redirect_url] if metadata[:redirect_url].present?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_investment_url(investment, metadata)
      return metadata[:investment_url] if metadata[:investment_url].present?
      "#{frontend_url}/investments/#{investment.id}"
    end

    def build_portfolio_url(investment, metadata)
      return metadata[:portfolio_url] if metadata[:portfolio_url].present?
      "#{frontend_url}/investors/portfolio"
    end

    def build_certificate_url(investment, metadata)
      return metadata[:certificate_url] if metadata[:certificate_url].present?
      
      if investment.respond_to?(:certificate_url) && investment.certificate_url.present?
        investment.certificate_url
      else
        "#{frontend_url}/investments/#{investment.id}/certificate"
      end
    end

    # Subject Builder
    def build_subject(campaign)
      "🎉 Your investment in #{campaign.company_name} is confirmed!"
    end

    # Certificate Number Generator
    def generate_certificate_number(investment)
      "INV-#{investment.id}-#{Time.current.strftime('%Y%m')}-#{SecureRandom.hex(4).upcase}"
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      investment_url:,
      portfolio_url:,
      certificate_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      shares:,
      percentage:,
      investment_date:,
      certificate_number:,
      investment:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_shares = number_with_delimiter(shares)
      formatted_percentage = percentage.to_s
      formatted_valuation = number_with_delimiter(campaign.valuation.to_f.round(2))
      
      # Determine if this is a first-time investor
      is_first_investment = metadata[:is_first_investment] || investment.user&.investments&.count == 1
      
      welcome_message = if is_first_investment
        "Welcome to the Bantuhive investment community! 🚀"
      else
        "Thank you for your continued trust in Bantuhive investments!"
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Investment Confirmed</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🎉 Investment Confirmed!</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>
                
                <p><strong>#{welcome_message}</strong></p>
                
                <p>Your investment in <strong>#{campaign.company_name}</strong> has been successfully processed and confirmed!</p>

                <div class="investment-details">
                  <div class="detail-row highlight">
                    <span class="detail-label">💰 Investment Amount:</span>
                    <span class="detail-value" style="font-size: 20px; font-weight: bold; color: #27ae60;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Shares Acquired:</span>
                    <span class="detail-value">#{formatted_shares} shares</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📈 Ownership Percentage:</span>
                    <span class="detail-value">#{formatted_percentage}%</span>
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
                    <span class="detail-label">💎 Company Valuation:</span>
                    <span class="detail-value">#{currency_symbol} #{formatted_valuation}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Investment Date:</span>
                    <span class="detail-value">#{investment_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">🔑 Certificate Number:</span>
                    <span class="detail-value" style="font-family: monospace;">#{certificate_number}</span>
                  </div>
                  #{"<div class='detail-row'>
                    <span class='detail-label'>📧 Reference:</span>
                    <span class='detail-value'>#{investment.reference || 'N/A'}</span>
                  </div>" if investment.respond_to?(:reference)}
                </div>

                <div class="whats-next">
                  <h3>📌 What's Next?</h3>
                  <div class="steps-grid">
                    <div class="step-item">
                      <div class="step-number">1</div>
                      <div class="step-content">
                        <h4>Download Your Certificate</h4>
                        <p>Your investment certificate is ready for download.</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">2</div>
                      <div class="step-content">
                        <h4>Track Your Investment</h4>
                        <p>You'll receive quarterly updates on company performance.</p>
                      </div>
                    </div>
                    <div class="step-item">
                      <div class="step-number">3</div>
                      <div class="step-content">
                        <h4>Join the Community</h4>
                        <p>Connect with other investors in the company's updates.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="action-section">
                  <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                    <a href="#{certificate_url}" class="cta-button" style="background-color: #27ae60;">📄 Download Certificate</a>
                    <a href="#{investment_url}" class="cta-button" style="background-color: #3498db;">📊 View Investment</a>
                    <a href="#{portfolio_url}" class="cta-button" style="background-color: #2c3e50;">💼 My Portfolio</a>
                  </div>
                </div>

                <div class="investment-benefits">
                  <h4>As a shareholder, you'll enjoy:</h4>
                  <ul>
                    <li>✅ Regular updates on company progress</li>
                    <li>✅ Access to investor reports and financials</li>
                    <li>✅ Voting rights on key company decisions</li>
                    <li>✅ Priority access to follow-on investments</li>
                  </ul>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your investment?</strong> Our investment team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for choosing Bantuhive to build your investment portfolio!<br>
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
      investment_url:,
      portfolio_url:,
      certificate_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      shares:,
      percentage:,
      investment_date:,
      certificate_number:,
      investment:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      formatted_shares = number_with_delimiter(shares)
      formatted_percentage = percentage.to_s
      formatted_valuation = number_with_delimiter(campaign.valuation.to_f.round(2))
      
      is_first_investment = metadata[:is_first_investment] || investment.user&.investments&.count == 1
      
      welcome_message = if is_first_investment
        "Welcome to the Bantuhive investment community! 🚀"
      else
        "Thank you for your continued trust in Bantuhive investments!"
      end

      text = <<~TEXT
        Dear #{recipient_name},

        #{welcome_message}

        Your investment in #{campaign.company_name} has been successfully processed and confirmed!

        Investment Details:
        - Investment Amount: #{currency_symbol} #{formatted_amount}
        - Shares Acquired: #{formatted_shares} shares
        - Ownership Percentage: #{formatted_percentage}%
        - Company: #{campaign.company_name}
        - Campaign: #{campaign.title}
        - Company Valuation: #{currency_symbol} #{formatted_valuation}
        - Investment Date: #{investment_date}
        - Certificate Number: #{certificate_number}
        #{investment.respond_to?(:reference) ? "- Reference: #{investment.reference}" : ""}

        What's Next?
        1. Download Your Certificate: #{certificate_url}
        2. Track Your Investment: #{investment_url}
        3. View Your Portfolio: #{portfolio_url}

        As a shareholder, you'll enjoy:
        ✅ Regular updates on company progress
        ✅ Access to investor reports and financials
        ✅ Voting rights on key company decisions
        ✅ Priority access to follow-on investments

        Questions about your investment? Contact our investment team: #{support_email}

        Thank you for choosing Bantuhive to build your investment portfolio!
        #{sender_name}

        You are receiving this email because you made an investment through Bantuhive.

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
            'X-Mailin-custom' => 'investment_confirmation',
            'X-Entity-Ref-ID' => "investment_confirmation_#{investment.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'investment_confirmation',
            'X-Priority' => '1 (Highest)'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent investment confirmation email to #{recipient_email} - Investment ID: #{investment.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending investment confirmation to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send investment confirmation email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(investment, recipient_email)
      log_data = {
        investment_id: investment.id,
        recipient_email: recipient_email,
        amount: investment.amount,
        campaign_id: investment.campaign_id,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Investment confirmation email sent: #{log_data.to_json}"
      
      # Update investment record if tracking fields exist
      if investment.respond_to?(:update) && investment.respond_to?(:confirmation_email_sent_at)
        investment.update(confirmation_email_sent_at: Time.current)
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
          background-color: #27ae60;
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
        .investment-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
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
          background-color: #f0faf0;
          border-radius: 4px;
          padding: 8px 0;
        }
        .detail-label {
          font-weight: 600;
          width: 180px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .whats-next {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .whats-next h3 {
          margin-top: 0;
          color: #2c3e50;
        }
        .steps-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin: 15px 0;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          flex: 1 1 calc(33% - 10px);
          min-width: 150px;
          background: white;
          border-radius: 6px;
          padding: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .step-number {
          font-size: 24px;
          font-weight: bold;
          color: #3498db;
          margin-right: 10px;
          min-width: 30px;
        }
        .step-content h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #2c3e50;
        }
        .step-content p {
          margin: 0;
          font-size: 13px;
          color: #666;
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
        .investment-benefits {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .investment-benefits h4 {
          margin-top: 0;
          color: #7f6000;
        }
        .investment-benefits ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .investment-benefits li {
          margin-bottom: 5px;
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
            font-size: 22px;
          }
          .step-item {
            flex: 1 1 100%;
          }
          .cta-button {
            display: block;
            margin: 10px 0;
          }
          .action-section {
            display: flex;
            flex-direction: column;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you made an investment through Bantuhive.</p>
          
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