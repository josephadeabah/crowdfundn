class ApplicationMailer < ActionMailer::Base
  default from: ENV.fetch('BREVO_SENDER_EMAIL', 'help@bantuhive.com')
  layout 'mailer'
end