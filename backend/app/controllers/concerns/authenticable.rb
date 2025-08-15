module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  def authenticate_request
    header = request.headers['Authorization']
    
    unless header.present?
      render_missing_authorization_header
      return
    end

    token = extract_token_from_header(header)
    return unless token_valid?(token)

    begin
      decoded = decode_token(token)
      set_current_user(decoded)
    rescue ActiveRecord::RecordNotFound => e
      render_user_not_found_error
    rescue JWT::DecodeError => e
      render_invalid_token_error
    rescue => e
      render_authentication_error(e)
    end
  end

  def authorize_role(role_name)
    unless authorized_for_role?(role_name)
      render_forbidden_error("Requires #{role_name} role")
    end
  end

  def authorize_admin
    authorize_role('Admin')
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

  def extract_token_from_header(header)
    header.split(' ').last
  end

  def token_valid?(token)
    unless token.present?
      render_invalid_token_format_error
      return false
    end
    true
  end

  def decode_token(token)
    JWT.decode(token, Rails.application.secret_key_base, true, { algorithm: 'HS256' })[0].with_indifferent_access
  end

  def set_current_user(decoded)
    @current_user = User.find(decoded[:user_id])
    unless @current_user
      raise ActiveRecord::RecordNotFound, "User not found"
    end
  end

  def authorize_user!(resource)
    resource_owner_id = if resource.respond_to?(:fundraiser_id)
                          resource.fundraiser_id
                        elsif resource.respond_to?(:author_id)
                          resource.author_id
                        end

    return if resource_owner_id == @current_user.id || 
              @current_user.has_role?('Admin') || 
              @current_user.has_role?('Manager')

    render_forbidden_error('You are not authorized to perform this action')
  end

  def authorized_for_role?(role_name)
    @current_user&.has_role?(role_name)
  end

  # Error rendering methods
  def render_missing_authorization_header
    render json: { error: 'Authorization header is missing' }, status: :unauthorized
  end

  def render_invalid_token_format_error
    render json: { error: 'Invalid token format' }, status: :unauthorized
  end

  def render_user_not_found_error
    render json: { error: 'User not found' }, status: :not_found
  end

  def render_invalid_token_error
    render json: { error: 'Invalid or expired token' }, status: :unauthorized
  end

  def render_authentication_error(exception)
    render json: { 
      error: 'Authentication failed',
      details: Rails.env.production? ? nil : exception.message 
    }, status: :unauthorized
  end

  def render_forbidden_error(message)
    render json: { error: message }, status: :forbidden
  end
end