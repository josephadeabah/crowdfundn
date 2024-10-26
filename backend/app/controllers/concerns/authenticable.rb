module Authenticable
  def authenticate_request
    header = request.headers['Authorization']
    if header.present?
      token = header.split(' ').last
      begin
        decoded = decode_token(token)
        @current_user = User.find(decoded[:user_id]) if decoded[:user_id]
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
        return
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
        return
      end
    else
      render json: { error: 'Authorization header missing' }, status: :unauthorized
      return
    end

    render json: { error: 'Not Authorized' }, status: :unauthorized unless @current_user
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

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base)[0].with_indifferent_access
  rescue StandardError
    nil
  end
end
