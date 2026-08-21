# app/services/thank_you_email_service.rb
class ThankYouEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'help@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Ltd.')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Method
    def send_thank_you_email(donor_email:, donor_name:, fundraiser_name:, fundraiser_avatar:, campaign_title:, currency:, amount:, campaign_slug: nil, donor_message: nil, is_anonymous: false)
      # Validate required parameters
      return false unless validate_parameters(
        donor_email: donor_email,
        donor_name: donor_name,
        fundraiser_name: fundraiser_name,
        campaign_title: campaign_title,
        currency: currency,
        amount: amount
      )

      # Sanitize inputs
      sanitized_donor_name = sanitize_text(donor_name)
      sanitized_fundraiser_name = sanitize_text(fundraiser_name)
      sanitized_campaign_title = sanitize_text(campaign_title)
      sanitized_donor_message = sanitize_text(donor_message) if donor_message.present?
      
      # Format amount
      formatted_amount = number_with_delimiter(amount)
      
      # Build campaign URL
      campaign_url = campaign_slug.present? ? "#{frontend_url}/campaigns/#{campaign_slug}" : frontend_url
      
      # Determine if donor is anonymous
      display_name = is_anonymous ? 'Anonymous Supporter' : sanitized_donor_name

      subject = build_subject(sanitized_campaign_title, display_name)

      html_content = build_thank_you_html(
        donor_name: display_name,
        fundraiser_name: sanitized_fundraiser_name,
        fundraiser_avatar: fundraiser_avatar,
        campaign_title: sanitized_campaign_title,
        campaign_url: campaign_url,
        currency: currency,
        amount: formatted_amount,
        donor_message: sanitized_donor_message,
        is_anonymous: is_anonymous
      )

      text_content = build_thank_you_text(
        donor_name: display_name,
        fundraiser_name: sanitized_fundraiser_name,
        campaign_title: sanitized_campaign_title,
        campaign_url: campaign_url,
        currency: currency,
        amount: formatted_amount,
        donor_message: sanitized_donor_message,
        is_anonymous: is_anonymous
      )

      result = send_email(
        recipient_email: donor_email,
        recipient_name: display_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        fundraiser_email: nil, # Could add if we want reply-to
        fundraiser_name: sanitized_fundraiser_name
      )

      if result
        log_email_sent(donor_email, sanitized_campaign_title, amount)
      end

      result
    end

    private

    # Validation Methods
    def validate_parameters(donor_email:, donor_name:, fundraiser_name:, campaign_title:, currency:, amount:)
      return false unless donor_email.present? && valid_email?(donor_email)
      return false unless donor_name.present?
      return false unless fundraiser_name.present?
      return false unless campaign_title.present?
      return false unless currency.present?
      return false unless amount.present? && amount.to_f > 0
      true
    end

    def valid_email?(email)
      email.present? && email.match?(/\A[^@\s]+@[^@\s]+\z/)
    end

    # Sanitization Methods
    def sanitize_text(text)
      return '' if text.blank?
      ActionController::Base.helpers.sanitize(text.to_s, tags: [], attributes: [])
    rescue => e
      text.to_s.gsub(/<[^>]*>/, '')
    end

    # Helper Methods
    def number_with_delimiter(number)
      return '0' if number.nil?
      
      parts = number.to_s.split('.')
      parts[0] = parts[0].reverse.gsub(/(\d{3})(?=\d)/, '\\1,').reverse
      parts.join('.')
    rescue => e
      number.to_s
    end

    def build_subject(campaign_title, donor_name)
      "Thank You for Supporting #{campaign_title}!"
    end

    # HTML Builder
    def build_thank_you_html(
      donor_name:,
      fundraiser_name:,
      fundraiser_avatar:,
      campaign_title:,
      campaign_url:,
      currency:,
      amount:,
      donor_message:,
      is_anonymous:
    )
      # Use a default avatar if none provided
      avatar_url = fundraiser_avatar.present? ? fundraiser_avatar : "#{frontend_url}/assets/default_avatar.png"
      
      # Build share links
      share_url = campaign_url
      share_text = CGI.escape("I just donated to #{campaign_title} on Bantuhive! Join me in supporting this great cause.")
      
      # Build donor message section if present
      donor_message_section = if donor_message.present?
        <<~HTML
          <div class="donor-message">
            <h3>💬 Message from #{donor_name}</h3>
            <p>"#{donor_message}"</p>
          </div>
        HTML
      else
        ''
      end

      # Build anonymous note if applicable
      anonymous_note = if is_anonymous
        <<~HTML
          <div class="anonymous-notice">
            <p>🔒 Your donation was made anonymously. The fundraiser will not see your name.</p>
          </div>
        HTML
      else
        ''
      end

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>Thank You for Your Support</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>🙏 Thank You!</h1>
              </div>

              <div class="content">
                <div class="avatar-container">
                  <img src="#{avatar_url}" alt="#{fundraiser_name}" class="avatar" />
                </div>

                <h1>Thank You, #{donor_name}!</h1>

                <p>We are incredibly grateful for your support of <strong>#{currency} #{amount}</strong> to the campaign <strong>#{campaign_title}</strong>.</p>

                #{anonymous_note}

                #{donor_message_section}

                <div class="campaign-info">
                  <h3>📌 Your Impact</h3>
                  <p>Your contribution is helping #{fundraiser_name} make a real difference. Together, we are one step closer to achieving their goals.</p>
                </div>

                <div class="action-section">
                  <a href="#{campaign_url}" class="cta-button" style="background-color: #27ae60;">📱 View Campaign</a>
                </div>

                #{"<div class='share-section'>
                  <h3>📤 Share Your Support</h3>
                  <p>Help spread the word by sharing this campaign with your network:</p>
                  <div class='share-links'>
                    <a href='https://www.facebook.com/sharer/sharer.php?u=#{CGI.escape(share_url)}' class='share-btn facebook'>Facebook</a>
                    <a href='https://twitter.com/intent/tweet?text=#{share_text}&url=#{CGI.escape(share_url)}' class='share-btn twitter'>Twitter</a>
                    <a href='https://www.linkedin.com/sharing/share-offsite/?url=#{CGI.escape(share_url)}' class='share-btn linkedin'>LinkedIn</a>
                  </div>
                </div>"}

                <div class="support-section">
                  <p><strong>Questions about your donation?</strong> Contact our support team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>With heartfelt gratitude,<br>
                <strong>#{fundraiser_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Text Builder
    def build_thank_you_text(
      donor_name:,
      fundraiser_name:,
      campaign_title:,
      campaign_url:,
      currency:,
      amount:,
      donor_message:,
      is_anonymous:
    )
      anonymous_text = is_anonymous ? "\n🔒 Your donation was made anonymously." : ""
      donor_message_text = donor_message.present? ? "\n\nMessage from #{donor_name}:\n\"#{donor_message}\"" : ""

      <<~TEXT
        Thank You for Your Support

        Dear #{donor_name},

        We are incredibly grateful for your support of #{currency} #{amount} to the campaign #{campaign_title}.
        #{anonymous_text}

        Your contribution is helping #{fundraiser_name} make a real difference. Together, we are one step closer to achieving their goals.
        #{donor_message_text}

        View Campaign: #{campaign_url}

        Share this campaign with your network and help spread the word!

        Questions about your donation? Contact our support team: #{support_email}

        With heartfelt gratitude,
        #{fundraiser_name}

        You are receiving this email because you made a donation or investment on Bantuhive.

        27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.
        © #{Time.current.year} Bantuhive Ltd. All rights reserved.
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, fundraiser_email:, fundraiser_name:)
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
          replyTo: fundraiser_email.present? ? {
            email: fundraiser_email,
            name: fundraiser_name
          } : nil,
          headers: {
            'X-Mailin-custom' => 'thank_you_email',
            'X-Entity-Ref-ID' => "thank_you_email_#{Time.current.to_i}",
            'X-Entity-Ref-Type' => 'thank_you_email'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        result = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(recipient_email, "thank_you_email", nil)
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending thank you email to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send thank you email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    def log_email_sent(recipient_email, email_type, amount)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        amount: amount,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "Thank you email sent: #{log_data.to_json}"
    end

    # Email Styles
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
        .content h1 {
          color: #27ae60;
          font-size: 24px;
          margin-bottom: 20px;
          text-align: center;
        }
        .avatar-container {
          text-align: center;
          margin-bottom: 20px;
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #27ae60;
        }
        .donor-message {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .donor-message h3 {
          margin-top: 0;
          color: #7f6000;
        }
        .donor-message p {
          font-style: italic;
          margin-bottom: 0;
        }
        .anonymous-notice {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 12px 15px;
          margin: 15px 0;
          border-left: 4px solid #3498db;
        }
        .campaign-info {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
        }
        .campaign-info h3 {
          margin-top: 0;
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
        .share-section {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          text-align: center;
        }
        .share-section h3 {
          margin-top: 0;
        }
        .share-links {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin: 10px 0;
        }
        .share-btn {
          display: inline-block;
          padding: 8px 16px;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 14px;
        }
        .share-btn.facebook {
          background-color: #3b5998;
        }
        .share-btn.twitter {
          background-color: #1da1f2;
        }
        .share-btn.linkedin {
          background-color: #0077b5;
        }
        .share-btn:hover {
          opacity: 0.8;
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
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 22px;
          }
          .share-links {
            flex-direction: column;
            align-items: center;
          }
          .share-btn {
            display: block;
            width: 100%;
            max-width: 200px;
          }
          .cta-button {
            display: block;
          }
        }
      CSS
    end

    def email_footer
      <<~HTML
        <div class="footer">
          <p>You are receiving this email because you made a donation or investment on Bantuhive.</p>

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