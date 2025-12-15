class ReportMailerService
  def self.send_report_resolved_email(report)
    return unless report.resolved? && report.reporter.email.present?

    user = report.reporter.full_name
    email = report.reporter.email
    report_type = report.report_type.humanize
    report_target = report.report_target_name
    action_taken = report.action_taken || "appropriate action"
    resolution_notes = report.resolution_notes || "The issue has been addressed."
    resolved_date = report.resolved_at.strftime('%B %d, %Y')

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user
        }
      ],
      template_id: 1, # Use your appropriate template ID
      params: {
        'name' => user,
        'report_type' => report_type,
        'report_target' => report_target,
        'action_taken' => action_taken
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: 'Your report has been resolved',
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
              .report-details {
                background-color: #f9f9f9;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
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
                <h1>Your Report Has Been Resolved</h1>
                <p>Dear #{user},</p>
                <p>Thank you for helping us keep our platform safe. Your report has been reviewed and resolved.</p>
                
                <div class="report-details">
                  <p><strong>Report Details:</strong></p>
                  <ul>
                    <li><strong>Report Type:</strong> #{report_type}</li>
                    <li><strong>Target:</strong> #{report_target}</li>
                    <li><strong>Action Taken:</strong> #{action_taken}</li>
                    <li><strong>Resolved Date:</strong> #{resolved_date}</li>
                  </ul>
                </div>

                <p><strong>Resolution Notes:</strong></p>
                <p>#{resolution_notes}</p>

                <p>We appreciate you taking the time to report this issue. Your vigilance helps us maintain a trustworthy environment for all users.</p>

                <p>If you have any questions about this resolution, please don't hesitate to contact us.</p>
                <br>
                <p>Thank you for your cooperation,</p>
                <p><strong>Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you submitted a report on BantuHive.</p>
                <p>Sent from Bantuhive's Headquarters:</p>
                <p>27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.</p>

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
      Rails.logger.info "Report resolved email sent successfully: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending report resolved email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end

  def self.send_new_report_notification_to_admins(report)
    # Find all admin users
    admin_users = User.joins(:roles).where(roles: { name: 'Admin' })
    
    admin_users.each do |admin|
      next unless admin.email.present?

      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [
          {
            'email' => admin.email,
            'name' => admin.full_name
          }
        ],
        template_id: 1, # Use your appropriate template ID
        params: {
          'name' => admin.full_name,
          'report_type' => report.report_type.humanize,
          'reporter_name' => report.reporter.full_name,
          'report_target' => report.report_target_name
        },
        sender: {
          'name' => 'Bantuhive Ltd',
          'email' => 'help@bantuhive.com'
        },
        subject: 'New Report Submitted - Requires Review',
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
                  background-color: #FF9800; /* Orange header for admin alerts */
                  padding: 20px;
                  text-align: center;
                  color: white;
                }
                .content {
                  padding: 20px;
                  color: #333333;
                }
                .content h1 {
                  color: #FF9800; /* Orange heading */
                  font-size: 24px;
                  margin-bottom: 20px;
                }
                .content p {
                  font-size: 16px;
                  line-height: 1.6;
                  margin-bottom: 20px;
                }
                .report-details {
                  background-color: #fff3e0; /* Light orange background */
                  padding: 15px;
                  border-radius: 5px;
                  margin: 20px 0;
                  border-left: 4px solid #FF9800;
                }
                .action-button {
                  display: inline-block;
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 5px;
                  margin-top: 10px;
                }
                .footer {
                  background-color: #f0faf0; /* Light green footer */
                  padding: 15px;
                  text-align: center;
                  font-size: 14px;
                  color: #666666;
                }
              </style>
            </head>
            <body>
              <div class="email-container">
                <!-- Header -->
                <div class="header">
                  <h2>New Report Alert</h2>
                </div>

                <!-- Content -->
                <div class="content">
                  <h1>New Report Requires Your Attention</h1>
                  <p>Dear #{admin.full_name},</p>
                  <p>A new report has been submitted and requires review.</p>
                  
                  <div class="report-details">
                    <p><strong>Report Details:</strong></p>
                    <ul>
                      <li><strong>Report ID:</strong> ##{report.id}</li>
                      <li><strong>Type:</strong> #{report.report_type.humanize}</li>
                      <li><strong>Submitted By:</strong> #{report.reporter.full_name}</li>
                      <li><strong>Target:</strong> #{report.report_target_name}</li>
                      <li><strong>Priority:</strong> #{report.priority.humanize}</li>
                      <li><strong>Submitted:</strong> #{report.created_at.strftime('%B %d, %Y at %H:%M')}</li>
                    </ul>
                  </div>

                  <p><strong>Description:</strong></p>
                  <p>#{report.description.truncate(200)}</p>

                  <p>Please review this report promptly and take appropriate action.</p>

                  <a href="#{Rails.application.routes.url_helpers.admin_reports_url}/#{report.id}" class="action-button">
                    Review Report
                  </a>

                  <br><br>
                  <p>Thank you for your attention to this matter.</p>
                  <p><strong>Bantuhive Team</strong></p>
                </div>

                <!-- Footer -->
                <div class="footer">
                  <p>This is an automated notification from Bantu Hive's reporting system.</p>
                  <p>Sent from Bantuhive's Headquarters:</p>
                  <p>27 Independence Avenue, Synergy Office Space, Takoradi Mall, Gate 2, Takoradi, Ghana.</p>

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
        Rails.logger.info "New report notification sent to admin #{admin.email}: #{result}"
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Error sending new report notification to admin #{admin.email}: #{e}"
        Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      end
    end
  end
end