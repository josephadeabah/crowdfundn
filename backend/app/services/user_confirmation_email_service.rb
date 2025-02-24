class UserConfirmationEmailService
  def self.send_confirmation_email(user, host)
    token = user.confirmation_token.presence || 'invalid-token-please-enter-your-email-to-resend'
    confirmation_url = "#{host}/auth/confirm_email/#{token}"
    email = user.email
    full_name = user.full_name.presence || "Anonymous"  # Default to 'Anonymous' if name is missing

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        { 'email' => email, 'name' => full_name }
      ],
      template_id: 2, # Replace with your actual template ID
      params: {
        'name' => full_name,
        'confirmation_url' => confirmation_url
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
                background-color: #f0faf0; /* Light green background */
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff; /* White background for content */
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #4CAF50; /* Green header */
                padding: 20px;
                text-align: center;
              }
              .header img {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                object-fit: cover;
              }
              .content {
                padding: 20px;
                color: #333333;
              }
              .content h1 {
                color: #4CAF50; /* Green heading */
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .footer {
                background-color: #f0faf0; /* Light green footer */
                padding: 15px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
              .footer a {
                color: #4CAF50; /* Green link */
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }    
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="header"></div>

              <!-- Content -->
              <div class="content">
                <h1>Hello, #{full_name}!</h1>
                <p>Thank you for signing up on Bantuhive! Please confirm your email address by clicking the link below:</p>
                <p><a href="#{confirmation_url}" style="color: #4CAF50; text-decoration: none;">Confirm My Email</a></p>
                <p>If you did not sign up for Bantuhive, please ignore this email.</p>
                <p>Warm Regards,</p>
                <p><strong>Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you signed up on Bantuhive.</p>
                <p>Sent from Bantuhive's Headquarters:</p>
                <p>IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana.</p>

                <!-- Social Media Links -->
                <div style="text-align: center; margin-top: 10px;">
                  <a href="https://web.facebook.com/profile.php?id=61568192851056" style="color: black; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">Facebook</a>
                  <a href="https://www.instagram.com/bantuhive_fund/" style="color: black; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">Instagram</a>
                  <a href="https://www.linkedin.com/company/bantu-hive/about/" style="color: black; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">LinkedIn</a>
                </div>

                <p><a href="https://bantuhive.com">© BantuHive Ltd 2024</a></p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Confirmation email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending confirmation email: #{e}"
    end
  end
end