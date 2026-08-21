# app/services/user_confirmation_email_service.rb
class UserConfirmationEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://bantuhive.com')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@bantuhive.com')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Ltd')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@bantuhive.com')
    end

    # Main Method
    def send_confirmation_email(user)
      return false unless validate_user(user)
      return false unless user.email.present?

      # Generate token if missing
      token = user.confirmation_token.presence || generate_confirmation_token(user)
      
      confirmation_url = build_confirmation_url(token)
      full_name = user.full_name.presence || 'Valued User'
      
      subject = "Confirm your email address - Bantuhive"

      html_content = build_confirmation_html(
        user_name: full_name,
        confirmation_url: confirmation_url,
        token: token,
        user: user
      )

      text_content = build_confirmation_text(
        user_name: full_name,
        confirmation_url: confirmation_url,
        token: token
      )

      result = send_email(
        recipient_email: user.email,
        recipient_name: full_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        user: user
      )

      if result
        log_email_sent(user.email, token)
        update_user_confirmation_sent_at(user)
      end

      result
    end

    def send_resend_confirmation_email(user)
      return false unless validate_user(user)
      return false unless user.email.present?
      
      # Check if already confirmed
      if user.confirmed_at.present?
        Rails.logger.info "User #{user.id} already confirmed, skipping resend"
        return false
      end

      # Reset token for security
      user.confirmation_token = generate_confirmation_token(user)
      user.save(validate: false)

      send_confirmation_email(user)
    end

    private

    # Validation Methods
    def validate_user(user)
      return false unless user
      return false unless user.respond_to?(:email)
      return false unless user.email.present?
      true
    end

    # Token Generation
    def generate_confirmation_token(user)
      SecureRandom.urlsafe_base64(32)
    end

    # URL Builder
    def build_confirmation_url(token)
      "#{frontend_url}/auth/confirm_email/#{CGI.escape(token)}"
    end

    # Helper Methods
    def format_date(date)
      return 'N/A' unless date
      date.strftime('%B %d, %Y')
    rescue => e
      date.to_s
    end

    # HTML Builder
    def build_confirmation_html(user_name:, confirmation_url:, token:, user:)
      expires_at = user.confirmation_sent_at ? format_date(user.confirmation_sent_at + 24.hours) : format_date(Time.current + 24.hours)

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Confirm Your Email</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #3498db;">
                <h1>📧 Confirm Your Email</h1>
              </div>

              <div class="content">
                <p class="greeting">Hello #{user_name},</p>

                <p>Thank you for creating an account with <strong>Bantuhive</strong>! To complete your registration and start using our platform, please confirm your email address by clicking the button below.</p>

                <div class="confirmation-details">
                  <div class="detail-row">
                    <span class="detail-label">📧 Email:</span>
                    <span class="detail-value">#{user.email}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">⏳ Expires:</span>
                    <span class="detail-value" style="color: #e67e22;">#{expires_at}</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{confirmation_url}" class="cta-button" style="background-color: #27ae60;">✅ Confirm Email Address</a>
                </div>

                <div class="security-notice">
                  <p><strong>🔒 Security Notice:</strong></p>
                  <p>If you didn't create an account with Bantuhive, please ignore this email and contact our support team immediately.</p>
                </div>

                <div class="help-section">
                  <p><strong>Having trouble?</strong> If the button above doesn't work, copy and paste this URL into your browser:</p>
                  <p style="word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 12px;">
                    #{confirmation_url}
                  </p>
                </div>

                <div class="support-section">
                  <p><strong>Questions?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Welcome to Bantuhive!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Builder
    def build_confirmation_text(user_name:, confirmation_url:, token:)
      <<~TEXT
        Confirm Your Email

        Hello #{user_name},

        Thank you for creating an account with Bantuhive! To complete your registration and start using our platform, please confirm your email address.

        Email: #{user_name}

        Confirm Your Email: #{confirmation_url}

        If you didn't create an account with Bantuhive, please ignore this email and contact our support team immediately.

        Having trouble? Copy and paste this URL into your browser:
        #{confirmation_url}

        Questions? Contact our support team: #{support_email}

        Welcome to Bantuhive!
        #{sender_name}

        You are receiving this email because you created an account on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, user:)
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
            'X-Mailin-custom' => 'email_confirmation',
            'X-Entity-Ref-ID' => "email_confirmation_#{user&.id || Time.current.to_i}",
            'X-Entity-Ref-Type' => 'email_confirmation',
            'X-Priority' => '1 (Highest)',
            'List-Unsubscribe' => "<#{frontend_url}/unsubscribe?email=#{recipient_email}>"
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending confirmation to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send confirmation email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    def log_email_sent(recipient_email, token)
      log_data = {
        recipient_email: recipient_email,
        email_type: 'email_confirmation',
        token_preview: token&.first(8),
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Confirmation email sent: #{log_data.to_json}"
    end

    def update_user_confirmation_sent_at(user)
      return unless user.respond_to?(:update_column)
      user.update_column(:confirmation_sent_at, Time.current)
    rescue => e
      Rails.logger.warn "Could not update confirmation_sent_at for user #{user.id}: #{e.message}"
    end

    # Email Styles
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
          background-color: #3498db;
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
        .confirmation-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .detail-row {
          display: flex;
          margin-bottom: 8px;
          padding: 5px 0;
          border-bottom: 1px solid #e8e8e8;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          width: 120px;
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
          padding: 14px 28px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          font-size: 16px;
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
        .help-section {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
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
        .unsubscribe {
          font-size: 12px;
          color: #999;
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
          <p>You are receiving this email because you created an account on Bantuhive.</p>

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

          <p class="unsubscribe">
            <a href="#{frontend_url}/unsubscribe?email=#{CGI.escape(user&.email || '')}" style="color: #999; text-decoration: none;">Unsubscribe</a>
          </p>
        </div>
      HTML
    end
  end
end