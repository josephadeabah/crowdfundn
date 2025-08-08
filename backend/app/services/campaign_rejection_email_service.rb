class CampaignRejectionEmailService
  def self.send_rejection_email(campaign, rejection_reason)
    fundraiser = campaign.fundraiser
    fundraiser_name = fundraiser.full_name
    fundraiser_email = fundraiser.email
    campaign_name = campaign.title
    rejection_date = Time.current.strftime('%B %d, %Y')

    # Generate a secure random UUID and create the edit URL
    secure_random_uuid = SecureRandom.uuid
    campaign_identifier = campaign.slug || campaign.id
    edit_url = Rails.application.routes.url_helpers.campaign_url(
      campaign_identifier,
      host: 'bantuhive.com',
      params: { token: secure_random_uuid }
    )

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => fundraiser_email,
          'name' => fundraiser_name
        }
      ],
      template_id: 1, # Keep your current template ID
      params: {
        'name' => fundraiser_name,
        'campaign_name' => campaign_name,
        'rejection_reason' => rejection_reason
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: "Your campaign '#{campaign_name}' requires changes",
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
                background-color: #f0f0f0;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .header {
                background-color: #f44336; /* Red header for rejection */
                padding: 20px;
                text-align: center;
                color: white;
              }
              .content {
                padding: 20px;
                color: #333333;
              }
              .content h1 {
                color: #f44336; /* Red heading */
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .reason-box {
                background-color: #fff8f8;
                border-left: 4px solid #f44336;
                padding: 15px;
                margin: 20px 0;
              }
              .footer {
                background-color: #f0faf0;
                padding: 15px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
              .footer a {
                color: #4CAF50;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
              .action-button {
                display: inline-block;
                background-color: #f44336;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 15px;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="header">
                <h1>Campaign Review Update</h1>
              </div>

              <!-- Content -->
              <div class="content">
                <p>Dear #{fundraiser_name},</p>
                <p>We regret to inform you that your campaign <strong>#{campaign_name}</strong> has not been approved at this time.</p>
                
                <div class="reason-box">
                  <h3>Reason for Rejection:</h3>
                  <p>#{rejection_reason}</p>
                </div>

                <p>Please review the feedback above and make the necessary changes to your campaign. Once you've addressed these issues, you can resubmit your campaign for review.</p>
                
                <p><strong>Next Steps:</strong></p>
                <ol>
                  <li>Log in to your Bantuhive account</li>
                  <li>Edit your campaign to address the issues mentioned</li>
                  <li>Resubmit your campaign for review</li>
                </ol>

                <a href="#{edit_url}" class="action-button" style="background-color: green; text-color: white;">Edit Your Campaign</a>

                <p>If you have any questions about the feedback or need assistance with your campaign, please don't hesitate to reply to this email.</p>
                
                <p>Thank you for using Bantuhive!</p>
                <p><strong>The Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you created a campaign on Bantuhive.</p>
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
      Rails.logger.info "Campaign rejection email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending rejection email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end
end