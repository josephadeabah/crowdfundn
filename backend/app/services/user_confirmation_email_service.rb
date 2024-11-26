# app/services/user_confirmation_email_service.rb
class UserConfirmationEmailService
    def self.send_confirmation_email(user, host)
    confirmation_url = "#{host}/auth/confirm_email/#{user.confirmation_token}"
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
                      <!-- Footer -->
          <div style="background-color: orange; padding: 20px; margin-top: 20px; color: black; text-align: center;">
            <p style="margin: 0; font-size: 14px; font-weight: bold;">Follow Us</p>
            <p style="margin: 5px 0;">
            <a href="https://facebook.com/yourpage" style="color: black; text-decoration: none; margin: 0 10px;">Facebook</a> | 
            <a href="https://twitter.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Twitter</a> | 
            <a href="https://instagram.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Instagram</a> | 
            <a href="https://linkedin.com/yourpage" style="color: black; text-decoration: none; margin: 0 10px;">LinkedIn</a>
            </p>
            <hr style="border: none; height: 1px; background-color: black; margin: 10px 0;">
            <p style="font-size: 12px; margin: 0;">
              IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana. <br>
            <a href="https://bantuhive.com" style="color: black;">© 2024 BantuHive Ltd</a>
            </p>
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
  