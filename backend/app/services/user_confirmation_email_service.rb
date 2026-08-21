# app/services/user_confirmation_email_service.rb
class UserConfirmationEmailService
  def self.send_confirmation_email(user, host)
    # Ensure we have a valid token
    if user.confirmation_token.blank?
      UserConfirmationService.generate_confirmation_token(user)
      user.reload
    end
    
    # Build the confirmation URL
    confirmation_url = "#{host}/confirm-email?token=#{user.confirmation_token}"
    
    email = user.email
    full_name = user.full_name.presence || 'User'

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        { 'email' => email, 'name' => full_name }
      ],
      template_id: 2,
      params: {
        'name' => full_name,
        'confirmation_url' => confirmation_url,
        'token' => user.confirmation_token
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: 'Confirm Your Email for Bantuhive',
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0faf0;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4CAF50;
                padding: 20px;
                text-align: center;
              }
              .content {
                padding: 20px;
                color: #333333;
              }
              .content h1 {
                color: #4CAF50;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
              }
              .button:hover {
                background-color: #45a049;
              }
              .footer {
                background-color: #f0faf0;
                padding: 15px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
              .footer a {
                color: #4CAF50;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header"></div>
              <div class="content">
                <h1>Hello, #{full_name}!</h1>
                <p>Thank you for signing up on Bantuhive! Please confirm your email address by clicking the button below:</p>
                <p style="text-align: center;">
                  <a href="#{confirmation_url}" class="button">Confirm My Email</a>
                </p>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 5px; font-size: 12px;">#{confirmation_url}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not sign up for Bantuhive, please ignore this email.</p>
                <p>Warm Regards,<br><strong>Bantuhive Team</strong></p>
              </div>
              <div class="footer">
                <p>You are receiving this email because you signed up on Bantuhive.</p>
                <p>Sent from Bantuhive's Headquarters: 27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.</p>
                <p><a href="https://bantuhive.com">© BantuHive Ltd 2025</a></p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Confirmation email sent successfully to #{email}: #{result}"
      result
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending confirmation email: #{e.message}"
      raise
    end
  end
end