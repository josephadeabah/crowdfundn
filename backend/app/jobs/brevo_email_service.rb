# app/jobs/send_brevo_email_job.rb
class SendBrevoEmailJob < ApplicationJob
    queue_as :mailers
  
    def perform(to:, subject:, html_content:, text_content:)
      service = BrevoEmailService.new(
        to: to,
        subject: subject,
        html_content: html_content,
        text_content: text_content
      )
      service.send_email
    end
end