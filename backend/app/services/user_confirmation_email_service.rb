# app/services/user_confirmation_email_service.rb
class UserConfirmationEmailService
    def self.send_confirmation_email(user, host)
    confirmation_url = "#{host}/confirm-email?token=#{user.confirmation_token}"
      email = user.email
      full_name = user.full_name
  
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
        subject: "Confirm Your Email for Bantuhive",
        htmlContent: <<~HTML
          <html>
          <body>
            <p>Hello #{full_name},</p>
            <p>Thank you for signing up on Bantuhive! Please confirm your email address by clicking the link below:</p>
            <p><a href="#{confirmation_url}" style="color: blue;">Confirm My Email</a></p>
            <p>If you did not sign up for Bantuhive, please ignore this email.</p>
            <br>
            <p>Warm Regards,</p>
            <p><strong>Bantuhive Team</strong></p>
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
  