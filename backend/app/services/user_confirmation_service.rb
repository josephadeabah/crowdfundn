class UserConfirmationService
  def self.generate_confirmation_token(user)
    payload = { user_id: user.id, exp: 2.days.from_now.to_i }
    JWT.encode(payload, Rails.application.secret_key_base)
  end
  
  def self.send_confirmation_email(user)
    host = Rails.application.routes.default_url_options[:host] || 'https://bantuhive.com'
    UserConfirmationEmailService.send_confirmation_email(user, host)
  end
end
