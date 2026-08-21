# app/services/kyc_email_service.rb
class KycEmailService
  class << self
    # Environment Configuration
    def frontend_url
      ENV.fetch('FRONTEND_URL', 'https://crowdfundn.vercel.app')
    end

    def sender_email
      ENV.fetch('BREVO_SENDER_EMAIL', 'compliance@crowdfundn.vercel.app')
    end

    def sender_name
      ENV.fetch('BREVO_SENDER_NAME', 'Bantuhive Compliance')
    end

    def support_email
      ENV.fetch('SUPPORT_EMAIL', 'help@crowdfundn.vercel.app')
    end

    # Main Methods
    def send_submission_received_email(kyc:, recipient_email:, recipient_name:)
      return false unless validate_kyc(kyc)
      return false unless recipient_email.present?

      kyc_type = kyc.kyc_type.to_s.humanize
      submission_date = kyc.created_at.strftime('%B %d, %Y')
      reference_number = kyc.reference || generate_reference(kyc)

      subject = "Your #{kyc_type} KYC submission has been received"

      html_content = build_submission_received_html(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        submission_date: submission_date,
        reference_number: reference_number,
        verification_type: kyc.verification_type.to_s.humanize,
        status: kyc.status.to_s.humanize
      )

      text_content = build_submission_received_text(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        submission_date: submission_date,
        reference_number: reference_number,
        verification_type: kyc.verification_type.to_s.humanize
      )

      send_email(
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'kyc_submission',
        kyc: kyc
      )
    end

    def send_verification_approved_email(kyc:, recipient_email:, recipient_name:, verified_by_name:)
      return false unless validate_kyc(kyc)
      return false unless recipient_email.present?

      kyc_type = kyc.kyc_type.to_s.humanize
      approval_date = kyc.verified_at&.strftime('%B %d, %Y') || Time.current.strftime('%B %d, %Y')
      reference_number = kyc.reference || generate_reference(kyc)

      subject = "Your #{kyc_type} KYC has been approved"

      html_content = build_verification_approved_html(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        approval_date: approval_date,
        reference_number: reference_number,
        verified_by_name: verified_by_name
      )

      text_content = build_verification_approved_text(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        approval_date: approval_date,
        reference_number: reference_number,
        verified_by_name: verified_by_name
      )

      send_email(
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'kyc_approval',
        kyc: kyc
      )
    end

    def send_verification_rejected_email(kyc:, recipient_email:, recipient_name:, rejected_by_name:, rejection_reason:)
      return false unless validate_kyc(kyc)
      return false unless recipient_email.present?

      kyc_type = kyc.kyc_type.to_s.humanize
      reference_number = kyc.reference || generate_reference(kyc)

      subject = "Your #{kyc_type} KYC requires updates"

      html_content = build_verification_rejected_html(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        rejected_by_name: rejected_by_name,
        rejection_reason: rejection_reason
      )

      text_content = build_verification_rejected_text(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        rejected_by_name: rejected_by_name,
        rejection_reason: rejection_reason
      )

      send_email(
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'kyc_rejection',
        kyc: kyc
      )
    end

    def send_verification_reminder_email(kyc:, recipient_email:, recipient_name:, days_pending:)
      return false unless validate_kyc(kyc)
      return false unless recipient_email.present?

      kyc_type = kyc.kyc_type.to_s.humanize
      reference_number = kyc.reference || generate_reference(kyc)
      submission_date = kyc.created_at.strftime('%B %d, %Y')

      subject = "Reminder: Complete your #{kyc_type} KYC verification"

      html_content = build_verification_reminder_html(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        submission_date: submission_date,
        days_pending: days_pending
      )

      text_content = build_verification_reminder_text(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        submission_date: submission_date,
        days_pending: days_pending
      )

      send_email(
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'kyc_reminder',
        kyc: kyc
      )
    end

    def send_verification_expired_email(kyc:, recipient_email:, recipient_name:)
      return false unless validate_kyc(kyc)
      return false unless recipient_email.present?

      kyc_type = kyc.kyc_type.to_s.humanize
      reference_number = kyc.reference || generate_reference(kyc)
      submission_date = kyc.created_at.strftime('%B %d, %Y')
      expiry_date = kyc.expires_at&.strftime('%B %d, %Y') || (Date.current + 30.days).strftime('%B %d, %Y')

      subject = "Your #{kyc_type} KYC verification has expired"

      html_content = build_verification_expired_html(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        submission_date: submission_date,
        expiry_date: expiry_date
      )

      text_content = build_verification_expired_text(
        recipient_name: recipient_name,
        kyc_type: kyc_type,
        reference_number: reference_number,
        submission_date: submission_date,
        expiry_date: expiry_date
      )

      send_email(
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        subject: subject,
        html_content: html_content,
        text_content: text_content,
        email_type: 'kyc_expired',
        kyc: kyc
      )
    end

    private

    # Validation Methods
    def validate_kyc(kyc)
      return false unless kyc
      return false unless kyc.respond_to?(:kyc_type)
      return false unless kyc.respond_to?(:verification_type)
      true
    end

    # Helper Methods
    def generate_reference(kyc)
      "KYC-#{kyc.id}-#{Time.current.strftime('%Y%m')}-#{SecureRandom.hex(4).upcase}"
    end

    # Builders - HTML
    def build_submission_received_html(
      recipient_name:,
      kyc_type:,
      submission_date:,
      reference_number:,
      verification_type:,
      status:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>KYC Submission Received</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #2980b9;">
                <h1>📄 KYC Submission Received</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>

                <p>We've received your <strong>#{kyc_type}</strong> KYC submission and it's now under review.</p>

                <div class="kyc-details" style="border-left-color: #2980b9;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Reference Number:</span>
                    <span class="detail-value">#{reference_number}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submission Date:</span>
                    <span class="detail-value">#{submission_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📑 Document Type:</span>
                    <span class="detail-value">#{verification_type}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Status:</span>
                    <span class="detail-value" style="color: #f39c12; font-weight: 600;">#{status}</span>
                  </div>
                </div>

                <div class="timeline">
                  <h3>⏳ What Happens Next?</h3>
                  <div class="step">
                    <span class="step-number">1</span>
                    <span class="step-text">Review by compliance team (1-3 business days)</span>
                  </div>
                  <div class="step">
                    <span class="step-number">2</span>
                    <span class="step-text">Verification of submitted documents</span>
                  </div>
                  <div class="step">
                    <span class="step-number">3</span>
                    <span class="step-text">Approval notification via email</span>
                  </div>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/kyc/status/#{reference_number}" class="cta-button">Track KYC Status</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your KYC submission?</strong> Contact our compliance team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your patience,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_verification_approved_html(
      recipient_name:,
      kyc_type:,
      approval_date:,
      reference_number:,
      verified_by_name:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>KYC Approved</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #27ae60;">
                <h1>✅ KYC Approved</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>

                <p>We're pleased to inform you that your <strong>#{kyc_type}</strong> KYC has been <strong style="color: #27ae60;">approved</strong>!</p>

                <div class="kyc-details" style="border-left-color: #27ae60; background-color: #e8f5e8;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Reference Number:</span>
                    <span class="detail-value">#{reference_number}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Approval Date:</span>
                    <span class="detail-value">#{approval_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">👤 Verified By:</span>
                    <span class="detail-value">#{verified_by_name}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">✅ Status:</span>
                    <span class="detail-value" style="color: #27ae60; font-weight: 600;">Approved</span>
                  </div>
                </div>

                <div class="benefits">
                  <h3>🎉 What This Means For You</h3>
                  <ul>
                    <li>✅ Full access to all platform features</li>
                    <li>✅ Ability to create and manage campaigns</li>
                    <li>✅ Access to investment opportunities</li>
                    <li>✅ Receive payments and withdrawals</li>
                  </ul>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/dashboard" class="cta-button" style="background-color: #27ae60;">Go to Dashboard</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your verified status?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Welcome aboard!<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_verification_rejected_html(
      recipient_name:,
      kyc_type:,
      reference_number:,
      rejected_by_name:,
      rejection_reason:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>KYC Update Required</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>📋 KYC Update Required</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>

                <p>After reviewing your <strong>#{kyc_type}</strong> KYC submission, we need some additional information to complete the verification process.</p>

                <div class="kyc-details" style="border-left-color: #e74c3c; background-color: #fdecea;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Reference Number:</span>
                    <span class="detail-value">#{reference_number}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">👤 Reviewed By:</span>
                    <span class="detail-value">#{rejected_by_name}</span>
                  </div>
                  <div class="detail-row highlight">
                    <span class="detail-label">📝 Reason:</span>
                    <span class="detail-value" style="color: #c0392b;">#{rejection_reason}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Status:</span>
                    <span class="detail-value" style="color: #e74c3c; font-weight: 600;">Action Required</span>
                  </div>
                </div>

                <div class="action-required">
                  <h3>📌 What You Need To Do</h3>
                  <ol>
                    <li>Log in to your account</li>
                    <li>Go to the KYC section</li>
                    <li>Review the feedback provided</li>
                    <li>Submit updated documents</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/kyc" class="cta-button" style="background-color: #e67e22;">Update KYC</a>
                </div>

                <div class="support-section">
                  <p><strong>Need help with your KYC submission?</strong> Our compliance team is here to assist:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your cooperation,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_verification_reminder_html(
      recipient_name:,
      kyc_type:,
      reference_number:,
      submission_date:,
      days_pending:
    )
      urgency = days_pending > 5 ? '⚠️' : '📌'

      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>KYC Verification Reminder</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #f39c12;">
                <h1>#{urgency} KYC Verification Reminder</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>

                <p>This is a reminder that your <strong>#{kyc_type}</strong> KYC verification is still pending.</p>

                <div class="kyc-details" style="border-left-color: #f39c12;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Reference Number:</span>
                    <span class="detail-value">#{reference_number}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submission Date:</span>
                    <span class="detail-value">#{submission_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">⏳ Days Pending:</span>
                    <span class="detail-value" style="color: #{days_pending > 5 ? '#e74c3c' : '#f39c12'}; font-weight: 600;">#{days_pending} days</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Status:</span>
                    <span class="detail-value" style="color: #f39c12; font-weight: 600;">Pending Review</span>
                  </div>
                </div>

                <div class="reminder-info">
                  <p>#{days_pending > 5 ? '⚠️ Your KYC submission has been pending for over 5 days. Please check your email for any requests for additional information.' : 'Our compliance team is working through submissions in order received. You will be notified once your verification is complete.'}</p>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/kyc/status/#{reference_number}" class="cta-button" style="background-color: #3498db;">Check Status</a>
                </div>

                <div class="support-section">
                  <p><strong>Questions about your KYC status?</strong> Contact our team:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>Thank you for your patience,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    def build_verification_expired_html(
      recipient_name:,
      kyc_type:,
      reference_number:,
      submission_date:,
      expiry_date:
    )
      <<~HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width">
            <title>KYC Verification Expired</title>
            <style>
              #{email_styles}
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header" style="background-color: #e74c3c;">
                <h1>⏰ KYC Verification Expired</h1>
              </div>

              <div class="content">
                <p class="greeting">Dear #{recipient_name},</p>

                <p>Your <strong>#{kyc_type}</strong> KYC verification has expired and needs to be resubmitted.</p>

                <div class="kyc-details" style="border-left-color: #e74c3c; background-color: #fdecea;">
                  <div class="detail-row">
                    <span class="detail-label">📋 Reference Number:</span>
                    <span class="detail-value">#{reference_number}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Submission Date:</span>
                    <span class="detail-value">#{submission_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📅 Expiry Date:</span>
                    <span class="detail-value" style="color: #c0392b;">#{expiry_date}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-label">📊 Status:</span>
                    <span class="detail-value" style="color: #e74c3c; font-weight: 600;">Expired</span>
                  </div>
                </div>

                <div class="action-required">
                  <h3>📌 What You Need To Do</h3>
                  <p>To continue using platform features, please submit a new KYC verification:</p>
                  <ol>
                    <li>Log in to your account</li>
                    <li>Go to the KYC section</li>
                    <li>Submit a new verification request</li>
                    <li>Provide updated documentation</li>
                  </ol>
                </div>

                <div class="action-section">
                  <a href="#{frontend_url}/kyc" class="cta-button" style="background-color: #e67e22;">Submit New KYC</a>
                </div>

                <div class="support-section">
                  <p><strong>Need assistance?</strong> Our compliance team is here to help:</p>
                  <p>📧 <a href="mailto:#{support_email}">#{support_email}</a></p>
                </div>

                <p>We apologize for any inconvenience,<br>
                <strong>#{sender_name}</strong></p>
              </div>

              #{email_footer}
            </div>
          </body>
        </html>
      HTML
    end

    # Builders - Text
    def build_submission_received_text(
      recipient_name:,
      kyc_type:,
      submission_date:,
      reference_number:,
      verification_type:
    )
      <<~TEXT
        KYC Submission Received

        Dear #{recipient_name},

        We've received your #{kyc_type} KYC submission (Reference: #{reference_number}) and it's now under review.

        Submission Details:
        - Date: #{submission_date}
        - Document Type: #{verification_type}

        Our team will review your submission within 1-3 business days.

        Track KYC Status: #{frontend_url}/kyc/status/#{reference_number}

        Questions? Contact our compliance team: #{support_email}

        Thank you for your patience,
        #{sender_name}
      TEXT
    end

    def build_verification_approved_text(
      recipient_name:,
      kyc_type:,
      approval_date:,
      reference_number:,
      verified_by_name:
    )
      <<~TEXT
        KYC Approved

        Dear #{recipient_name},

        Your #{kyc_type} KYC (Reference: #{reference_number}) has been approved by #{verified_by_name} on #{approval_date}.

        Your account is now fully verified and you can access all platform features.

        Go to Dashboard: #{frontend_url}/dashboard

        Questions? Contact our team: #{support_email}

        Welcome aboard!
        #{sender_name}
      TEXT
    end

    def build_verification_rejected_text(
      recipient_name:,
      kyc_type:,
      reference_number:,
      rejected_by_name:,
      rejection_reason:
    )
      <<~TEXT
        KYC Update Required

        Dear #{recipient_name},

        Your #{kyc_type} KYC (Reference: #{reference_number}) requires updates:

        Reason: #{rejection_reason}
        Reviewed By: #{rejected_by_name}

        Please log in to your account to submit the requested information.

        Update KYC: #{frontend_url}/kyc

        Questions? Contact our compliance team: #{support_email}

        Thank you for your cooperation,
        #{sender_name}
      TEXT
    end

    def build_verification_reminder_text(
      recipient_name:,
      kyc_type:,
      reference_number:,
      submission_date:,
      days_pending:
    )
      text = <<~TEXT
        KYC Verification Reminder

        Dear #{recipient_name},

        This is a reminder that your #{kyc_type} KYC verification is still pending.

        Reference Number: #{reference_number}
        Submission Date: #{submission_date}
        Days Pending: #{days_pending} days
      TEXT

      if days_pending > 5
        text += "\n⚠️ Your KYC submission has been pending for over 5 days. Please check your email for any requests for additional information."
      else
        text += "\nOur compliance team is working through submissions in order received. You will be notified once your verification is complete."
      end

      text += <<~TEXT

        Check Status: #{frontend_url}/kyc/status/#{reference_number}

        Questions about your KYC status? Contact our team: #{support_email}

        Thank you for your patience,
        #{sender_name}
      TEXT
    end

    def build_verification_expired_text(
      recipient_name:,
      kyc_type:,
      reference_number:,
      submission_date:,
      expiry_date:
    )
      <<~TEXT
        KYC Verification Expired

        Dear #{recipient_name},

        Your #{kyc_type} KYC verification has expired and needs to be resubmitted.

        Reference Number: #{reference_number}
        Submission Date: #{submission_date}
        Expiry Date: #{expiry_date}

        To continue using platform features, please submit a new KYC verification:
        1. Log in to your account
        2. Go to the KYC section
        3. Submit a new verification request

        Submit New KYC: #{frontend_url}/kyc

        Need assistance? Contact our compliance team: #{support_email}

        We apologize for any inconvenience,
        #{sender_name}
      TEXT
    end

    # Email Sending Method
    def send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, email_type:, kyc: nil)
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
            'X-Mailin-custom' => email_type,
            'X-Entity-Ref-ID' => "#{email_type}_#{kyc&.id || Time.current.to_i}",
            'X-Entity-Ref-Type' => email_type,
            'X-Priority' => '3 (Normal)'
          }
        )

        api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
        response = api_instance.send_transac_email(send_smtp_email)

        log_email_sent(recipient_email, email_type, kyc)
        true
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Brevo API error sending #{email_type} to #{recipient_email}: #{e.message}"
        Rails.logger.error "Response body: #{e.response_body}" if e.respond_to?(:response_body)
        false
      rescue StandardError => e
        Rails.logger.error "Failed to send #{email_type} email to #{recipient_email}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n") if Rails.env.development?
        false
      end
    end

    # Helper Methods
    def log_email_sent(recipient_email, email_type, kyc)
      log_data = {
        recipient_email: recipient_email,
        email_type: email_type,
        kyc_id: kyc&.id,
        sent_at: Time.current.iso8601
      }

      Rails.logger.info "KYC email sent: #{log_data.to_json}"
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
          background-color: #2c3e50;
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
        .kyc-details {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3498db;
        }
        .detail-row {
          display: flex;
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px solid #e8e8e8;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-row.highlight {
          background-color: #fafafa;
          border-radius: 4px;
          padding: 8px 0;
        }
        .detail-label {
          font-weight: 600;
          width: 200px;
          color: #555;
        }
        .detail-value {
          flex: 1;
        }
        .timeline {
          background-color: #ebf5fb;
          border-radius: 6px;
          padding: 20px;
          margin: 20px 0;
        }
        .timeline h3 {
          margin-top: 0;
        }
        .step {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #d4e6f1;
        }
        .step:last-child {
          border-bottom: none;
        }
        .step-number {
          font-size: 20px;
          font-weight: bold;
          color: #3498db;
          margin-right: 10px;
          min-width: 30px;
        }
        .benefits {
          background-color: #e8f5e8;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #27ae60;
        }
        .benefits ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        .benefits li {
          margin-bottom: 5px;
        }
        .action-required {
          background-color: #fef9e7;
          border-radius: 6px;
          padding: 15px 20px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .action-required ol {
          padding-left: 20px;
          margin: 10px 0;
        }
        .action-required li {
          margin-bottom: 5px;
        }
        .reminder-info {
          background-color: #fff3cd;
          border-radius: 6px;
          padding: 15px;
          margin: 20px 0;
          border-left: 4px solid #f39c12;
        }
        .action-section {
          text-align: center;
          margin: 25px 0;
        }
        .cta-button {
          display: inline-block;
          background-color: #3498db;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: 600;
          margin: 5px;
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
          <p>You are receiving this email because you have submitted a KYC verification request on Bantuhive.</p>

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