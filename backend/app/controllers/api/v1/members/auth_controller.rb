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
          user = User.find_by(email: params[:email])
          if user.nil?
            return render json: { error: 'User not found' }, status: :unauthorized
          end
        
          if user.authenticate(params[:password])
            token = encode_token(user.id)
            render json: { token: token, user: user }, status: :ok
          else
            render json: { error: 'Invalid password' }, status: :unauthorized
          end
        end
        

        def password_reset
          user = User.find_by(email: params[:email])
          if user
            # Implement password reset logic (e.g., send email with reset instructions)
            render json: { message: 'Password reset instructions sent' }, status: :ok
          else
            render json: { error: 'Email not found' }, status: :not_found
          end
        end

        def reset_password
          # Find user by reset token and update password
          # Implement actual reset password logic
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
