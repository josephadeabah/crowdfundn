# app/services/donation_confirmation_email_service.rb
class DonationConfirmationEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Ltd')
    end

    def template_id
      ENV.fetch('BREVO_DONATION_CONFIRMATION_TEMPLATE_ID', 1).to_i
    end

    # Main Method
    def send_confirmation_email(donation)
      return false unless donation
      
      # Validate required data
      return false unless donation.campaign.present?
      return false unless donation.campaign.fundraiser.present?
      return false unless donation.email.present?

      # Extract user information
      user_name = donation.full_name || 'Valued Donor'
      user_email = donation.email
      campaign_name = donation.campaign.title || 'the campaign'
      fundraiser_name = donation.campaign.fundraiser.full_name || 'the fundraiser'
      transaction_reference = donation.transaction_reference || donation.id.to_s
      transaction_amount = donation.gross_amount.to_f
      transaction_date = donation.created_at.strftime('%B %d, %Y')
      currency_symbol = donation.campaign.currency_symbol || 'GHS'
      
      # Build campaign URL
      campaign_url = build_campaign_url(donation.campaign)
      
      # Build support URL
      support_url = "#{frontend_url}/support"

      subject = build_subject(campaign_name, user_name)

      html_content = build_html_content(
        user_name: user_name,
        campaign_name: campaign_name,
        fundraiser_name: fundraiser_name,
        transaction_reference: transaction_reference,
        transaction_amount: transaction_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        campaign_url: campaign_url,
        support_url: support_url
      )

      text_content = build_text_content(
        user_name: user_name,
        campaign_name: campaign_name,
        fundraiser_name: fundraiser_name,
        transaction_reference: transaction_reference,
        transaction_amount: transaction_amount,
        transaction_date: transaction_date,
        currency_symbol: currency_symbol,
        campaign_url: campaign_url,
        support_url: support_url
      )

      result = send_email(
        user_email,
        user_name,
        subject,
        html_content,
        text_content,
        donation
      )

      if result
        log_email_sent(donation)
      end

      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign)
      return frontend_url if campaign.nil?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    # Subject Builder
    def build_subject(campaign_name, user_name)
      "Thank you for your donation to #{campaign_name}!"
    end

    # HTML Content Builder
    def build_html_content(
      user_name:,
      campaign_name:,
      fundraiser_name:,
      transaction_reference:,
      transaction_amount:,
      transaction_date:,
      currency_symbol:,
      campaign_url:,
      support_url:
    )
      formatted_amount = number_with_delimiter(transaction_amount)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Thank You for Your Donation</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>Thank You for Your Donation! 🎉</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{user_name},</p>
                
                <p>Thank you so much for your generous donation of <strong>#{currency_symbol} #{formatted_amount}</strong> to the <strong>#{campaign_name}</strong> campaign.</p>
                
                <div class="investment-details">
                  <div class="detail-row">
                    <span class="detail-label">Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Fundraiser:</span>
                    <span class="detail-value">#{fundraiser_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Amount:</span>
                    <span class="detail-value" style="color: #27ae60; font-weight: 600;">#{currency_symbol} #{formatted_amount}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Transaction Reference:</span>
                    <span class="detail-value">#{transaction_reference}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">#{transaction_date}</span>
                  </div>
                </div>

                <p>Your contribution is helping <strong>#{fundraiser_name}</strong> in their efforts to achieve their goals. We truly appreciate your support!</p>

                <div class="action-section">
                  <p>View the campaign and see the impact of your donation:</p>
                  <a href="#{campaign_url}" class="cta-button">View Campaign</a>
                </div>

                <div class="impact-section">
                  <p><strong>Did you know?</strong> Your donation helps create positive change in communities across Ghana and beyond. Every contribution, no matter the size, makes a difference!</p>
                </div>

                <div class="support-section">
                  <p><strong>Need help?</strong> Have questions about your donation?</p>
                  <p>📧 <a href="mailto:#{sender_email}">#{sender_email}</a></p>
                  <p>🌐 <a href="#{support_url}">Visit our Support Center</a></p>
                </div>

                <p>Thanks again for your generosity!<br>
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
      fundraiser_name:,
      transaction_reference:,
      transaction_amount:,
      transaction_date:,
      currency_symbol:,
      campaign_url:,
      support_url:
    )
      formatted_amount = number_with_delimiter(transaction_amount)

      <<~TEXT
        Dear #{user_name},

        Thank you so much for your generous donation of #{currency_symbol} #{formatted_amount} to the #{campaign_name} campaign.

        Donation Details:
        - Campaign: #{campaign_name}
        - Fundraiser: #{fundraiser_name}
        - Amount: #{currency_symbol} #{formatted_amount}
        - Transaction Reference: #{transaction_reference}
        - Date: #{transaction_date}

        Your contribution is helping #{fundraiser_name} in their efforts to achieve their goals. We truly appreciate your support!

        View the campaign and see the impact of your donation:
        #{campaign_url}

        Did you know? Your donation helps create positive change in communities across Ghana and beyond. Every contribution, no matter the size, makes a difference!

        Need help? Have questions about your donation?
        Email: #{sender_email}
        Support Center: #{support_url}

        Thanks again for your generosity!
        #{sender_name}

        You are receiving this email because you made a donation through Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, donation)
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
            'X-Mailin-custom' => 'donation_confirmation',
            'X-Entity-Ref-ID' => "donation_#{donation.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'donation_confirmation'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent donation confirmation email to #{recipient_email} - Donation ID: #{donation.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending donation confirmation to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send donation confirmation email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(donation)
      log_data = {
        donation_id: donation.id,
        recipient_email: donation.email,
        sent_at: Time.current.iso8601,
        amount: donation.gross_amount,
        campaign_id: donation.campaign_id
      }
      
      Rails.logger.info "Donation confirmation email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if donation.respond_to?(:update) && donation.respond_to?(:confirmation_email_sent_at)
        donation.update(confirmation_email_sent_at: Time.current)
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
          background-color: #f0faf0;
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
        }
        .detail-label {
          font-weight: 600;
          width: 180px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #27ae60;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 10px 0;
        }
        .cta-button:hover {
          background-color: #219a52;
        }
        .impact-section {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #2980b9;
        }
        .support-section {
          background-color: #fef9e7;
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
          background-color: #f0faf0;
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
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you made a donation through Bantuhive.</p>
          
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