# app/services/transfer_notification_email_service.rb

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
          <body>
            #{body}
            <br>
            <p>Warm Regards,</p>
            <p><strong>Bantuhive Team</strong></p>
  
            <!-- Footer -->
            <div style="background-color: orange; padding: 20px; margin-top: 20px; color: black; text-align: center;">
                <p style="margin: 0; font-size: 14px; font-weight: bold;">Follow Us</p>
                <p style="margin: 5px 0;">
                <a href="https://web.facebook.com/profile.php?id=61568192851056" style="color: black; text-decoration: none; margin: 0 10px;">Facebook</a> | 
                <a href="https://twitter.com/yourprofile" style="color: black; text-decoration: none; margin: 0 10px;">Twitter</a> | 
                <a href="https://www.instagram.com/bantuhive_fund/" style="color: black; text-decoration: none; margin: 0 10px;">Instagram</a> | 
                <a href="https://www.linkedin.com/company/bantu-hive/about/" style="color: black; text-decoration: none; margin: 0 10px;">LinkedIn</a>
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
        Rails.logger.info "Transfer notification email sent successfully: #{result}"
      rescue SibApiV3Sdk::ApiError => e
        Rails.logger.error "Error sending transfer notification email: #{e}"
        Rails.logger.error "Error details: #{e.message}, Response body: #{e.response_body}"
      end
    end
end
  