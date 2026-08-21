# app/services/user_confirmation_service.rb
class UserConfirmationService
  # Environment Configuration
  def self.frontend_url
    ENV.fetch('FRONTEND_URL', 'https://bantuhive.com')
  end

  def self.generate_confirmation_token(user)
    return nil unless user&.id
    
    payload = { 
      user_id: user.id, 
      exp: 2.days.from_now.to_i 
    }
    
    JWT.encode(payload, Rails.application.secret_key_base)
  rescue JWT::EncodeError => e
    Rails.logger.error "Failed to generate confirmation token: #{e.message}"
    nil
  end

  def self.send_confirmation_email(user)
    return false unless user&.email.present?
    
    # Use FRONTEND_URL from environment instead of default_url_options
    host = frontend_url
    
    # Pass the host to the email service
    UserConfirmationEmailService.send_confirmation_email(user, host)
  rescue => e
    Rails.logger.error "Failed to send confirmation email: #{e.message}"
    false
  end
end