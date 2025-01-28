class FundraiserDonationNotificationService
    def self.send_notification_email(donation)
      fundraiser_email = donation.campaign.fundraiser.email
      fundraiser_name = donation.campaign.fundraiser.full_name
      donor_name = donation.full_name.blank? ? 'Anonymous Donor' : donation.full_name
      campaign_name = donation.campaign.title
      transaction_amount = donation.gross_amount.to_f
      transaction_date = donation.created_at.strftime('%B %d, %Y')
      currency_symbol = donation.campaign.currency_symbol || 'GHS'

  
      redirect_url = donation.metadata['redirect_url']
  
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [
          {
            'email' => fundraiser_email,
            'name' => fundraiser_name
          }
        ],
        template_id: 2, # Replace with your actual template ID for fundraiser notifications
        params: {
          'fundraiser_name' => fundraiser_name,
          'donor_name' => donor_name,
          'campaign_name' => campaign_name,
          'amount' => "#{currency_symbol} #{transaction_amount}",
          'date' => transaction_date,
          'redirect_url' => redirect_url
        },
        sender: {
          'name' => 'Bantuhive Ltd',
          'email' => 'help@bantuhive.com'
        },
        subject: "You've received a new donation for #{campaign_name}!",
        headers: {
          'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
          'charset' => 'iso-8859-1',
          'Content-Type' => 'text/html; charset=iso-8859-1',
          'Accept' => 'application/json'
        },
        htmlContent: <<~HTML
          <html>
          <body>
            <p>Hi #{fundraiser_name},</p>
            <p>Great news! <strong>#{donor_name}</strong> has just donated <strong>#{currency_symbol} #{transaction_amount}</strong> to your campaign "<strong>#{campaign_name}</strong>".</p>
            <p>This donation was made on <strong>#{transaction_date}</strong>.</p>
            <p>You can view your campaign and its progress here: <a href="#{redirect_url}">View Campaign</a></p>
            <br>
            <p>Thanks for being part of the Bantuhive community!</p>
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
        Rails.logger.info "Fundraiser notification email sent successfully: #{result}"
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Error sending fundraiser notification email: #{e}"
        Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      end
    end
end
  