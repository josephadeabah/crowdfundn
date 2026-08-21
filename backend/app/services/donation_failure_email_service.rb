# app/services/donation_failure_email_service.rb
class DonationFailureEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Support')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_failure_email(donation:, recipient_email:, recipient_name:, failure_reason:, metadata: {})
      return false unless recipient_email.present?
      return false unless donation

      # Extract and format data
      campaign = donation.campaign
      amount = donation.amount&.round(2)
      currency_symbol = campaign&.currency_symbol || '₵'
      
      # Build URLs
      campaign_url = build_campaign_url(campaign, metadata)
      retry_url = build_retry_url(donation, campaign, metadata)

      # Parse and categorize failure reason
      failure_details = parse_failure_reason(failure_reason, metadata)
      
      # Build subject with urgency based on failure type
      subject = build_subject(failure_details[:category], campaign)

      html_content = build_html_content(
        campaign: campaign,
        campaign_url: campaign_url,
        retry_url: retry_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        failure_details: failure_details,
        donation: donation,
        metadata: metadata
      )

      text_content = build_text_content(
        campaign: campaign,
        campaign_url: campaign_url,
        retry_url: retry_url,
        recipient_name: recipient_name,
        currency_symbol: currency_symbol,
        amount: amount,
        failure_details: failure_details,
        donation: donation,
        metadata: metadata
      )

      result = send_email(recipient_email, recipient_name, subject, html_content, text_content, donation)

      if result
        log_email_sent(donation, recipient_email, failure_details)
      end

      result
    end

    private

    # URL Builders
    def build_campaign_url(campaign, metadata)
      return metadata[:redirect_url] if metadata[:redirect_url].present?
      return frontend_url if campaign.nil?
      "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}"
    end

    def build_retry_url(donation, campaign, metadata)
      return metadata[:retry_url] if metadata[:retry_url].present?
      
      if donation.respond_to?(:token) && donation.token.present?
        "#{frontend_url}/donations/retry/#{donation.token}"
      elsif campaign
        "#{frontend_url}/campaigns/#{campaign.slug || campaign.id}/donate"
      else
        frontend_url
      end
    end

    # Subject Builder
    def build_subject(failure_category, campaign)
      campaign_name = campaign&.title || 'the campaign'
      
      case failure_category
      when :payment_declined
        "Your payment was declined for #{campaign_name}"
      when :insufficient_funds
        "Insufficient funds for your donation to #{campaign_name}"
      when :technical_error
        "Technical issue with your donation to #{campaign_name}"
      when :expired
        "Your donation attempt to #{campaign_name} has expired"
      else
        "Your donation attempt to #{campaign_name} was unsuccessful"
      end
    end

    # Failure Reason Parser
    def parse_failure_reason(failure_reason, metadata)
      reason_text = failure_reason.to_s
      category = :unknown
      suggestions = []
      is_actionable = false

      # Map common error patterns to categories and suggestions
      if reason_text.match?(/declined|card declined|payment declined|do not honor/i)
        category = :payment_declined
        suggestions = [
          "Check that your card details are correct",
          "Contact your bank to authorize the transaction",
          "Try using a different payment method"
        ]
        is_actionable = true
      elsif reason_text.match?(/insufficient funds|not enough funds|balance/i)
        category = :insufficient_funds
        suggestions = [
          "Ensure you have sufficient funds in your account",
          "Try a smaller donation amount",
          "Use a different payment method with available funds"
        ]
        is_actionable = true
      elsif reason_text.match?(/expired|timeout|timed out|too slow/i)
        category = :expired
        suggestions = [
          "Try the donation again with a faster connection",
          "Complete the donation form more quickly",
          "Try using a different browser or device"
        ]
        is_actionable = true
      elsif reason_text.match?(/technical|error|server|connection|gateway|timeout/i)
        category = :technical_error
        suggestions = [
          "Our team has been notified and is working on the issue",
          "Please try again in a few minutes",
          "If the problem persists, contact our support team"
        ]
        is_actionable = false
      elsif reason_text.match?(/invalid|cvv|cvc|security code|expiry date/i)
        category = :invalid_details
        suggestions = [
          "Verify your card number is correct",
          "Check the expiry date is valid",
          "Ensure the CVV/CVC code is correct"
        ]
        is_actionable = true
      else
        suggestions = [
          "Please check your payment details and try again",
          "Contact our support team if you need assistance"
        ]
        is_actionable = true
      end

      # Add gateway-specific error code if available
      error_code = metadata[:error_code] || metadata[:gateway_code] || metadata[:status_code]
      
      {
        text: reason_text,
        category: category,
        suggestions: suggestions,
        is_actionable: is_actionable,
        error_code: error_code,
        gateway: metadata[:gateway] || metadata[:payment_gateway] || 'N/A',
        attempt_number: metadata[:attempt_number] || 1
      }
    end

    # HTML Content Builder
    def build_html_content(
      campaign:,
      campaign_url:,
      retry_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      failure_details:,
      donation:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      suggestions_html = failure_details[:suggestions].map { |s| "<li>#{s}</li>" }.join

      # Determine header color based on failure category
      header_color = case failure_details[:category]
      when :technical_error
        '#f39c12'  # Yellow/Orange for technical issues
      when :expired
        '#e67e22'  # Orange for expired
      else
        '#e74c3c'  # Red for payment failures
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Donation Unsuccessful</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #{header_color};">
                <h1>Donation Unsuccessful</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{recipient_name},</p>
                
                <p>We encountered an issue processing your donation attempt.</p>

                <div class="investment-details" style="border-left-color: #{header_color};">
                  <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #{header_color}; font-weight: 600;">Payment Failed</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Amount:</span><span class='detail-value'>#{currency_symbol} #{formatted_amount}</span></div>" if amount}
                  #{"<div class='detail-row'><span class='detail-label'>Campaign:</span><span class='detail-value'>#{campaign.title}</span></div>" if campaign}
                  <div class="detail-row">
                    <span class="detail-label">Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{failure_details[:text]}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Error Code:</span><span class='detail-value'>#{failure_details[:error_code]}</span></div>" if failure_details[:error_code]}
                  #{"<div class='detail-row'><span class='detail-label'>Gateway:</span><span class='detail-value'>#{failure_details[:gateway]}</span></div>" if failure_details[:gateway] != 'N/A'}
                  <div class="detail-row">
                    <span class="detail-label">Reference:</span>
                    <span class="detail-value">#{donation.transaction_reference || donation.id}</span>
                  </div>
                  #{"<div class='detail-row'><span class='detail-label'>Attempt:</span><span class='detail-value'>##{failure_details[:attempt_number]}</span></div>"}
                </div>

                <div class="suggestions-section">
                  <h3>What you can do:</h3>
                  <ul>
                    #{suggestions_html}
                  </ul>
                </div>

                <div class="action-section">
                  #{"<a href='#{retry_url}' class='cta-button' style='background-color: #27ae60;'>Try Again</a>" if failure_details[:is_actionable] && retry_url.present?}
                  <a href='#{campaign_url}' class='cta-button' style='background-color: #3498db; margin-left: 10px;'>View Campaign</a>
                </div>

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Our support team is here to help.</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                  <p>🌐 <a href="#{frontend_url}/support">Visit Support Center</a></p>
                </div>

                <p>Best regards,<br>
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
      retry_url:,
      recipient_name:,
      currency_symbol:,
      amount:,
      failure_details:,
      donation:,
      metadata:
    )
      formatted_amount = number_with_delimiter(amount)
      suggestions_text = failure_details[:suggestions].map { |s| "  - #{s}" }.join("\n")

      text = <<~TEXT
        Hello #{recipient_name},

        We encountered an issue processing your donation attempt.

        Status: Payment Failed
        #{amount ? "Amount: #{currency_symbol} #{formatted_amount}" : ""}
        #{campaign ? "Campaign: #{campaign.title}" : ""}
        Reason: #{failure_details[:text]}
        #{failure_details[:error_code] ? "Error Code: #{failure_details[:error_code]}" : ""}
        #{failure_details[:gateway] != 'N/A' ? "Gateway: #{failure_details[:gateway]}" : ""}
        Reference: #{donation.transaction_reference || donation.id}
        Attempt: ##{failure_details[:attempt_number]}

        What you can do:
        #{suggestions_text}

        Action Items:
        #{failure_details[:is_actionable] && retry_url.present? ? "Try Again: #{retry_url}" : ""}
        View Campaign: #{campaign_url}

        Need assistance? Our support team is here to help.
        Email: #{support_email}
        Support Center: #{frontend_url}/support

        Best regards,
        #{sender_name}

        You are receiving this email because you attempted to make a donation through Bantuhive.

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
            'X-Mailin-custom' => 'donation_failure',
            'X-Entity-Ref-ID' => "donation_failure_#{donation.id}_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'donation_failure'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent donation failure email to #{recipient_email} - Donation ID: #{donation.id}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending donation failure to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send donation failure email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(donation, recipient_email, failure_details)
      log_data = {
        donation_id: donation.id,
        recipient_email: recipient_email,
        sent_at: Time.current.iso8601,
        failure_category: failure_details[:category],
        failure_reason: failure_details[:text],
        attempt_number: failure_details[:attempt_number],
        campaign_id: donation.campaign_id
      }
      
      Rails.logger.info "Donation failure email sent: #{log_data.to_json}"
      
      # Store in database for tracking if needed
      if donation.respond_to?(:update) && donation.respond_to?(:failure_email_sent_at)
        donation.update(
          failure_email_sent_at: Time.current,
          last_failure_reason: failure_details[:text],
          failure_category: failure_details[:category]
        )
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
        .suggestions-section {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .suggestions-section h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .suggestions-section ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .suggestions-section li {
          margin-bottom: 5px;
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
          opacity: 0.9;
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
          }
          .content {
            padding: 20px;
          }
          .cta-button {
            display: block;
            margin: 10px 0;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you attempted to make a donation through Bantuhive.</p>
          
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