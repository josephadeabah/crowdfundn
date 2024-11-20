module Api
  module V1
    module Members
      class AuthController < ApplicationController
        def signup
          user = User.new(user_params)
          if user.save
            render json: { token: encode_token(user.id), user: user.as_json(include: :roles) }, status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def login
          begin
            user = User.find_by(email: params[:email])
            if user&.authenticate(params[:password])
              render json: { token: encode_token(user.id), user: user }, status: :ok
            else
              render json: { error: 'Invalid email or password' }, status: :unauthorized
            end
          rescue => e
            Rails.logger.error "Login error: #{e.message}"
            render json: { error: 'Internal server error' }, status: :internal_server_error
          end
        end

        def password_reset
          user = User.find_by(email: params[:email])
          if user
            token = SecureRandom.hex(10)
            user.update(password_reset_token: token, password_reset_sent_at: Time.current)
            UserMailer.password_reset(user).deliver_now
            render json: { message: 'Password reset instructions sent' }, status: :ok
          else
            render json: { error: 'Email not found' }, status: :not_found
          end
        end

        def reset_password
          user = User.find_by(password_reset_token: params[:token])
          if user && user.password_reset_sent_at > 2.hours.ago
            if user.update(password: params[:password], password_confirmation: params[:password_confirmation])
              user.update(password_reset_token: nil)
              render json: { message: 'Password has been reset' }, status: :ok
            else
              render json: { error: 'Password reset failed' }, status: :unprocessable_entity
            end
          else
            render json: { error: 'Invalid or expired reset token' }, status: :unprocessable_entity
          end
        end

        private

        def user_params
          params.require(:user).permit(
            :email,
            :password,
            :password_confirmation,
            :admin,
            :full_name,
            :phone_number,
            :country,
            :payment_method,
            :mobile_money_provider,
            :currency,
            :currency_symbol,
            :phone_code,
            :birth_date,
            :category,
            :target_amount,
            :duration_in_days,
            :national_id
          )
        end

        def encode_token(user_id)
          JWT.encode({ user_id: user_id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base)
        end
      end
    end
  end
end
