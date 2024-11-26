module Api
  module V1
    module Members
      class AuthController < ApplicationController
        def signup
          existing_user = User.find_by(email: user_params[:email])
        
          if existing_user
            if existing_user.email_confirmed
              render json: { error: 'This email is already confirmed. Please log in instead.' }, status: :unprocessable_entity
            else
              render json: { error: 'This email is already registered but not confirmed. Please check your email for the confirmation link or request a new one.' }, status: :unprocessable_entity
            end
          else
            user = User.new(user_params)
            if user.save
              render json: { token: encode_token(user.id), user: user.as_json(include: :roles) }, status: :created
            else
              render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            end
          end
        end


        def confirm_email
          Rails.logger.debug "Confirmation token: #{params[:token]}"
          user = User.find_by(confirmation_token: params[:token])
        
          if user.nil?
            render json: { error: 'Invalid confirmation token' }, status: :unprocessable_entity
          elsif user.confirmation_token_expired?
            render json: { error: 'Confirmation token has expired. Please request a new confirmation email.' }, status: :unprocessable_entity
          else
            user.confirm_email!
            render json: { message: 'Email confirmed successfully' }, status: :ok
          end
        end                   
        

        def login
          user = User.find_by(email: params[:email])
          
          if user&.authenticate(params[:password])
            if user.email_confirmed
              render json: { token: encode_token(user.id), user: user.as_json(include: :roles) }, status: :ok
            else
              user.send_confirmation_email
              render json: { error: 'Email not confirmed. Please confirm with the link sent to your email to log in.' }, status: :unauthorized
            end
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end
              

        def resend_confirmation
          user = User.find_by(email: params[:email])
          
          if user.nil?
            render json: { error: 'Invalid email' }, status: :unprocessable_entity
            return
          end
        
          if user.email_confirmed
            render json: { error: 'Email is already confirmed.' }, status: :unprocessable_entity
            return
          end
        
          if user.confirmation_sent_at && user.confirmation_sent_at > 1.hour.ago
            render json: { error: 'Confirmation email already sent recently. Please check your inbox or try again later.' }, status: :too_many_requests
            return
          end
        
          user.generate_confirmation_token
          user.save!
          user.send_confirmation_email
        
          render json: { message: 'Confirmation email resent successfully' }, status: :ok
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
