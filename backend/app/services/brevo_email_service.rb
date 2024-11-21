# app/services/brevo_email_service.rb
require 'brevo'
require 'brevo-ruby'
class BrevoEmailService
  def initialize(to:, subject:, html_content:, text_content:)
    @to = to
    @subject = subject
    @html_content = html_content
    @text_content = text_content
  end
  def send_email
    client = Brevo::TransactionalEmailsApi.new
    email = Brevo::SendSmtpEmail.new(
      to: [{ email: @to }],
      sender: { email: 'help@bantuhive.com' }, # Set your sender email
      subject: @subject,
      html_content: @html_content,
      text_content: @text_content
    )
    # Send the email via Brevo's API
    begin
      client.send_transac_email(email)
    rescue Brevo::ApiError => e
      Rails.logger.error "Failed to send email: #{e.message}"
      # Handle errors (log, notify, etc.)
    end
  end
end