# app/services/donation_confirmation_email_service.rb

class DonationConfirmationEmailService
    def self.send_confirmation_email(donation)
      user = donation.full_name
      email = donation.email
      campaign_name = donation.campaign.title
      fundraiser_name = donation.campaign.fundraiser.full_name
      transaction_reference = donation.transaction_reference
      transaction_amount = donation.gross_amount.to_f
      transaction_date = donation.created_at.strftime('%B %d, %Y')
      currency_symbol = donation.campaign.currency_symbol
  
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
                <p>Hello #{user}, Our Valued Backer!</p>
                <p>We deeply appreciate your generous donation of <strong>#{currency_symbol} #{transaction_amount}</strong> to support the <strong>#{campaign_name}</strong> campaign.</p>
                <p>Your contribution is making a difference for <strong>#{fundraiser_name}</strong> in achieving their goals.</p>
                <p>The transaction reference for your donation is: <strong>#{transaction_reference}</strong></p>
                <p>Date: <strong>#{transaction_date}</strong></p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br>
                <p>Thanks,</p>
                <p><strong>Bantuhive Team</strong></p>

                <!-- Footer -->
                <div style="background-color: orange; padding: 20px; margin-top: 20px; color: black; text-align: center;">
                    <p style="margin: 0; font-size: 14px; font-weight: bold;">Follow Us</p>
                    <p style="margin: 5px 0;">
                    <a href="https://web.facebook.com/profile.php?id=61568192851056" style="color: black; text-decoration: none; margin: 0 10px;">Facebook</a> | 
                    <a href="https://twitter.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Twitter</a> | 
                    <a href="https://www.instagram.com/bantuhive_fund/" style="color: black; text-decoration: none; margin: 0 10px;">Instagram</a> | 
                    <a href="https://www.linkedin.com/company/bantu-hive/about/" style="color: black; text-decoration: none; margin: 0 10px;">LinkedIn</a>
                    </p>
                    <hr style="border: none; height: 1px; background-color: black; margin: 10px 0;">
                    <p style="font-size: 12px; margin: 0;">
                     IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana. <br>
                    <a href="https://bantuhive.com" style="color: black;">© BantuHive Ltd 2024</a>
                    </p>
                </div>
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
  