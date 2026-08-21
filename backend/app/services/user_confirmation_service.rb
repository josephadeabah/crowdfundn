# app/services/user_confirmation_service.rb
class UserConfirmationService
  def self.generate_confirmation_token(user)
    # Generate a secure random token instead of JWT for simplicity
    token = SecureRandom.urlsafe_base64(32)
    
    # Store the token in the user record
    user.confirmation_token = token
    user.confirmation_token_expires_at = 24.hours.from_now
    user.confirmation_sent_at = Time.current
    
    # Save the user (but don't trigger callbacks)
    user.save(validate: false)
    
    Rails.logger.info "Generated confirmation token for user #{user.id}: #{token[0..10]}..."
    Rails.logger.info "Token expires at: #{user.confirmation_token_expires_at}"
    
    token
  end

  def self.send_confirmation_email(user)
    host = ENV.fetch('FRONTEND_URL', 'https://bantuhive.com')
    
    # Generate token if not exists or expired
    if user.confirmation_token.blank? || user.confirmation_token_expires_at.nil? || user.confirmation_token_expires_at < Time.current
      generate_confirmation_token(user)
    end
    
    # Send email
    UserConfirmationEmailService.send_confirmation_email(user, host)
  end
  
  def self.confirm_email(token)
    # Find user by confirmation token
    user = User.find_by(confirmation_token: token)
    
    if user.nil?
      return { success: false, error: 'Invalid confirmation token' }
    end
    
    if user.confirmation_token_expires_at.nil? || user.confirmation_token_expires_at < Time.current
      return { success: false, error: 'Confirmation token has expired' }
    end
    
    if user.email_confirmed
      return { success: false, error: 'Email is already confirmed' }
    end
    
    # Confirm the email
    user.update!(
      email_confirmed: true,
      confirmed_at: Time.current,
      confirmation_token: nil,
      confirmation_token_expires_at: nil
    )
    
    { success: true }
  end
end