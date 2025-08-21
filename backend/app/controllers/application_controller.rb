class ApplicationController < ActionController::API
  include Authenticable
  before_action :set_default_response_format

  def not_found
    render json: { error: 'Route not found' }, status: :not_found
  end

  private

  def set_default_response_format
    request.format = :json
  end
end
