module Authenticable
  def authenticate_request
    header = request.headers['Authorization']
    Rails.logger.info "Authorization header: #{header}"
    
    return unless header.present?

    token = header.split(' ').last
    Rails.logger.info "Extracted token: #{token}"
    
    begin
      decoded = decode_token(token)
      Rails.logger.info "Decoded token: #{decoded.inspect}"
      
      if decoded && decoded[:user_id]
        @current_user = User.find(decoded[:user_id])
        Rails.logger.info "Current user found: #{@current_user.id}, admin: #{@current_user.admin?}"
      else
        Rails.logger.error "Invalid or expired token"
        render json: { error: 'Invalid or expired token' }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound => e
      Rails.logger.error "User not found: #{e.message}"
      render json: { error: 'User not found' }, status: :not_found
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT decode error: #{e.message}"
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue => e
      Rails.logger.error "Unexpected error in authenticate_request: #{e.message}"
      render json: { error: 'Authentication failed' }, status: :unauthorized
    end
  end


  def authorize_role(role_name)
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user&.has_role?(role_name)
  end

  def authorize_admin
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user&.admin?
  end

  def authorize_admin_or_owner(resource)
    return if @current_user&.admin? || resource.user_id == @current_user&.id
    
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
  
    render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
  end
  

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base)[0].with_indifferent_access
  rescue StandardError
    nil
  end
end
