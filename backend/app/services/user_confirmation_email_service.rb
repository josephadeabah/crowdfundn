class UserConfirmationEmailService
  def self.send_confirmation_email(user, host)
    token = user.confirmation_token.presence

    raise 'Confirmation token is missing' if token.blank?

    host = host.to_s.chomp('/')

    confirmation_url =
      "#{host}/auth/confirm_email/#{CGI.escape(token)}"

    full_name = user.full_name.presence || 'Anonymous'

    email = SibApiV3Sdk::SendSmtpEmail.new(
      to: [
        {
          email: user.email,
          name: full_name
        }
      ],

      template_id: 2,

      params: {
        name: full_name,
        confirmation_url: confirmation_url
      },

      sender: {
        name: 'Bantuhive Ltd',
        email: ENV.fetch('BREVO_SENDER_EMAIL', 'help@bantuhive.com')
      }
    )

    api = SibApiV3Sdk::TransactionalEmailsApi.new

    result = api.send_transac_email(email)

    Rails.logger.info(
      "Confirmation email sent successfully to #{user.email}. Message ID: #{result.message_id}"
    )

    result
  rescue SibApiV3Sdk::ApiError => e
    Rails.logger.error(
      "Brevo API error sending confirmation email to #{user.email}: " \
      "status=#{e.code}, body=#{e.response_body}"
    )

    raise
  end
end