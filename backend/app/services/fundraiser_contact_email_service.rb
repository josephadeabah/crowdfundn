# app/services/fundraiser_contact_email_service.rb
class FundraiserContactEmailService
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

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def template_id
      ENV.fetch('BREVO_FUNDRAISER_CONTACT_TEMPLATE_ID', 2).to_i
    end

    # Main Method
    def send_contact_email(fundraiser_email, fundraiser_name, campaign_name, user_name, user_email, message)
      # Validate required parameters
      return false unless validate_parameters(fundraiser_email, fundraiser_name, campaign_name, user_name, user_email, message)

      # Sanitize inputs to prevent injection
      sanitized_fundraiser_name = sanitize_text(fundraiser_name)
      sanitized_campaign_name = sanitize_text(campaign_name)
      sanitized_user_name = sanitize_text(user_name)
      sanitized_user_email = sanitize_email(user_email)
      sanitized_message = sanitize_text(message)

      # Prepare subject with campaign context
      subject = build_subject(sanitized_campaign_name, sanitized_user_name)

      # Build HTML and text content
      html_content = build_html_content(
        fundraiser_name: sanitized_fundraiser_name,
        campaign_name: sanitized_campaign_name,
        user_name: sanitized_user_name,
        user_email: sanitized_user_email,
        message: sanitized_message,
        support_email: support_email
      )

      text_content = build_text_content(
        fundraiser_name: sanitized_fundraiser_name,
        campaign_name: sanitized_campaign_name,
        user_name: sanitized_user_name,
        user_email: sanitized_user_email,
        message: sanitized_message,
        support_email: support_email
      )

      result = send_email(
        fundraiser_email,
        sanitized_fundraiser_name,
        subject,
        html_content,
        text_content,
        sanitized_user_email,
        sanitized_user_name
      )

      if result
        log_email_sent(fundraiser_email, sanitized_user_email, sanitized_campaign_name)
      end

      result
    end

    private

    # Validation Methods
    def validate_parameters(fundraiser_email, fundraiser_name, campaign_name, user_name, user_email, message)
      return false unless fundraiser_email.present? && valid_email?(fundraiser_email)
      return false unless fundraiser_name.present?
      return false unless campaign_name.present?
      return false unless user_name.present?
      return false unless user_email.present? && valid_email?(user_email)
      return false unless message.present?
      true
    end

    def valid_email?(email)
      email.present? && email.match?(/\A[^@\s]+@[^@\s]+\z/)
    end

    # Sanitization Methods
    def sanitize_text(text)
      # Remove any HTML tags to prevent injection
      ActionController::Base.helpers.sanitize(text.to_s, tags: [], attributes: [])
    rescue => e
      # Fallback to basic sanitization
      text.to_s.gsub(/<[^>]*>/, '')
    end

    def sanitize_email(email)
      email.to_s.strip.downcase
    end

    # Subject Builder
    def build_subject(campaign_name, user_name)
      "New message from #{user_name} about #{campaign_name}"
    end

    # HTML Content Builder
    def build_html_content(
      fundraiser_name:,
      campaign_name:,
      user_name:,
      user_email:,
      message:,
      support_email:
    )
      # Prepare message with proper line breaks
      formatted_message = message.to_s.gsub(/\n/, '<br>')

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>New Message from Supporter</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>📩 New Message from a Supporter</h1>
              </div>

              <div class="content">
                <p class="greeting">Hi #{fundraiser_name},</p>
                
                <p>You have received a new message from <strong>#{user_name}</strong> regarding your campaign "<strong>#{campaign_name}</strong>".</p>
                
                <div class="message-details">
                  <div class="detail-row">
                    <span class="detail-label">From:</span>
                    <span class="detail-value">#{user_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value"><a href="mailto:#{user_email}">#{user_email}</a></span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Campaign:</span>
                    <span class="detail-value">#{campaign_name}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">Sent:</span>
                    <span class="detail-value">#{Time.current.strftime('%B %d, %Y at %H:%M')}</span>
                  </div>
                </div>

                <div class="message-content">
                  <h3>Message:</h3>
                  <div class="message-body">
                    #{formatted_message}
                  </div>
                </div>

                <div class="action-section">
                  <p>Would you like to respond to #{user_name}?</p>
                  <a href="mailto:#{user_email}?subject=Re: Your message about #{campaign_name}" class="cta-button" style="background-color: #3498db;">
                    Reply to #{user_name}
                  </a>
                </div>

                <div class="security-notice">
                  <p><strong>⚠️ IMPORTANT SECURITY NOTICE:</strong></p>
                  <p>This message was sent by an individual who contacted you through your campaign. While we encourage supporter engagement, please:</p>
                  <ul>
                    <li>Verify the sender's identity before responding to any links or sharing personal information</li>
                    <li>Never share sensitive financial information or passwords</li>
                    <li>Be cautious of unsolicited requests for personal data</li>
                  </ul>
                  <p>If you feel this message is suspicious or abusive, please forward it to <a href="mailto:#{support_email}">#{support_email}</a>.</p>
                </div>

                <p>Warm Regards,<br>
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
      fundraiser_name:,
      campaign_name:,
      user_name:,
      user_email:,
      message:,
      support_email:
    )
      <<~TEXT
        Hi #{fundraiser_name},

        You have received a new message from #{user_name} regarding your campaign "#{campaign_name}".

        Message Details:
        - From: #{user_name}
        - Email: #{user_email}
        - Campaign: #{campaign_name}
        - Sent: #{Time.current.strftime('%B %d, %Y at %H:%M')}

        Message:
        #{message}

        Would you like to respond to #{user_name}?
        Reply to: #{user_email}

        ⚠️ IMPORTANT SECURITY NOTICE:
        This message was sent by an individual who contacted you through your campaign. While we encourage supporter engagement, please:
        - Verify the sender's identity before responding to any links or sharing personal information
        - Never share sensitive financial information or passwords
        - Be cautious of unsolicited requests for personal data

        If you feel this message is suspicious or abusive, please forward it to #{support_email}.

        Warm Regards,
        #{sender_name}

        You are receiving this email because you have a Bantuhive account.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email, recipient_name, subject, html_content, text_content, reply_to_email, reply_to_name)
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
          replyTo: {
            email: reply_to_email,
            name: reply_to_name
          },
          headers: {
            'X-Mailin-custom' => 'fundraiser_contact',
            'X-Entity-Ref-ID' => "fundraiser_contact_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'fundraiser_contact',
            # Anti-phishing headers
            'X-Auto-Response-Suppress' => 'OOF, AutoReply',
            'X-Priority' => '3 (Normal)'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)
        
        Rails.logger.info "Successfully sent fundraiser contact email to #{recipient_email} from #{reply_to_email}"
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending fundraiser contact to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send fundraiser contact email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(fundraiser_email, supporter_email, campaign_name)
      log_data = {
        fundraiser_email: fundraiser_email,
        supporter_email: supporter_email,
        campaign_name: campaign_name,
        sent_at: Time.current.iso8601
      }
      
      Rails.logger.info "Fundraiser contact email sent: #{log_data.to_json}"
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
        .message-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
        }
        .detail-label {
          font-weight: 600;
          width: 120px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .detail-value a {
          color: #2980b9;
          text-decoration: none;
        }
        .detail-value a:hover {
          text-decoration: underline;
        }
        .message-content {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .message-content h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .message-body {
          padding: 10px;
          background-color: white;
          border-radius: 4px;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: monospace;
          font-size: 14px;
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
        .security-notice {
          background-color: #fdedec;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #e74c3c;
        }
        .security-notice p {
          margin: 8px 0;
        }
        .security-notice ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .security-notice li {
          margin-bottom: 5px;
        }
        .security-notice a {
          color: #2980b9;
          text-decoration: none;
        }
        .security-notice a:hover {
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
          <p>You are receiving this email because you have a Bantuhive account.</p>
          
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