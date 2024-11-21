# app/services/brevo_email_service.rb
require 'brevo'

class BrevoEmailService
  def initialize(to:, subject:, html_content:, text_content:)
    @to = to
    @subject = subject
    @html_content = html_content
    @text_content = text_content
  end

  def send_email
    Brevo.configure do |config|
      config.api_key['api-key'] = ENV['BREVO_API_KEY']
    end

    client = Brevo::TransactionalEmailsApi.new
    email = Brevo::SendSmtpEmail.new(
      to: [{ email: @to }],
      sender: { email: ENV['BREVO_SENDER_EMAIL'] }, # Use ENV for sender email
      subject: @subject,
      html_content: @html_content,
      text_content: @text_content
    )

    begin
      response = client.send_transac_email(email)
      Rails.logger.info "Email sent successfully: #{response.inspect}"
      true
    rescue Brevo::ApiError => e
      Rails.logger.error "Failed to send email: #{e.message}"
      false
    end
  end
end
