# app/services/thank_you_email_service.rb

class ThankYouEmailService
  def self.send_thank_you_email(donor_email, donor_name, fundraiser_name, fundraiser_avatar, campaign_title, currency, amount)
    # Prepare the email content
    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => donor_email,
          'name' => donor_name
        }
      ],
      template_id: 2, # Use a specific template ID for thank you emails
      params: { 'campaign_title' => campaign_title, 'donor_name' => donor_name, 'amount' => amount },
      sender: {
        'name' => 'Bantu Hive Ltd.',
        'email' => 'help@bantuhive.com'
      },
      subject: "Thank You for Supporting My #{campaign_title}",
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
                width: 20px;
                height: 20px;
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

              /* Social Media Links Flexbox */
              .social-media {
                display: flex;
                justify-content: center;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 10px;
              }
              .social-media a {
                color: black;
                text-decoration: none;
                padding: 5px 10px;
                transition: color 0.3s;
              }
              .social-media a:hover {
                color: #4CAF50;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header with dynamic fundraiser avatar -->
              <div class="header">
                <img src="#{fundraiser_avatar}" alt="Thank You" />
              </div>

              <!-- Content -->
              <div class="content">
                <h1>Thank You, #{donor_name}!</h1>
                <p>We are incredibly grateful for your generous donation of <strong>#{currency} #{amount}</strong> to the campaign <strong>#{campaign_title}</strong>.</p>
                <p>Your support is helping us make a real difference, and we couldn't do it without you. Together, we are one step closer to achieving our goals.</p>
                <p>With heartfelt gratitude,</p>
                <p><strong>#{fundraiser_name}</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you made a donation on Bantu Hive.</p>
                <p>Sent from Bantu Hive's Headquarters:</p>
                <p>IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana.</p>

                <!-- Social Media Links -->
                <div class="social-media">
                  <a href="https://web.facebook.com/profile.php?id=61568192851056">Facebook</a>
                  <a href="https://twitter.com/yourprofile">Twitter</a>
                  <a href="https://www.instagram.com/bantuhive_fund/">Instagram</a>
                  <a href="https://www.linkedin.com/company/bantu-hive/about/">LinkedIn</a>
                </div>

                <p><a href="https://bantuhive.com">© BantuHive Ltd 2024</a></p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    # Send the email using the Sendinblue API
    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Thank you email sent successfully to #{donor_email}: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending thank you email to #{donor_email}: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end