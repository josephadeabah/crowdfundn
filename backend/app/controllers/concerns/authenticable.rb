module Authenticable
  def authenticate_request
    header = request.headers['Authorization']
    unless header.present?
      render json: { error: 'Authorization header missing' }, status: :unauthorized
      return
    end

    token = header.split(' ').last
    unless token.present?
      render json: { error: 'Token missing' }, status: :unauthorized
      return
    end

    begin
      decoded = decode_token(token)
      unless decoded && decoded[:user_id]
        render json: { error: 'Invalid token' }, status: :unauthorized
        return
      end

      @current_user = User.find(decoded[:user_id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: 'User not found' }, status: :not_found
    rescue JWT::DecodeError => e
      render json: { error: 'Invalid token', details: e.message }, status: :unauthorized
    rescue StandardError => e
      Rails.logger.error "Authentication error: #{e.message}"
      render json: { error: 'Authentication failed' }, status: :internal_server_error
    end
  end

  def authorize_role(role_name)
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user&.has_role?(role_name)
  end

  def authorize_admin
    render json: { error: 'Forbidden' }, status: :forbidden unless @current_user&.admin?
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
    resource_owner_id = if resource.respond_to?(:fundraiser_id)
                          resource.fundraiser_id
                        else
                          resource.respond_to?(:author_id) ? resource.author_id : nil
                        end

    if resource_owner_id == @current_user.id || @current_user.has_role?('Admin') || @current_user.has_role?('Manager')
      return
    end

    render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base)[0].with_indifferent_access
  rescue StandardError
    nil
  end
end
