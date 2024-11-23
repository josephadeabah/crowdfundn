# app/services/subscription_confirmation_email_service.rb

class SubscriptionConfirmationEmailService
    def self.send_confirmation_email(subscription)
      email = subscription.email
    #   subscriber_name = subscription.dig(:customer, :first_name)
      fundraiser_name = subscription.campaign.fundraiser.full_name
      currency_symbol = subscription.campaign.currency_symbol
      campaign_name = subscription.campaign.title
      transaction_reference = subscription.subscription_code
      transaction_amount = subscription.amount.to_f
      transaction_date = subscription.created_at.strftime('%B %d, %Y')
      interval = subscription.interval
      card_type = subscription.card_type
      last4 = subscription.last4
  
      send_smtp_email = SibApiV3Sdk::SendSmtpEmail.new(
        to: [
          {
            'email' => email,
            'name' => 'Donor Name'
          }
        ],
        template_id: 1, # Replace with your actual template ID
        params: {
          'name' => 'Donor Name',
          'amount' => transaction_amount,
          'campaign_name' => campaign_name
        },
        sender: {
          'name' => 'Bantuhive Ltd',
          'email' => 'help@bantuhive.com'
        },
        subject: "Your subscription to #{campaign_name} is now active",
        headers: {
          'X-Mailin-custom' => 'custom_header_1:custom_value_1|custom_header_2:custom_value_2|custom_header_3:custom_value_3',
          'charset' => 'iso-8859-1',
          'Content-Type' => 'text/html; charset=iso-8859-1',
          'Accept' => 'application/json'
        },
        htmlContent: <<~HTML
          <html>
          <body>
            <p>Hello Backer,</p>
            <p>You have subscribed to <strong>Plan Name</strong>.</p>
            <p>You will be charged <strong>#{currency_symbol} #{transaction_amount}</strong> every #{interval}.</p>
            <p>See details of your subscription below:</p>
            <ul>
              <li>Transaction Reference: <strong>#{transaction_reference}</strong></li>
              <li>Next Charge Date: <strong>#{transaction_date}</strong></li>
              <li>Card: <strong>#{card_type}</strong> ending with <strong>#{last4}</strong></li>
            </ul>
            <p>Thank you for supporting <strong>#{fundraiser_name}</strong> in achieving their goals!</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <br>
            <p>Warm Regards,</p>
            <p><strong>Bantuhive Team</strong></p>
  
            <!-- Footer -->
            <div style="background-color: orange; padding: 20px; margin-top: 20px; color: black; text-align: center;">
              <p style="margin: 0; font-size: 14px; font-weight: bold;">Follow Us</p>
              <p style="margin: 5px 0;">
                <a href="https://facebook.com/yourpage" style="color: black; text-decoration: none; margin: 0 10px;">Facebook</a> |
                <a href="https://twitter.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Twitter</a> |
                <a href="https://instagram.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Instagram</a> |
                <a href="https://linkedin.com/yourpage" style="color: black; text-decoration: none; margin: 0 10px;">LinkedIn</a>
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
        Rails.logger.info "Subscription confirmation email sent successfully: #{result}"
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Error sending confirmation email: #{e}"
        Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      end
    end
end
  