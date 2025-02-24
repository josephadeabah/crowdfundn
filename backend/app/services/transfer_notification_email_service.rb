class TransferNotificationEmailService
  def self.send_notification_email(transfer)
    user = transfer.user_name
    email = transfer.email
    campaign_name = transfer.campaign&.title || 'Your campaign'
    transaction_reference = transfer.reference
    transaction_amount = transfer.amount.to_f
    transaction_date = transfer.completed_at&.strftime('%B %d, %Y') || 'N/A'
    currency_symbol = transfer.currency

    case transfer.status
    when 'success'
      subject = 'Your transfer was successful!'
      body = <<~HTML
        <p>Hello #{user},</p>
        <p>We are pleased to inform you that your transfer of <strong>#{currency_symbol} #{transaction_amount}</strong> has been successfully initiated. It may take a while to reflect in your settlement bank.</p>
        <p>The transaction reference for your transfer is: <strong>#{transaction_reference}</strong>.</p>
        <p>Date: <strong>#{transaction_date}</strong>.</p>
        <p>Thank you for using Bantuhive!</p>
      HTML
    when 'reversed'
      subject = 'Your transfer has been reversed.'
      body = <<~HTML
        <p>Hello #{user},</p>
        <p>We regret to inform you that your transfer of <strong>#{currency_symbol} #{transaction_amount}</strong> has been reversed.</p>
        <p>The transaction reference for your transfer is: <strong>#{transaction_reference}</strong>.</p>
        <p>If you have any questions, please contact us.</p>
      HTML
    when 'failed'
      subject = 'Your transfer failed.'
      body = <<~HTML
        <p>Hello #{user},</p>
        <p>We regret to inform you that your transfer of <strong>#{currency_symbol} #{transaction_amount}</strong> has failed.</p>
        <p>The transaction reference for your transfer is: <strong>#{transaction_reference}</strong>.</p>
        <p>Please contact us for further assistance.</p>
      HTML
    else
      Rails.logger.warn "Unknown transfer status: #{transfer.status}"
      return
    end

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user
        }
      ],
      template_id: 1, # Replace with your actual template ID
      params: {
        'name' => user,
        'amount' => transaction_amount,
        'campaign_name' => campaign_name
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: subject,
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
                <h1>#{subject}</h1>
                #{body}
                <p>Warm Regards,</p>
                <p><strong>Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you initiated a transfer on Bantuhive.</p>
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
      Rails.logger.info "Transfer notification email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending transfer notification email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end