# app/services/investment_abandonment_email_service.rb
class InvestmentAbandonmentEmailService
  def self.send_abandonment_email(investment:, recipient_email:, recipient_name:, attempt_count:, gateway_response: nil)
    return false unless investment.is_a?(EquityInvestment)

    campaign = investment.campaign
    investment_date = investment.created_at.strftime('%B %d, %Y')
    amount = investment.amount.round(2)
    currency_symbol = campaign.currency_symbol
    campaign_url = Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com')

    subject = "Complete Your Investment in #{campaign.company_name}"
    
    html_content = build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, attempt_count, gateway_response)
    text_content = build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, attempt_count, gateway_response)

    send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, attempt_count, gateway_response)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Complete Your Investment</title>
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
            }
            .detail-label {
              font-weight: 600;
              width: 180px;
              color: #555;
            }
            .detail-value {
              flex: 1;
            }
            .abandonment-notice {
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
              <h1>Complete Your Investment</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We noticed you started an investment in <strong>#{campaign.company_name}</strong> but didn't complete the process.</p>

              <div class="abandonment-notice">
                <strong>Status:</strong> Incomplete<br>
                <strong>Last Activity:</strong> #{investment_date}
                #{gateway_response ? "<br><strong>Reason:</strong> #{gateway_response.humanize}" : ""}
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
                  <span class="detail-label">Valuation:</span>
                  <span class="detail-value">#{currency_symbol}#{campaign.valuation.to_f.round(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Equity Offered:</span>
                  <span class="detail-value">#{campaign.equity_offered}%</span>
                </div>
              </div>

              <div class="support-info">
                <h3 style="margin-top: 0; color: #2c3e50;">Your Investment is Reserved</h3>
                <p>Your selected investment amount is temporarily reserved. To secure your shares:</p>
                <ol>
                  <li>Complete the payment process</li>
                  <li>Review your investment details</li>
                  <li>Receive your investment certificate</li>
                </ol>
                
                <p><strong>Time-sensitive:</strong> This reservation will expire soon due to high demand.</p>
              </div>

              <p style="text-align: center;">
                <a href="#{campaign_url}" class="cta-button">Complete Your Investment</a>
              </p>
              
              <p>If you encountered any issues or need assistance, our support team is ready to help you complete your investment.</p>
              
              <p>Don't miss this opportunity to invest in #{campaign.company_name}!</p>
              
              <p>Warm regards,<br>
              <strong>The Bantuhive Investments Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you started an investment process through Bantuhive.</p>
              
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              
              <div class="company-address">
                IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
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

  def self.build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, investment_date, investment, attempt_count, gateway_response)
    <<~TEXT
      Hello #{recipient_name},

      We noticed you started an investment in #{campaign.company_name} but didn't complete the process.

      STATUS: INCOMPLETE
      Last Activity: #{investment_date}
      #{gateway_response ? "Reason: #{gateway_response.humanize}" : ""}

      Investment Details:
      - Amount: #{currency_symbol}#{amount}
      - Company: #{campaign.company_name}
      - Campaign: #{campaign.title}
      - Valuation: #{currency_symbol}#{campaign.valuation.to_f.round(2)}
      - Equity Offered: #{campaign.equity_offered}%

      YOUR INVESTMENT IS RESERVED

      Your selected investment amount is temporarily reserved. To secure your shares:

      1. Complete the payment process
      2. Review your investment details
      3. Receive your investment certificate

      Time-sensitive: This reservation will expire soon due to high demand.

      Complete your investment: #{campaign_url}

      If you encountered any issues or need assistance, contact our support team at help@bantuhive.com.

      Don't miss this opportunity to invest in #{campaign.company_name}!

      Warm regards,
      The Bantuhive Investments Team

      IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
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
          'X-Mailin-custom' => 'investment_abandonment'
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent abandonment notification email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send abandonment notification email: #{e.message}"
      false
    end
  end
end