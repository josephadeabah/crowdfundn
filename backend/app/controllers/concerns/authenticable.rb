# app/controllers/concerns/authenticable.rb
module Authenticable
  extend ActiveSupport::Concern

  def authenticate_request
    header = request.headers['Authorization']
    
    # Debug logging
    Rails.logger.info "Authorization header received: #{header.inspect}"
    
    # Check for missing or invalid authorization header
    if header.blank?
      Rails.logger.warn "Missing Authorization header"
      render json: { error: 'Authentication token required' }, status: :unauthorized
      return
    end

    # Split the header to get the token
    parts = header.split(' ')
    
    # Check if header is properly formatted as "Bearer <token>"
    if parts.length != 2 || parts.first.downcase != 'bearer'
      Rails.logger.warn "Malformed Authorization header: #{header}"
      render json: { error: 'Invalid Authorization header format. Expected: Bearer <token>' }, status: :unauthorized
      return
    end

    token = parts.last
    
    # Check for null token specifically
    if token == 'null' || token.blank?
      Rails.logger.warn "Received null or blank token"
      render json: { error: 'Invalid authentication token' }, status: :unauthorized
      return
    end

    begin
      decoded = decode_token(token)
      Rails.logger.info "Decoded token: #{decoded.inspect}"
      
      if decoded && decoded[:user_id]
        @current_user = User.find(decoded[:user_id])
        Rails.logger.info "Current user authenticated: #{@current_user.id}, admin: #{@current_user.admin?}"
      else
        Rails.logger.warn "Invalid or expired token: could not decode or missing user_id"
        render json: { error: 'Invalid or expired token' }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "User not found for token: #{e.message}"
      render json: { error: 'User not found' }, status: :not_found
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT decode error: #{e.message}"
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue => e
      Rails.logger.error "Unexpected authentication error: #{e.message}"
      render json: { error: 'Authentication failed' }, status: :unauthorized
    end
  end

  def authorize_role(role_name)
    unless @current_user&.has_role?(role_name)
      Rails.logger.warn "User #{@current_user&.id} attempted to access role #{role_name} without permission"
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def authorize_admin
    unless @current_user&.admin?
      Rails.logger.warn "User #{@current_user&.id} attempted to access admin resource without admin privileges"
      render json: { error: 'Forbidden' }, status: :forbidden
    end
  end

  def authorize_admin_or_owner(resource)
    return if @current_user&.admin? || resource.user_id == @current_user&.id
    
    Rails.logger.warn "User #{@current_user&.id} attempted to access resource #{resource.id} without permission"
    render json: { error: 'Forbidden' }, status: :forbidden
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

  private

  def authorize_user!(resource)
    resource_owner_id = resource.respond_to?(:fundraiser_id) ? resource.fundraiser_id : resource.respond_to?(:author_id) ? resource.author_id : nil
  
    return if resource_owner_id == @current_user.id || @current_user.has_role?('Admin') || @current_user.has_role?('Manager')
  
    Rails.logger.warn "User #{@current_user.id} unauthorized for resource #{resource.id}"
    render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
  end
  

  def decode_token(token)
    # Use proper JWT decoding with validation
    decoded = JWT.decode(
      token, 
      Rails.application.secret_key_base, 
      true, 
      { algorithm: 'HS256', verify_iss: false, verify_aud: false }
    )[0].with_indifferent_access
    
    # Check expiration if present
    if decoded[:exp] && Time.at(decoded[:exp]) < Time.current
      Rails.logger.warn "Token expired for user #{decoded[:user_id]}"
      return nil
    end
    
    decoded
  rescue JWT::ExpiredSignature
    Rails.logger.warn "Token expired"
    nil
  rescue JWT::DecodeError => e
    Rails.logger.error "JWT decode error: #{e.message}"
    nil
  rescue => e
    Rails.logger.error "Unexpected error decoding token: #{e.message}"
    nil
  end
end