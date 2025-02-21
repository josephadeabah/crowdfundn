# app/services/fundraiser_contact_email_service.rb

class FundraiserContactEmailService
  def self.send_contact_email(fundraiser_email, fundraiser_name, user_name, user_email, message)
    # Prepare the email content
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => fundraiser_email,
          'name' => fundraiser_name
        }
      ],
      template_id: 2,
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: 'New Message from a Supporter',
      headers: {
        'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3',
        'charset' => 'iso-8859-1',
        'Content-Type' => 'text/html; charset=iso-8859-1',
        'Accept' => 'application/json'
      },
      htmlContent: <<~HTML
        <html>
          <body>
            <p><strong>To respond directly to this message, simply click the 'Reply' button.</strong></p>
            <br>
            <p><strong>To:</strong> #{fundraiser_name}</p>
            <p><strong>From:</strong> #{user_email}</p>
            <br>
            <p><strong>Sent from:</strong> Bantu Hive</p>
            <br>
            <p><strong>PLEASE NOTE:</strong> The message below is NOT from Bantu Hive, but rather an individual who visited and contacted you through your campaign. We strongly discourage you from clicking links or sharing your personal information without first verifying the sender's identity. Bantu Hive will never ask for your email address, password, or payment information in this manner. Do not respond if you are being offered a wire transfer or asked for a refund outside of Bantu Hive. Please forward all suspicious messages to <a href="mailto:help@bantuhive.com">help@bantuhive.com</a>.</p>
            <br>
            <p><strong>** MESSAGE **</strong></p>
            <p>#{message}</p>
            <p><strong>** END OF MESSAGE **</strong></p>
            <br>
            <p>Is this message abusive? Please forward all suspicious messages to <a href="mailto:help@bantuhive.com">help@bantuhive.com</a>.</p>
            <br>
            <hr>
            <p>You are receiving this email because you have a Bantu Hive account.</p>
            <p>Sent from Bantu Hive's Headquarters:</p>
            <p>IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana.</p>
            <p><a href="https://bantuhive.com">© BantuHive Ltd 2024</a></p>
          </body>
        </html>
      HTML
    )

    # Send the email using the Sendinblue API
    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Fundraiser contact email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending fundraiser contact email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end