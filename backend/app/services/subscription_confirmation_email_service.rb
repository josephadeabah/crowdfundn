class SubscriptionConfirmationEmailService
  def self.send_confirmation_email(subscription)
    email = subscription.email
    subscription_code = subscription.subscription_code
    subscriber_name = subscription.subscriber_name
    fundraiser_name = subscription.campaign.fundraiser.full_name
    currency_symbol = subscription.campaign.currency_symbol
    campaign_name = subscription.campaign.title
    transaction_amount = subscription.amount.to_f
    transaction_date = subscription.next_payment_date.strftime('%B %d, %Y')
    interval = subscription.interval
    card_type = subscription.card_type
    last4 = subscription.last4

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => subscriber_name
        }
      ],
      template_id: 1, # Replace with your actual template ID
      params: {
        'name' => subscriber_name,
        'amount' => transaction_amount,
        'campaign_name' => campaign_name
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: "Your subscription to #{campaign_name} is now active [#{subscription_code}] 🎉",
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
              <div class="header"></div>

              <!-- Content -->
              <div class="content">
                <h1>Your subscription to #{campaign_name} is now active 🎉</h1>
                <p>Hello #{subscriber_name},</p>
                <p>You have subscribed to <strong>#{campaign_name}</strong> by <strong>#{fundraiser_name}</strong>.</p>
                <p>You will be charged <strong>#{currency_symbol} #{transaction_amount}</strong> every #{interval}.</p>
                <p>See details of your subscription below:</p>
                <ul>
                  <li>Next Charge Date: <strong>#{transaction_date}</strong></li>
                  <li>Card: <strong>#{card_type}</strong> ending with <strong>#{last4}</strong></li>
                </ul>
                <p>Thank you for supporting <strong>#{fundraiser_name}</strong> in achieving their goals!</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Warm Regards,</p>
                <p><strong>Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you subscribed to a campaign on Bantuhive.</p>
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
      Rails.logger.info "Subscription confirmation email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending subscription confirmation email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end