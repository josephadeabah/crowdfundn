module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.info "ActionCable connected for user: #{current_user.id}"
    end

    private

    def find_verified_user
      # Try to get token from different sources
      token = request.params[:token] || 
              request.headers['Authorization']&.split(' ')&.last ||
              cookies.encrypted[:token]

      if token.present? && token != 'null'
        begin
          decoded_token = JWT.decode(
            token, 
            ENV.fetch('SECRET_KEY_BASE'),
            true, 
            { algorithm: 'HS256' }
          )
          user_id = decoded_token[0]['user_id']
          if user = User.find_by(id: user_id)
            user
          else
            reject_unauthorized_connection
          end
        rescue JWT::DecodeError, ActiveRecord::RecordNotFound => e
          logger.error "ActionCable auth error: #{e.message}"
          reject_unauthorized_connection
        end
      else
        logger.error "No token found for ActionCable connection"
        reject_unauthorized_connection
      end
    end
  end
end