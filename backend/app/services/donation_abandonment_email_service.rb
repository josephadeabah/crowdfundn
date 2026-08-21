# app/services/donation_abandonment_email_service.rb
class DonationAbandonmentEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Donations')
    end

    def max_attempts
      ENV.fetch('DONATION_ABANDONMENT_MAX_ATTEMPTS', 3).to_i
    end

    # Main Method
    def send_abandonment_email(donation:, recipient_email:, recipient_name:, attempt_count:, gateway_response: nil)
      return false unless donation && recipient_email.present?
      
      # Check if we've already sent too many abandonment emails
      if attempt_count >= max_attempts
        Rails.logger.warn "Max abandonment attempts (#{max_attempts}) reached for donation #{donation.id}"
        return false
      end

      campaign = donation.campaign
      amount = donation.amount&.round(2)
      currency_symbol = campaign&.currency_symbol || '₵'
      
      # Build campaign URL using environment configuration
      campaign_url = build_campaign_url(campaign)
      donation_resume_url = build_donation_resume_url(donation)

      subject = build_subject(campaign, attempt_count)
      
      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        donation_resume_url: donation_resume_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        attempt_count: attempt_count,
        gateway_response: gateway_response,
        donation: donation
      )
      
      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        donation_resume_url: donation_resume_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        attempt_count: attempt_count,
        gateway_response: gateway_response,
        donation: donation
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content)
      
      if result
        log_email_sent(donation, recipient_email, attempt_count)
      end
      
      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign)
      return frontend_url if campaign.nil?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_donation_resume_url(donation)
      if donation.respond_to?(:token) && donation.token.present?
        "#{frontend_url}/donations/resume/#{donation.token}"
      else
        "#{frontend_url}/donations/#{donation.id}/resume"
      end
    end

    # Subject Builder
    def build_subject(campaign, attempt_count)
      base = "Complete your donation to #{campaign&.title || 'the campaign'}"
      
      case attempt_count
      when 0
        "#{base} - Don't miss out!"
      when 1
        "#{base} - Still waiting for you!"
      else
        "#{base} - Final reminder!"
      end
    end

    # HTML Content Builder
    def build_html_content(campaign:, campaign_url:, donation_resume_url:, recipient_name:, currency_symbol:, amount:, attempt_count:, gateway_response:, donation:)
      reminder_intensity = case attempt_count
      when 0
        "We noticed you started a donation but didn't complete it."
      when 1
        "Your donation is still pending. Don't miss the chance to make a difference!"
      else
        "This is your final reminder to complete your donation before it expires."
      end

      gateway_error = extract_gateway_error(gateway_response)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Complete Your Donation</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #f39c12;">
                <h1>Complete Your Donation</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{recipient_name},</p>
                
                <p>#{reminder_intensity}</p>

                <div class="investment-details">
                  #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                  #{"<div class='detail-row'><span class='detail-label'>Amount:</span><span class='detail-value'>#{currency_symbol}#{number_with_delimiter(amount)}</span></div>" if amount}
                  <div class="detail-row">
                    <span class="detail-label">Reminder:</span>
                    <span class="detail-value">##{attempt_count + 1}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #f39c12;">Incomplete</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Reference:</span><span class='detail-value'>#{donation.reference || 'N/A'}</span></div>" if donation.respond_to?(:reference)}
                </div>

                #{"<div class='gateway-error'><strong>Payment Gateway Response:</strong><br>#{gateway_error}</div>" if gateway_error}

                <div class="action-section">
                  <p>Don't miss the opportunity to support this important cause.</p>
                  <a href="#{donation_resume_url}" class="cta-button">Complete Your Donation</a>
                </div>

                <p>If you encountered any issues or need assistance, our support team is here to help.</p>
                
                <div class="support-section">
                  <p><strong>Need help?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{sender_email}">#{sender_email}</a></p>
                </div>

                <p>Thank you for your generosity,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Content Builder
    def build_text_content(campaign:, campaign_url:, donation_resume_url:, recipient_name:, currency_symbol:, amount:, attempt_count:, gateway_response:, donation:)
      reminder_intensity = case attempt_count
      when 0
        "We noticed you started a donation but didn't complete it."
      when 1
        "Your donation is still pending. Don't miss the chance to make a difference!"
      else
        "This is your final reminder to complete your donation before it expires."
      end

      gateway_error = extract_gateway_error(gateway_response)

      text = <<~TEXT
        Hello #{recipient_name},

        #{reminder_intensity}

        Donation Details:
        #{campaign ? "- Campaign: #{campaign.title}" : ""}
        #{amount ? "- Amount: #{currency_symbol}#{number_with_delimiter(amount)}" : ""}
        - Reminder: ##{attempt_count + 1}
        - Status: Incomplete
        #{donation.respond_to?(:reference) ? "- Reference: #{donation.reference || 'N/A'}" : ""}
      TEXT

      text += "\nPayment Gateway Response: #{gateway_error}" if gateway_error

      text += <<~TEXT

        Complete your donation now:
        #{donation_resume_url}

        If you encountered any issues or need assistance, our support team is here to help.
        Contact us at: #{sender_email}

        Thank you for your generosity,
        #{sender_name}

        #{email_footer_text}
      TEXT
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

    def log_email_sent(donation, recipient_email, attempt_count)
      log_data = {
        donation_id: donation.id,
        recipient_email: recipient_email,
        attempt_count: attempt_count,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Donation abandonment email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if donation.respond_to?(:update) && donation.respond_to?(:last_abandonment_email_sent_at)
        donation.update(
          last_abandonment_email_sent_at: Time.current,
          abandonment_email_count: (donation.abandonment_email_count || 0) + 1
        )
      end
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content)
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
            'X-Mailin-custom' => 'donation_abandonment',
            'X-Entity-Ref-ID' => "donation_abandonment_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'donation_abandonment'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent donation abandonment email to #{recipient_email} - Subject: #{subject}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending donation abandonment email to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send donation abandonment email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
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
        .gateway-error {
          background-color: #fef9e7;
          border-left: 4px solid #e67e22;
          padding: 15px;
          margin: 20px 0;
          border-radius: 4px;
          font-size: 14px;
          color: #7f6000;
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
          }
          .content {
            padding: 20px;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you started a donation through Bantuhive.</p>
          
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

    def email_footer_text
      <<~TEXT
        You are receiving this email because you started a donation through Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    def number_with_delimiter(number)
      return '' unless number
      
      # Simple number formatting without ActionView dependency
      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end
  end
end