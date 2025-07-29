# app/mailers/investment_value_change_mailer.rb
class InvestmentValueChangeMailer < ApplicationMailer
  def self.send_notification_email(investment)
    user = investment.user.full_name
    email = investment.user.email
    campaign_name = investment.campaign.title
    investment_amount = investment.amount.to_f
    current_value = investment.current_value
    total_returns = investment.total_returns
    roi = investment.roi
    currency_symbol = investment.campaign.currency_symbol
    update_date = investment.updated_at.strftime('%B %d, %Y')

    subject = 'Your investment value has changed'
    body = <<~HTML
      <p>Hello #{user},</p>
      <p>We want to inform you about changes to your investment in <strong>#{campaign_name}</strong>.</p>
      
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Original Investment:</strong> #{currency_symbol}#{investment_amount.round(2)}</p>
        <p><strong>Current Value:</strong> #{currency_symbol}#{current_value.round(2)}</p>
        <p><strong>Total Returns:</strong> #{currency_symbol}#{total_returns.round(2)}</p>
        <p><strong>ROI:</strong> #{roi.round(2)}%</p>
      </div>
      
      <p>This update was calculated on <strong>#{update_date}</strong> based on the current valuation of <strong>#{campaign_name}</strong>.</p>
      <p>You can view more details in your <a href="#{Rails.application.routes.url_helpers.portfolio_url(host: 'bantuhive.com')}">investment portfolio</a>.</p>
    HTML

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user
        }
      ],
      template_id: 3, # Different template ID for investment notifications
      params: {
        'name' => user,
        'campaign_name' => campaign_name,
        'current_value' => current_value.round(2),
        'returns' => total_returns.round(2)
      },
      sender: {
        'name' => 'Bantuhive Investments',
        'email' => 'investments@bantuhive.com'
      },
      subject: subject,
      htmlContent: <<~HTML
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f0f2f5;
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
                background-color: #2c3e50;
                padding: 20px;
                text-align: center;
                color: white;
              }
              .content {
                padding: 20px;
                color: #333333;
              }
              .content h1 {
                color: #2c3e50;
                font-size: 24px;
                margin-bottom: 20px;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 20px;
              }
              .stats-box {
                background-color: #f8f9fa;
                padding: 15px;
                border-radius: 5px;
                margin: 15px 0;
                border-left: 4px solid #3498db;
              }
              .footer {
                background-color: #f0f2f5;
                padding: 15px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
              .footer a {
                color: #3498db;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #3498db;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 0;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <!-- Header -->
              <div class="header">
                <h1>Investment Update</h1>
              </div>

              <!-- Content -->
              <div class="content">
                #{body}
                <a href="#{Rails.application.routes.url_helpers.portfolio_url(host: 'bantuhive.com')}" class="button">View Your Portfolio</a>
                <p>Warm Regards,</p>
                <p><strong>Bantuhive Investments Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you have an active investment with Bantuhive.</p>
                <p>Sent from Bantuhive's Investments Division:</p>
                <p>IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana.</p>

                <!-- Social Media Links -->
                <div style="text-align: center; margin-top: 10px;">
                  <a href="https://web.facebook.com/profile.php?id=61568192851056" style="color: #2c3e50; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">Facebook</a>
                  <a href="https://www.instagram.com/bantuhive_fund/" style="color: #2c3e50; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">Instagram</a>
                  <a href="https://www.linkedin.com/company/bantu-hive/about/" style="color: #2c3e50; text-decoration: none; padding: 5px 10px; transition: color 0.3s;">LinkedIn</a>
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
      Rails.logger.info "Investment value change email sent successfully to #{email}: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending investment notification email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      raise e if Rails.env.development?
    end
  end
end