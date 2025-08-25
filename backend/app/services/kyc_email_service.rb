# app/services/kyc_email_service.rb
class KycEmailService
  def self.send_submission_received_email(kyc:, recipient_email:, recipient_name:)
    kyc_type = kyc.kyc_type.humanize
    submission_date = kyc.created_at.strftime('%B %d, %Y')
    reference_number = kyc.reference

    subject = "Your #{kyc_type} KYC submission has been received"
    
    html_content = <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>KYC Submission Received</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
            .header { background-color: #2c3e50; padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .kyc-details { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #3498db; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: 600; width: 180px; color: #555; }
            .detail-value { flex: 1; }
            .footer { background-color: #f0f2f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e1e4e8; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #2c3e50; text-decoration: none; margin: 0 10px; font-weight: 500; }
            .company-address { font-size: 13px; color: #777; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>KYC Submission Received</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We've received your #{kyc_type} KYC submission and it's now under review.</p>
              <div class="kyc-details">
                <div class="detail-row">
                  <span class="detail-label">Reference Number:</span>
                  <span class="detail-value">#{reference_number}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Submission Date:</span>
                  <span class="detail-value">#{submission_date}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Document Type:</span>
                  <span class="detail-value">#{kyc.verification_type.humanize}</span>
                </div>
              </div>
              <p>Our team will review your submission within 1-3 business days.</p>
              <p>Thank you for your patience,<br><strong>The Bantuhive Compliance Team</strong></p>
            </div>
            <div class="footer">
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              <div class="company-address">IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana</div>
              <p><a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd.</a></p>
            </div>
          </div>
        </body>
      </html>
    HTML

    text_content = <<~TEXT
      Hello #{recipient_name},

      We've received your #{kyc_type} KYC submission (Reference: #{reference_number}) and it's now under review.

      Submission Details:
      - Date: #{submission_date}
      - Document Type: #{kyc.verification_type.humanize}

      Our team will review your submission within 1-3 business days.

      Thank you for your patience,
      The Bantuhive Compliance Team
    TEXT

    send_email(
      recipient_email: recipient_email,
      recipient_name: recipient_name,
      subject: subject,
      html_content: html_content,
      text_content: text_content,
      email_type: 'kyc_submission'
    )
  end

  def self.send_verification_approved_email(kyc:, recipient_email:, recipient_name:, verified_by_name:)
    kyc_type = kyc.kyc_type.humanize
    approval_date = kyc.verified_at.strftime('%B %d, %Y')
    reference_number = kyc.reference

    subject = "Your #{kyc_type} KYC has been approved"
    
    html_content = <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>KYC Approved</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
            .header { background-color: #27ae60; padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .kyc-details { background-color: #e8f5e8; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #27ae60; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: 600; width: 180px; color: #555; }
            .detail-value { flex: 1; }
            .footer { background-color: #f0f2f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e1e4e8; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #2c3e50; text-decoration: none; margin: 0 10px; font-weight: 500; }
            .company-address { font-size: 13px; color: #777; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>KYC Approved</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>We're pleased to inform you that your #{kyc_type} KYC has been <strong>approved</strong> by #{verified_by_name}.</p>
              <div class="kyc-details">
                <div class="detail-row">
                  <span class="detail-label">Reference Number:</span>
                  <span class="detail-value">#{reference_number}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Approval Date:</span>
                  <span class="detail-value">#{approval_date}</span>
                </div>
              </div>
              <p>Your account is now fully verified and you can access all platform features.</p>
              <p>Welcome aboard!<br><strong>The Bantuhive Team</strong></p>
            </div>
            <div class="footer">
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              <div class="company-address">IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana</div>
              <p><a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd.</a></p>
            </div>
          </div>
        </body>
      </html>
    HTML

    text_content = <<~TEXT
      Hello #{recipient_name},

      Your #{kyc_type} KYC (Reference: #{reference_number}) has been approved by #{verified_by_name} on #{approval_date}.

      Your account is now fully verified and you can access all platform features.

      Welcome aboard!
      The Bantuhive Team
    TEXT

    send_email(
      recipient_email: recipient_email,
      recipient_name: recipient_name,
      subject: subject,
      html_content: html_content,
      text_content: text_content,
      email_type: 'kyc_approval'
    )
  end

  def self.send_verification_rejected_email(kyc:, recipient_email:, recipient_name:, rejected_by_name:, rejection_reason:)
    kyc_type = kyc.kyc_type.humanize
    reference_number = kyc.reference

    subject = "Your #{kyc_type} KYC requires updates"
    
    html_content = <<~HTML
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width">
          <title>KYC Update Required</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; margin: 0; padding: 0; }
            .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); }
            .header { background-color: #e74c3c; padding: 30px 20px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
            .content { padding: 30px; }
            .greeting { font-size: 18px; margin-bottom: 20px; }
            .kyc-details { background-color: #fdecea; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #e74c3c; }
            .detail-row { display: flex; margin-bottom: 10px; }
            .detail-label { font-weight: 600; width: 180px; color: #555; }
            .detail-value { flex: 1; }
            .footer { background-color: #f0f2f5; padding: 20px; text-align: center; font-size: 14px; color: #666; border-top: 1px solid #e1e4e8; }
            .social-links { margin: 15px 0; }
            .social-links a { color: #2c3e50; text-decoration: none; margin: 0 10px; font-weight: 500; }
            .company-address { font-size: 13px; color: #777; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>KYC Update Required</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello #{recipient_name},</p>
              <p>After reviewing your #{kyc_type} KYC submission, we need some additional information to complete the verification process.</p>
              <div class="kyc-details">
                <div class="detail-row">
                  <span class="detail-label">Reference Number:</span>
                  <span class="detail-value">#{reference_number}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reviewed By:</span>
                  <span class="detail-value">#{rejected_by_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Reason:</span>
                  <span class="detail-value">#{rejection_reason}</span>
                </div>
              </div>
              <p>Please log in to your account to review the requirements and submit the requested information.</p>
              <p>Thank you for your cooperation,<br><strong>The Bantuhive Compliance Team</strong></p>
            </div>
            <div class="footer">
              <div class="social-links">
                <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
              </div>
              <div class="company-address">IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana</div>
              <p><a href="https://bantuhive.com">© #{Time.current.year} Bantuhive Ltd.</a></p>
            </div>
          </div>
        </body>
      </html>
    HTML

    text_content = <<~TEXT
      Hello #{recipient_name},

      Your #{kyc_type} KYC (Reference: #{reference_number}) requires updates:

      Reason: #{rejection_reason}
      Reviewed By: #{rejected_by_name}

      Please log in to your account to submit the requested information.

      Thank you for your cooperation,
      The Bantuhive Compliance Team
    TEXT

    send_email(
      recipient_email: recipient_email,
      recipient_name: recipient_name,
      subject: subject,
      html_content: html_content,
      text_content: text_content,
      email_type: 'kyc_rejection'
    )
  end

  private

  def self.send_email(recipient_email:, recipient_name:, subject:, html_content:, text_content:, email_type:)
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [{
        email: recipient_email,
        name: recipient_name
      }],
      subject: subject,
      htmlContent: html_content,
      textContent: text_content,
      sender: {
        name: 'Bantuhive Compliance',
        email: 'compliance@bantuhive.com'
      },
      headers: {
        'X-Mailin-custom' => email_type
      }
    )

    begin
      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
      response = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "KYC email (#{email_type}) sent to #{recipient_email}"
      response
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Failed to send KYC email (#{email_type}): #{e.message}"
      Rails.logger.error "Response: #{e.response_body}" if e.response_body
      false
    end
  end
end