# app/services/premium_subscription_email_service.rb
class PremiumSubscriptionEmailService
  def self.send_confirmation_email(user, subscription)
    email = user.email
    user_name = user.full_name
    plan_name = subscription.premium_plan.name
    plan_price = subscription.premium_plan.price
    currency = subscription.premium_plan.currency
    interval = subscription.premium_plan.interval
    start_date = subscription.start_date.strftime('%B %d, %Y')
    expires_at = subscription.expires_at.strftime('%B %d, %Y')

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user_name
        }
      ],
      template_id: 2, # Replace with your actual premium confirmation template ID
      params: {
        'name' => user_name,
        'plan_name' => plan_name,
        'plan_price' => plan_price,
        'currency' => currency,
        'interval' => interval,
        'start_date' => start_date,
        'expires_at' => expires_at
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: "Welcome to #{plan_name} Premium! 🎉",
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
                background-color: #f0f8ff; /* Light blue background for premium */
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
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* Premium gradient */
                padding: 30px;
                text-align: center;
                color: white;
              }
              .content {
                padding: 30px;
                color: #333333;
              }
              .content h1 {
                color: #667eea;
                font-size: 28px;
                margin-bottom: 20px;
                text-align: center;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 15px;
              }
              .plan-details {
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                padding: 20px;
                margin: 20px 0;
                border-radius: 5px;
              }
              .feature-list {
                margin: 20px 0;
              }
              .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 10px;
              }
              .feature-icon {
                color: #28a745;
                margin-right: 10px;
                font-weight: bold;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666666;
                border-top: 1px solid #e9ecef;
              }
              .footer a {
                color: #667eea;
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
                <h1>🎉 Welcome to Premium!</h1>
                <p>You're now part of our exclusive community</p>
              </div>

              <!-- Content -->
              <div class="content">
                <h1>Welcome to #{plan_name}, #{user_name}!</h1>
                
                <p>Thank you for upgrading to our #{plan_name} premium plan. Your support means the world to us and helps us continue providing exceptional service.</p>

                <div class="plan-details">
                  <h3>Your Plan Details:</h3>
                  <p><strong>Plan:</strong> #{plan_name}</p>
                  <p><strong>Price:</strong> #{currency} #{plan_price} per #{interval}</p>
                  <p><strong>Start Date:</strong> #{start_date}</p>
                  <p><strong>Next Billing:</strong> #{expires_at}</p>
                </div>

                <div class="feature-list">
                  <h3>What you get with #{plan_name}:</h3>
                  #{generate_feature_list(subscription.premium_plan.features)}
                </div>

                <p>You can manage your subscription anytime from your account settings.</p>

                <p>If you have any questions or need assistance, our support team is here to help!</p>

                <p>Welcome aboard,<br><strong>The Bantuhive Team</strong></p>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>You are receiving this email because you subscribed to a premium plan on Bantuhive.</p>
                <p>Sent from Bantuhive's Headquarters:</p>
                <p>IVY Street, Kingstel Hotel Avenue, Apollo, Takoradi, Ghana.</p>

                <!-- Social Media Links -->
                <div style="text-align: center; margin-top: 15px;">
                  <a href="https://web.facebook.com/profile.php?id=61568192851056" style="color: #667eea; text-decoration: none; padding: 8px 15px; margin: 0 5px; border: 1px solid #667eea; border-radius: 5px; transition: all 0.3s;">Facebook</a>
                  <a href="https://www.instagram.com/bantuhive_fund/" style="color: #667eea; text-decoration: none; padding: 8px 15px; margin: 0 5px; border: 1px solid #667eea; border-radius: 5px; transition: all 0.3s;">Instagram</a>
                  <a href="https://www.linkedin.com/company/bantu-hive/about/" style="color: #667eea; text-decoration: none; padding: 8px 15px; margin: 0 5px; border: 1px solid #667eea; border-radius: 5px; transition: all 0.3s;">LinkedIn</a>
                </div>

                <p style="margin-top: 20px;"><a href="https://bantuhive.com">© BantuHive Ltd 2024</a></p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Premium subscription confirmation email sent successfully to #{email}: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending premium confirmation email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end

  def self.send_cancellation_email(user, subscription)
    email = user.email
    user_name = user.full_name
    plan_name = subscription.premium_plan.name
    expires_at = subscription.expires_at.strftime('%B %d, %Y')

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user_name
        }
      ],
      template_id: 3, # Replace with your actual cancellation template ID
      params: {
        'name' => user_name,
        'plan_name' => plan_name,
        'expires_at' => expires_at
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: "Your #{plan_name} Subscription Has Been Cancelled",
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
                background-color: #fff5f5;
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
                background-color: #f8d7da;
                padding: 30px;
                text-align: center;
                color: #721c24;
              }
              .content {
                padding: 30px;
                color: #333333;
              }
              .content h1 {
                color: #dc3545;
                font-size: 28px;
                margin-bottom: 20px;
                text-align: center;
              }
              .content p {
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 15px;
              }
              .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #666666;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Subscription Cancelled</h1>
              </div>

              <div class="content">
                <h1>Goodbye, #{user_name} 😢</h1>
                
                <p>Your #{plan_name} subscription has been successfully cancelled.</p>
                
                <p>You will continue to have access to premium features until #{expires_at}.</p>
                
                <p>We're sorry to see you go. If you changed your mind or have any feedback, we'd love to hear from you.</p>
                
                <p>Thank you for being part of our community.</p>
                
                <p>Best regards,<br><strong>The Bantuhive Team</strong></p>
              </div>

              <div class="footer">
                <p>© BantuHive Ltd 2024</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Premium subscription cancellation email sent successfully to #{email}: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending premium cancellation email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end

  def self.send_payment_success_email(user, subscription, transaction_data)
    email = user.email
    user_name = user.full_name
    plan_name = subscription.premium_plan.name
    amount = transaction_data[:amount].to_f / 100
    currency = transaction_data[:currency]
    reference = transaction_data[:reference]

    send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          'email' => email,
          'name' => user_name
        }
      ],
      template_id: 4, # Replace with your actual payment success template ID
      params: {
        'name' => user_name,
        'plan_name' => plan_name,
        'amount' => amount,
        'currency' => currency,
        'reference' => reference
      },
      sender: {
        'name' => 'Bantuhive Ltd',
        'email' => 'help@bantuhive.com'
      },
      subject: "Payment Successful - #{plan_name} Plan",
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
              body { font-family: Arial, sans-serif; background-color: #f0f8ff; margin: 0; padding: 0; }
              .email-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); }
              .header { background-color: #28a745; padding: 30px; text-align: center; color: white; }
              .content { padding: 30px; color: #333333; }
              .content h1 { color: #28a745; font-size: 28px; margin-bottom: 20px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="email-container">
              <div class="header">
                <h1>Payment Successful! ✅</h1>
              </div>
              <div class="content">
                <h1>Thank you for your payment, #{user_name}!</h1>
                <p>Your #{plan_name} subscription payment of #{currency} #{amount} was processed successfully.</p>
                <p>Reference: #{reference}</p>
                <p>Best regards,<br>The Bantuhive Team</p>
              </div>
            </div>
          </body>
        </html>
      HTML
    )

    api_instance = SibApiV3Sdk::TransactionalEmailsApi.new

    begin
      result = api_instance.send_transac_email(send_smtp_email)
      Rails.logger.info "Premium payment success email sent successfully to #{email}: #{result}"
    rescue SibApiV3Sdk::ApiError => e
      Rails.logger.error "Error sending premium payment success email: #{e}"
      Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
    end
  end

  private

  def self.generate_feature_list(features)
    html = ''
    features.each do |feature_name, feature_value|
      if feature_value == true
        html += <<~HTML
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>#{feature_name}</span>
          </div>
        HTML
      elsif feature_value.is_a?(String)
        html += <<~HTML
          <div class="feature-item">
            <span class="feature-icon">✓</span>
            <span>#{feature_name}: #{feature_value}</span>
          </div>
        HTML
      end
    end
    html
  end
end