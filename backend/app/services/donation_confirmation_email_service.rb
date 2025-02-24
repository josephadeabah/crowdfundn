class DonationConfirmationEmailService
  def self.send_confirmation_email(donation)
    user = donation.full_name
    email = donation.email
    campaign_name = donation.campaign.title
    fundraiser_name = donation.campaign.fundraiser.full_name
    transaction_reference = donation.transaction_reference
    transaction_amount = donation.gross_amount.to_f
    transaction_date = donation.created_at.strftime('%B %d, %Y')
    currency_symbol = donation.campaign.currency_symbol || 'GHS'

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user
        }
      ],
      template_id: 1, # Keep your current template ID
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
              <div class="header">
                <!-- Optionally add an avatar image or logo here -->
              </div>

              <!-- Content -->
              <div class="content">
                <h1>Thank You for Your Donation!</h1>
                <p>Dear #{user},</p>
                <p>Thank you so much for your generous donation of <strong>#{currency_symbol} #{transaction_amount}</strong> to the <strong>#{campaign_name}</strong> campaign.</p>
                <p>Your contribution is helping <strong>#{fundraiser_name}</strong> in their efforts to achieve their goals. We truly appreciate your support!</p>
                <p><strong>Transaction Details:</strong></p>
                <ul>
                  <li><strong>Transaction Reference:</strong> #{transaction_reference}</li>
                  <li><strong>Date:</strong> #{transaction_date}</li>
                </ul>
                <p>If you have any questions, feel free to reply to this email.</p>
                <br>
                <p>Thanks again for your generosity!</p>
                <p><strong>Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you made a donation through Bantu Hive.</p>
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
      Rails.logger.info "Donation confirmation email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending confirmation email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end
