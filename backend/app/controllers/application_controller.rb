class ApplicationController < ActionController::API
  include Authenticable
  before_action :set_default_response_format

  def not_found
    render json: { error: 'Route not found' }, status: :not_found
  end

  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  
  private
  
  def record_not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end
  
  def record_invalid(exception)
    render json: { error: exception.record.errors.full_messages }, status: :unprocessable_entity
  end
  
  def parameter_missing(exception)
    render json: { error: exception.message }, status: :bad_request
  end

  def set_default_response_format
    request.format = :json
  end
end
