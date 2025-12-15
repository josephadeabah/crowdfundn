# app/services/investment_reversal_email_service.rb
class InvestmentReversalEmailService
  def self.send_reversal_email(investment:, recipient_email:, recipient_name:, reversal_reason:, metadata: {})
    return false unless investment.is_a?(EquityInvestment)

    campaign = investment.campaign
    investment_date = investment.created_at.strftime('%B %d, %Y')
    reversal_date = Time.current.strftime('%B %d, %Y')
    amount = investment.amount.round(2)
    currency_symbol = campaign.currency_symbol
    campaign_url = metadata[:redirect_url] || Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com')

    subject = "Investment Update: Transaction Reversed - #{campaign.company_name}"
    
    html_content = build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, reversal_date, investment, reversal_reason)
    text_content = build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, reversal_date, investment, reversal_reason)

    send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, reversal_date, investment, reversal_reason)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investment Reversal</title>
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
              background-color: #e74c3c;
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
            .investment-details {
              background-color: #feefef;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #e74c3c;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: 600;
              width: 180px;
              color: #555;
            }
            .detail-value {
              flex: 1;
            }
            .reversal-notice {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
            }
            .refund-info {
              background-color: #e8f4fd;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              border-left: 4px solid #3498db;
            }
            .cta-button {
              display: inline-block;
              background-color: #3498db;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 15px 0;
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
            .company-address {
              font-size: 13px;
              color: #777;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Investment Reversal Notice</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We're writing to inform you about a reversal of your investment in <strong>#{campaign.company_name}</strong>.</p>

              <div class="reversal-notice">
                <strong>Status:</strong> Transaction Reversed<br>
                <strong>Reversal Date:</strong> #{reversal_date}<br>
                <strong>Reason:</strong> #{reversal_reason.humanize}
              </div>

              <div class="investment-details">
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
                  <span class="detail-value">#{currency_symbol}#{amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Refund Amount:</span>
                  <span class="detail-value">#{currency_symbol}#{amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Company:</span>
                  <span class="detail-value">#{campaign.company_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Campaign:</span>
                  <span class="detail-value">#{campaign.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Original Investment Date:</span>
                  <span class="detail-value">#{investment_date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Certificate Number:</span>
                  <span class="detail-value">#{investment.certificate_number}</span>
                </div>
              </div>

              <div class="refund-info">
                <h3 style="margin-top: 0; color: #2c3e50;">Refund Processing</h3>
                <p>Your investment amount of <strong>#{currency_symbol}#{amount}</strong> has been refunded.</p>
                
                <p><strong>Refund Timeline:</strong></p>
                <ul>
                  <li>Refund initiated: Immediately</li>
                  <li>Bank processing: 3-5 business days</li>
                  <li>Reflect in your account: 5-10 business days</li>
                </ul>
                
                <p>If you don't see the refund in your account after 10 business days, please contact your bank first, then our support team.</p>
              </div>

              <p style="text-align: center;">
                <a href="#{campaign_url}" class="cta-button">View Campaign Details</a>
              </p>
              
              <p>If you believe this reversal was made in error or have any questions, please contact our support team immediately.</p>
              
              <p>We apologize for any inconvenience this may have caused.</p>
              
              <p>Warm regards,<br>
              <strong>The Bantuhive Investments Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because your investment was reversed through Bantuhive.</p>
              
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              
              <div class="company-address">
                27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
              </div>
              
              <p style="margin-top: 15px;">
                <a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, reversal_date, investment, reversal_reason)
    <<~TEXT
      Hello #{recipient_name},

      We're writing to inform you about a reversal of your investment in #{campaign.company_name}.

      STATUS: TRANSACTION REVERSED
      Reversal Date: #{reversal_date}
      Reason: #{reversal_reason.humanize}

      Investment Details:
      - Investment Amount: #{currency_symbol}#{amount}
      - Refund Amount: #{currency_symbol}#{amount}
      - Company: #{campaign.company_name}
      - Campaign: #{campaign.title}
      - Original Investment Date: #{investment_date}
      - Certificate Number: #{investment.certificate_number}

      REFUND PROCESSING

      Your investment amount of #{currency_symbol}#{amount} has been refunded.

      Refund Timeline:
      - Refund initiated: Immediately
      - Bank processing: 3-5 business days
      - Reflect in your account: 5-10 business days

      If you don't see the refund in your account after 10 business days, please contact your bank first, then our support team.

      View campaign details: #{campaign_url}

      If you believe this reversal was made in error or have any questions, please contact our support team at help@bantuhive.com.

      We apologize for any inconvenience this may have caused.

      Warm regards,
      The Bantuhive Investments Team

      27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
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
          name: 'Bantuhive Investments Support',
          email: 'help@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => 'investment_reversal'
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent reversal notification email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send reversal notification email: #{e.message}"
      false
    end
  end
end