# app/services/donation_confirmation_email_service.rb

class DonationConfirmationEmailService
    def self.send_confirmation_email(donation)
      user = donation.full_name
      email = donation.email
      campaign_name = donation.campaign.title
  
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [
          {
            'email' => email,
            'name' => user
          }
        ],
        template_id: 1, # Replace with your actual template ID
        params: {
          'name' => donation.full_name,
          'amount' => donation.amount,
          'campaign_name' => campaign_name
        },
        sender: {
          'name' => 'Bantuhive Ltd',
          'email' => 'help@bantuhive.com'
        },
        subject: 'Thank you for your donation',
        headers: {
          'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3',
          'charset' => 'iso-8859-1',
          'Content-Type' => 'text/html; charset=iso-8859-1',
          'Accept' => 'application/json'
        },
        htmlContent: <<~HTML
          <html>
            <body>
              <h1>Thank You for Your Donation!</h1>
              <p>Dear #{user},</p>
              <p>We deeply appreciate your generous donation of <strong>#{donation.campaign.currency_symbol} #{donation.amount}</strong> to support the <strong>#{campaign_name}</strong> campaign.</p>
              <p>Your contribution is making a difference in achieving our goals.</p>
              <p>If you have any questions, feel free to reply to this email.</p>
              <br>
              <p>Best Regards,</p>
              <p><strong>The Bantuhive Team</strong></p>
            </body>
          </html>
        HTML
      )
  
      api_instance = SibApiV3Sdk::TransactionalEmailsApi.new
  
      begin
        result = api_instance.send_transac_email(send_smtp_email)
        Rails.logger.info "Donation confirmation email sent successfully: #{result}"
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Error sending confirmation email: #{e}"
        Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      end
    end
end
  