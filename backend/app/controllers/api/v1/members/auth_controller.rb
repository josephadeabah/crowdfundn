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
        

        def login
          user = User.find_by(email: params[:email])
          if user&.authenticate(params[:password])
            if user.email_confirmed
              render json: { token: encode_token(user.id), user: user }, status: :ok
            else
              user.send_confirmation_email
              render json: { error: 'Email not confirmed. Please confirm with the link sent to your email to log in.' }, status: :unauthorized
            end
          else
            render json: { error: 'Invalid email or password' }, status: :unauthorized
          end
        end 

      def confirm_email
        user = User.find_by(confirmation_token: params[:token])

        if user.nil?
          # Redirect to frontend with error if token is invalid
          redirect_to "https://www.bantuhive.com/auth/confirm_email/#{params[:token]}?status=error"
          return
        end

        if user.email_confirmed
          # Redirect to frontend with error if email is already confirmed
          redirect_to "https://www.bantuhive.com/auth/confirm_email/#{params[:token]}?status=already_confirmed"
          return
        end

        if user.confirmation_token_expired?
          # Redirect to frontend with token expiry error
          redirect_to "https://www.bantuhive.com/auth/confirm_email/#{params[:token]}?status=expired"
          return
        end

        user.confirm_email!
        # Redirect to frontend with success message
        redirect_to "https://www.bantuhive.com/auth/confirm_email/#{params[:token]}?status=success"
      end

      # def resend_confirmation
      #   user = User.find_by(email: params[:email])
      #   if user && !user.email_confirmed
      #     user.generate_confirmation_token
      #     user.save!
      #     user.send_confirmation_email
      #     render json: { message: 'Confirmation email resent successfully' }, status: :ok
      #   else
      #     render json: { error: 'Invalid email or email already confirmed' }, status: :unprocessable_entity
      #   end
      # end

      def resend_confirmation
        user = User.find_by(email: params[:email])
        
        if user
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
        else
          render json: { error: 'Invalid email.' }, status: :unprocessable_entity
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
