# app/services/donation_failure_email_service.rb
class DonationFailureEmailService
  def self.send_failure_email(donation:, recipient_email:, recipient_name:, failure_reason:, metadata: {})
    return unless recipient_email.present?
    return unless donation
    campaign = donation.campaign
    amount = donation.amount.round(2) if donation.amount
    currency_symbol = campaign&.currency_symbol || '₵'
    campaign_url = metadata[:redirect_url] || (campaign ? Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com') : 'https://bantuhive.com')

    subject = "Your donation attempt was unsuccessful"
    
    html_content = build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, failure_reason, donation)
    text_content = build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, failure_reason, donation)

    send_email(recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, failure_reason, donation)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Donation Unsuccessful</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
            .header { background-color: #e74c3c; padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #e74c3c; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: 600; width: 180px; color: #555; }
            .detail-value { flex: 1; }
            .footer { background-color: #f0f2f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e1e4e8; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #2c3e50; text-decoration: none; margin: 0 10px; font-weight: 500; }
            .company-address { font-size: 13px; color: #777; margin-top: 15px; }
            .cta-button { display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>Donation Unsuccessful</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We encountered an issue processing your donation attempt.</p>

              <div class="details">
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">Payment Failed</span>
                </div>
                #{"<div class='detail-row'><span class='detail-label'>Amount:</span><span class='detail-value'>#{currency_symbol}#{amount}</span></div>" if amount}
                #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                <div class="detail-row">
                  <span class="detail-label">Reason:</span>
                  <span class="detail-value">#{failure_reason}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reference:</span>
                  <span class="detail-value">#{donation.transaction_reference}</span>
                </div>
              </div>

              <p>You can try again or contact our support team for assistance.</p>
              
              #{"<p><a href='#{campaign_url}' class='cta-button'>Try Again</a></p>" if campaign}
              
              <p>If this was unexpected or you need help, please contact us at help@bantuhive.com.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you attempted to make a donation through Bantuhive.</p>
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              <div class="company-address">27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.</div>
              <p style="margin-top: 15px;"><a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a></p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, failure_reason, donation)
    <<~TEXT
      Hello #{recipient_name},

      We encountered an issue processing your donation attempt.

      Status: Payment Failed
      #{amount ? "Amount: #{currency_symbol}#{amount}" : ""}
      #{campaign ? "Campaign: #{campaign.title}" : ""}
      Reason: #{failure_reason}
      Reference: #{donation.transaction_reference}

      You can try again or contact our support team for assistance.

      #{campaign ? "Try again: #{campaign_url}" : ""}

      If this was unexpected or you need help, please contact us at help@bantuhive.com.

      Best regards,
      The Bantuhive Team

      27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
      © #{Time.current.year} Bantuhive Ltd. All rights reserved.
    TEXT
  end

  def self.send_email(recipient_email, recipient_name, subject, html_content, text_content)
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
          name: 'Bantuhive Support',
          email: 'help@bantuhive.com'
        },
        headers: {
          'X-Mailin-custom' => 'donation_failure'
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent donation failure email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send donation failure email: #{e.message}"
      false
    end
  end
end