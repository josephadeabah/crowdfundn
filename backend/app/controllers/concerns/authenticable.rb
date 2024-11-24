module Authenticable
  def authenticate_request
    header = request.headers['Authorization']
    if header.present?
      token = header.split(' ').last
      begin
        decoded = decode_token(token)
        @current_user = User.find(decoded[:user_id]) if decoded[:user_id]

        # Restrict login for unconfirmed users
        if @current_user && !@current_user.email_confirmed
          render json: { error: 'Email not confirmed. Please confirm your email to proceed.' }, status: :unauthorized
          return
        end

      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
        return
      rescue JWT::DecodeError
        render json: { error: 'Invalid token' }, status: :unauthorized
        return
      end
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
    unless resource.fundraiser_id == @current_user.id
      render json: { error: 'You are not authorized to perform this action' }, status: :forbidden
    end
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base)[0].with_indifferent_access
  rescue StandardError
    nil
  end
end
