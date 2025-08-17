# app/services/investment_confirmation_email_service.rb
class InvestmentConfirmationEmailService
  def self.send_confirmation_email(investment:, certificate_url:, recipient_email:, recipient_name:, metadata: {})
    return false unless investment.is_a?(EquityInvestment) && investment.successful?

    campaign = investment.campaign
    investment_date = investment.created_at.strftime('%B %d, %Y')
    shares = investment.shares.round(4)
    percentage = investment.percentage.round(4)
    amount = investment.amount.round(2)
    currency_symbol = campaign.currency_symbol
    campaign_url = metadata[:redirect_url] || Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com')

    subject = "Your investment in #{campaign.company_name} is confirmed!"
    
    html_content = build_html_content(campaign, certificate_url, campaign_url, recipient_name, currency_symbol, amount, shares, percentage, investment_date, investment)
    text_content = build_text_content(campaign, certificate_url, campaign_url, recipient_name, currency_symbol, amount, shares, percentage, investment_date, investment)

    send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, certificate_url, campaign_url, recipient_name, currency_symbol, amount, shares, percentage, investment_date, investment)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investment Confirmation</title>
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
            .greeting {
              font-size: 18px;
              margin-bottom: 20px;
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
            }
            .detail-label {
              font-weight: 600;
              width: 180px;
              color: #555;
            }
            .detail-value {
              flex: 1;
            }
            .certificate-cta {
              text-align: center;
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
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
              <h1>Investment Confirmation</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>Thank you for your investment in <strong>#{campaign.company_name}</strong>. 
              Your transaction has been successfully processed and your ownership certificate is ready.</p>

              <div class="investment-details">
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
                  <span class="detail-value">#{currency_symbol}#{amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Shares Acquired:</span>
                  <span class="detail-value">#{shares} shares</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Ownership Percentage:</span>
                  <span class="detail-value">#{percentage}%</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Company Valuation:</span>
                  <span class="detail-value">#{currency_symbol}#{campaign.valuation.to_f.round(2)}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Investment Date:</span>
                  <span class="detail-value">#{investment_date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Certificate Number:</span>
                  <span class="detail-value">#{investment.certificate_number}</span>
                </div>
              </div>

              <div class="certificate-cta">
                <p>Your official investment certificate is attached to this email and available for download:</p>
                <a href="#{certificate_url}" class="button">Download Certificate</a>
                <p style="margin-top: 15px; font-size: 14px;">
                  You can also access this certificate anytime from your 
                  <a href="#{campaign_url}">investment portfolio</a>.
                </p>
              </div>

              <p>As a shareholder, you'll receive regular updates about the company's progress and any changes to your investment value.</p>
              
              <p>If you have any questions about your investment, please don't hesitate to contact our support team.</p>
              
              <p>Warm regards,<br>
              <strong>The Bantuhive Investments Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you made an investment through Bantuhive.</p>
              
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

 def self.build_text_content(campaign, certificate_url, campaign_url, recipient_name, currency_symbol, amount, shares, percentage, investment_date, investment)
    <<~TEXT
      Hello #{recipient_name},

      Thank you for your investment in #{campaign.company_name}. 
      Your transaction has been successfully processed and your ownership certificate is ready.

      Investment Details:
      - Amount: #{currency_symbol}#{investment.amount.round(2)}
      - Shares: #{investment.shares.round(4)}
      - Ownership: #{investment.percentage.round(4)}%
      - Company Valuation: #{currency_symbol}#{campaign.valuation.to_f.round(2)}
      - Date: #{investment.created_at.strftime('%B %d, %Y')}
      - Certificate Number: #{investment.certificate_number}

      Download your certificate: #{certificate_url}

      View your portfolio: #{campaign_url}

      As a shareholder, you'll receive regular updates about the company's progress 
      and any changes to your investment value.

      If you have any questions about your investment, please don't hesitate 
      to contact our support team at help@bantuhive.com.

      Warm regards,
      The Bantuhive Investments Team

      IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.send_email(investment, recipient_email, recipient_name, subject, html_content, text_content)
    return unless investment.certificate.attached?

    begin
      # Download certificate to temp file
      temp_file = Tempfile.new(["certificate_#{investment.id}", ".pdf"], binmode: true)
      temp_file.write(investment.certificate.download)
      temp_file.rewind

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{
          email: recipient_email,
          name: recipient_name
        }],
        subject: subject,
        htmlContent: html_content,
        textContent: text_content,
        sender: {
          name: 'Bantuhive Investments',
          email: 'help@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => 'investment_confirmation'
        },
        attachment: [{
          content: Base64.encode64(temp_file.read),
          name: "investment_certificate_#{investment.certificate_number}.pdf"
        }]
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Investment confirmation email sent to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send investment confirmation email: #{e.message}"
      false
    ensure
      temp_file.close if temp_file && !temp_file.closed?
      temp_file.unlink if temp_file
    end
  end
end