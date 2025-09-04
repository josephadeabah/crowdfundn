# app/services/investment_oversubscription_email_service.rb
class InvestmentOversubscriptionEmailService
  include ActionView::Helpers::NumberHelper # for formatting currency/numbers

  def self.send_oversubscription_email(investment:, recipient_email:, recipient_name:, metadata: {})
    return false unless investment.is_a?(EquityInvestment)

    campaign = investment.campaign
    investment_date = investment.created_at.strftime('%B %d, %Y')

    # Safer formatting
    shares = number_with_precision(investment.shares.to_f, precision: 4, delimiter: ',')
    percentage = number_with_precision(investment.percentage.to_f, precision: 2)
    amount = number_to_currency(investment.amount.to_f, unit: campaign.currency_symbol)

    refund_reference = investment.metadata&.dig('refund_reference') || 'N/A'
    campaign_url = metadata[:redirect_url] ||
                   Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com')

    subject = "Investment Oversubscription Notice - #{campaign.company_name}"

    html_content = build_html_content(
      campaign, campaign_url, recipient_name, amount, shares, percentage, investment_date, refund_reference
    )
    text_content = build_text_content(
      campaign, campaign_url, recipient_name, amount, shares, percentage, investment_date, refund_reference
    )

    send_email(recipient_email, recipient_name, subject, html_content, text_content)
  end

  private_class_method def self.build_html_content(campaign, campaign_url, recipient_name, amount, shares, percentage, investment_date, refund_reference)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Investment Oversubscription Notice</title>
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
              background-color: #fef5f5;
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
            .refund-info {
              background-color: #e8f5e8;
              border-radius: 6px;
              padding: 20px;
              margin: 20px 0;
              border-left: 4px solid #27ae60;
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
            .cta-button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #3498db;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Investment Update</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              
              <p>We regret to inform you that your investment in <strong>#{campaign.company_name}</strong> 
              could not be completed due to oversubscription.</p>

              <div class="investment-details">
                <h3 style="margin-top: 0; color: #e74c3c;">Investment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Investment Amount:</span>
                  <span class="detail-value">#{amount}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Shares Requested:</span>
                  <span class="detail-value">#{shares} shares</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Ownership Percentage:</span>
                  <span class="detail-value">#{percentage}%</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Investment Date:</span>
                  <span class="detail-value">#{investment_date}</span>
                </div>
              </div>

              <div class="refund-info">
                <h3 style="margin-top: 0; color: #27ae60;">Refund Information</h3>
                <p>A full refund of <strong>#{amount}</strong> will be processed 
                to your original payment method within <strong>5-7 business days</strong>.</p>
                
                <p>Your refund reference number is: <strong>#{refund_reference}</strong></p>
              </div>

              <p>The campaign reached its maximum equity offering before your investment could be processed. 
              We apologize for any inconvenience this may cause.</p>

              <p>You can explore other investment opportunities on our platform:</p>
              <p><a href="https://bantuhive.com/invest" class="cta-button">Browse Investments</a></p>

              <p>If you have any questions about this process or would like assistance finding alternative 
              investment opportunities, please contact our support team.</p>
              
              <p>We appreciate your understanding and hope to serve you better in the future.</p>
              
              <p>Sincerely,<br>
              <strong>The Bantuhive Investments Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you attempted an investment through Bantuhive.</p>
              
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

  private_class_method def self.build_text_content(campaign, campaign_url, recipient_name, amount, shares, percentage, investment_date, refund_reference)
    <<~TEXT
      Investment Oversubscription Notice - #{campaign.company_name}

      Hello #{recipient_name},

      We regret to inform you that your investment in #{campaign.company_name} 
      could not be completed due to oversubscription.

      Investment Details:
      - Amount: #{amount}
      - Shares: #{shares}
      - Ownership: #{percentage}%
      - Date: #{investment_date}

      REFUND INFORMATION:
      A full refund of #{amount} will be processed to your 
      original payment method within 5-7 business days.

      Refund Reference: #{refund_reference}

      The campaign reached its maximum equity offering before your investment 
      could be processed. We apologize for any inconvenience this may cause.

      You can explore other investment opportunities on our platform:
      https://bantuhive.com/invest

      If you have any questions about this process or would like assistance 
      finding alternative investment opportunities, please contact our 
      support team at help@bantuhive.com.

      We appreciate your understanding and hope to serve you better in the future.

      Sincerely,
      The Bantuhive Investments Team

      IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  private_class_method def self.send_email(recipient_email, recipient_name, subject, html_content, text_content)
    begin
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [{ email: recipient_email, name: recipient_name }],
        subject: subject,
        htmlContent: html_content,
        textContent: text_content,
        sender: {
          name: 'Bantuhive Investments',
          email: 'help@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => 'investment_oversubscription'
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)

      Rails.logger.info "Successfully sent oversubscription email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send oversubscription email: #{e.message}"
      false
    end
  end
end
