# app/services/investment_failure_email_service.rb
class InvestmentFailureEmailService
  def self.send_failure_email(investment:, recipient_email:, recipient_name:, failure_reason:, metadata: {})
    return false unless investment.is_a?(EquityInvestment)

    campaign = investment.campaign
    investment_date = investment.created_at.strftime('%B %d, %Y')
    amount = investment.amount.round(2)
    currency_symbol = campaign.currency_symbol
    campaign_url = metadata[:redirect_url] || Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com')

    subject = "Payment Issue with Your Investment in #{campaign.company_name}"
    
    html_content = build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, failure_reason)
    text_content = build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, failure_reason)

    send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, failure_reason)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investment Payment Issue</title>
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
              background-color: #fef2f2;
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
            .failure-notice {
              background-color: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 6px;
              padding: 15px;
              margin: 20px 0;
              color: #856404;
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
            .support-info {
              background-color: #e8f4fd;
              border-radius: 6px;
              padding: 15px;
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
              <h1>Payment Issue</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We encountered an issue processing your investment in <strong>#{campaign.company_name}</strong>.</p>

              <div class="failure-notice">
                <strong>Payment Status:</strong> Failed<br>
                <strong>Reason:</strong> #{failure_reason.humanize}
              </div>

              <div class="investment-details">
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
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
                  <span class="detail-label">Attempt Date:</span>
                  <span class="detail-value">#{investment_date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reference:</span>
                  <span class="detail-value">#{investment.transaction_reference || 'N/A'}</span>
                </div>
              </div>

              <div class="support-info">
                <h3 style="margin-top: 0; color: #2c3e50;">Next Steps</h3>
                <p>Your investment has not been processed. To complete your investment:</p>
                <ol>
                  <li>Check your payment method details</li>
                  <li>Ensure sufficient funds are available</li>
                  <li>Contact your bank if needed</li>
                  <li>Retry your investment when ready</li>
                </ol>
                
                <p><strong>Need help?</strong> Our support team is here to assist you.</p>
              </div>

              <p style="text-align: center;">
                <a href="#{campaign_url}" class="cta-button">Retry Your Investment</a>
              </p>
              
              <p>If you believe this is an error or need assistance with your payment method, 
              please contact our support team immediately.</p>
              
              <p>Warm regards,<br>
              <strong>The Bantuhive Investments Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you attempted to make an investment through Bantuhive.</p>
              
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

  def self.build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, failure_reason)
    <<~TEXT
      Hello #{recipient_name},

      We encountered an issue processing your investment in #{campaign.company_name}.

      PAYMENT STATUS: FAILED
      Reason: #{failure_reason.humanize}

      Investment Details:
      - Amount: #{currency_symbol}#{amount}
      - Company: #{campaign.company_name}
      - Campaign: #{campaign.title}
      - Attempt Date: #{investment_date}
      - Reference: #{investment.transaction_reference || 'N/A'}

      Your investment has not been processed. To complete your investment:

      1. Check your payment method details
      2. Ensure sufficient funds are available
      3. Contact your bank if needed
      4. Retry your investment when ready

      Retry your investment: #{campaign_url}

      Need help? Our support team is here to assist you at help@bantuhive.com.

      If you believe this is an error or need assistance with your payment method, 
      please contact our support team immediately.

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
          'X-Mailin-custom' => 'investment_failure'
        }
      )

      # Send email
      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent failure notification email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send failure notification email: #{e.message}"
      false
    end
  end
end