# app/services/donation_reversal_email_service.rb
class DonationReversalEmailService
  def self.send_reversal_email(donation:, recipient_email:, recipient_name:, reversal_reason:, metadata: {})
    return false unless donation

    campaign = donation.campaign
    amount = donation.amount.round(2) if donation.amount
    currency_symbol = campaign&.currency_symbol || '₵'
    campaign_url = metadata[:redirect_url] || (campaign ? Rails.application.routes.url_helpers.campaign_url(campaign, host: 'bantuhive.com') : 'https://bantuhive.com')

    subject = "Your donation has been reversed"
    
    html_content = build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, reversal_reason, donation)
    text_content = build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, reversal_reason, donation)

    send_email(recipient_email, recipient_name, subject, html_content, text_content)
  end

  private

  def self.build_html_content(campaign, campaign_url, recipient_name, currency_symbol, amount, reversal_reason, donation)
    <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>Donation Reversed</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
            .header { background-color: #95a5a6; padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #95a5a6; }
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
              <h1>Donation Reversed</h1>
            </div>

            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We're writing to inform you that your donation has been reversed.</p>

              <div class="details">
                #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                #{"<div class='detail-row'><span class='detail-label'>Amount:</span><span class='detail-value'>#{currency_symbol}#{amount}</span></div>" if amount}
                <div class="detail-row">
                  <span class="detail-label">Reason:</span>
                  <span class="detail-value">#{reversal_reason}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reference:</span>
                  <span class="detail-value">#{donation.transaction_reference}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value">Refunded</span>
                </div>
              </div>

              <p>The refund should reflect in your account within 3-5 business days, depending on your bank's processing time.</p>
              
              <p>If you'd like to make another donation, you can do so at any time.</p>
              
              #{"<p><a href='#{campaign_url}' class='cta-button'>Make Another Donation</a></p>" if campaign}
              
              <p>If you have any questions about this reversal, please contact our support team.</p>
              
              <p>Best regards,<br>
              <strong>The Bantuhive Team</strong></p>
            </div>

            <div class="footer">
              <p>You are receiving this email because you made a donation through Bantuhive.</p>
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              <div class="company-address">IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana</div>
              <p style="margin-top: 15px;"><a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd. All rights reserved.</a></p>
            </div>
          </div>
        </body>
      </html>
    HTML
  end

  def self.build_text_content(campaign, campaign_url, recipient_name, currency_symbol, amount, reversal_reason, donation)
    <<~TEXT
      Hello #{recipient_name},

      We're writing to inform you that your donation has been reversed.

      #{campaign ? "Campaign: #{campaign.title}" : ""}
      #{amount ? "Amount: #{currency_symbol}#{amount}" : ""}
      Reason: #{reversal_reason}
      Reference: #{donation.transaction_reference}
      Status: Refunded

      The refund should reflect in your account within 3-5 business days, depending on your bank's processing time.

      If you'd like to make another donation, you can do so at any time.

      #{campaign ? "Make another donation: #{campaign_url}" : ""}

      If you have any questions about this reversal, please contact our support team at help@bantuhive.com.

      Best regards,
      The Bantuhive Team

      IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana
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
          'X-Mailin-custom' => 'donation_reversal'
        }
      )

      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      
      Rails.logger.info "Successfully sent donation reversal email to #{recipient_email}"
      response
    rescue => e
      Rails.logger.error "Failed to send donation reversal email: #{e.message}"
      false
    end
  end
end