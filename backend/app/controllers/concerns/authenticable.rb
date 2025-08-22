module Authenticable
  # Token expiration time (24 hours)
  TOKEN_EXPIRATION = 24.hours

  def authenticate_request
    header = request.headers['Authorization']
    
    unless header.present?
      render json: { error: 'Authorization header missing' }, status: :unauthorized
      return
    end

    unless header.start_with?('Bearer ')
      render json: { error: 'Invalid authorization format' }, status: :unauthorized
      return
    end

    token = header.split(' ').last
    
    # Basic token validation
    unless token.present? && token.length > 20 # Simple length check
      render json: { error: 'Invalid token' }, status: :unauthorized
      return
    end

    begin
      decoded = decode_token(token)
      
      unless decoded && decoded[:user_id].present?
        render json: { error: 'Invalid or expired token' }, status: :unauthorized
        return
      end

      # Check token expiration
      if token_expired?(decoded)
        render json: { error: 'Invalid or expired token' }, status: :unauthorized
        return
      end

      @current_user = User.find(decoded[:user_id])
      
      # Check if user is active
      unless @current_user.status == 'active'
        render json: { error: 'Account is not active' }, status: :unauthorized
        return
      end

    rescue ActiveRecord::RecordNotFound
      Rails.logger.warn "User not found for token: #{token[0..10]}..."
      render json: { error: 'Invalid or expired token' }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.warn "JWT decode error: #{e.message}, token: #{token[0..10]}..."
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue JWT::ExpiredSignature
      Rails.logger.warn "Expired token: #{token[0..10]}..."
      render json: { error: 'Invalid or expired token' }, status: :unauthorized
    rescue JWT::VerificationError
      Rails.logger.warn "Token verification failed: #{token[0..10]}..."
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue StandardError => e
      Rails.logger.error "Unexpected authentication error: #{e.message}, token: #{token[0..10]}..."
      render json: { error: 'Authentication failed' }, status: :unauthorized
    end
  end

  def authorize_role(role_name)
    unless @current_user&.has_role?(role_name)
      render json: { error: 'Forbidden' }, status: :forbidden
      false
    else
      true
    end
  end

  def authorize_admin
    unless @current_user&.admin?
      render json: { error: 'Forbidden' }, status: :forbidden
      false
    else
      true
    end
  end

  def authorize_admin_role
    authorize_role('Admin')
  end

  def authorize_manager
    authorize_role('Manager')
  end

  def authorize_moderator
    authorize_role('Moderator')
  end

  # Helper method to generate tokens consistently
  def self.generate_token(user_id)
    payload = {
      user_id: user_id,
      exp: TOKEN_EXPIRATION.from_now.to_i,
      iat: Time.current.to_i,
      jti: SecureRandom.uuid # Unique token identifier for revocation capability
    }
    
    JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
  end

  # Helper method to check if user can be authenticated (for pre-flight checks)
  def self.valid_token?(token)
    return false unless token.present?
    
    begin
      decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')[0].with_indifferent_access
      !token_expired?(decoded) && User.exists?(decoded[:user_id])
    rescue StandardError
      false
    end
  end

  private

  def authorize_user!(resource)
    resource_owner_id = if resource.respond_to?(:fundraiser_id)
                          resource.fundraiser_id
                        elsif resource.respond_to?(:author_id)
                          resource.author_id
                        elsif resource.respond_to?(:user_id)
                          resource.user_id
                        else
                          nil
                        end

    return if resource_owner_id == @current_user.id || 
              @current_user.has_role?('Admin') || 
              @current_user.has_role?('Manager')

    render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
    false
  end

  def decode_token(token)
    # Add additional validation for token format
    raise JWT::DecodeError, 'Invalid token format' unless token.match?(/\A[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+\z/)
    
    decoded = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')[0].with_indifferent_access
    
    # Validate required claims
    unless decoded[:user_id].present? && decoded[:exp].present?
      raise JWT::DecodeError, 'Missing required claims'
    end
    
    decoded
  end

  def token_expired?(decoded_payload)
    return true unless decoded_payload[:exp].present?
    
    Time.at(decoded_payload[:exp]) < Time.current
  end

  # Rate limiting helper (optional)
  def check_rate_limit(identifier, limit: 10, period: 1.minute)
    key = "rate_limit:#{identifier}:#{(Time.current.to_i / period).to_i}"
    count = Rails.cache.fetch(key, expires_in: period) { 0 }
    
    if count >= limit
      render json: { error: 'Rate limit exceeded' }, status: :too_many_requests
      false
    else
      Rails.cache.increment(key)
      true
    end
  end
end