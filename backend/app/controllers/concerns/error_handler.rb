# app/controllers/concerns/error_handler.rb
module ErrorHandler
    extend ActiveSupport::Concern
  
    included do
      rescue_from StandardError, with: :handle_standard_error
    end
  
    private
  
    def handle_standard_error(exception)
      render json: { error: exception.message }, status: :unprocessable_entity
    end
end
  