module Api
  module V1
    module Members
      class AuthController < ApplicationController
        skip_before_action :authenticate_request, only: [:signup, :login, :confirm_email, :resend_confirmation, :password_reset]

        def signup
          existing_user = User.find_by(email: user_params[:email])

          if existing_user
            if existing_user.email_confirmed
              render json: { error: 'This email is already confirmed. Please log in instead.' },
                     status: :unprocessable_entity
            else
              render json: { error: 'This email is already registered but not confirmed. Please check your email for the confirmation link or request a new one.' },
                     status: :unprocessable_entity
            end
          else
            user = User.new(user_params)
            user.email_confirmed = false
            
            if user.save
              # Send confirmation email
              user.send_confirmation_email
              
              render json: { 
                message: 'User created successfully. Please check your email for confirmation link.',
                user: user.as_json(only: [:id, :email, :full_name])
              }, status: :created
            else
              render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            end
          end
        end

        def confirm_email
          token = params[:confirmation_token]
          
          Rails.logger.info "Confirming email with token: #{token[0..10]}..." if token.present?
          
          if token.blank?
            render json: { error: 'Confirmation token is missing' }, status: :unprocessable_entity
            return
          end
          
          # Use the service to confirm the email
          result = UserConfirmationService.confirm_email(token)
          
          if result[:success]
            render json: { message: 'Email confirmed successfully!' }, status: :ok
          else
            render json: { error: result[:error] }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Error confirming email: #{e.message}"
          render json: { error: 'An error occurred while confirming your email. Please try again.' }, 
                 status: :unprocessable_entity
        end

        def login
          user = User.find_by(email: params[:email])

          if user&.authenticate(params[:password])
            Rails.logger.debug { "User email confirmed: #{user.email_confirmed}" }
            if user.email_confirmed
              user.update(
                last_sign_in_at: Time.current,
                sign_in_count: user.sign_in_count + 1
              )
              
              user_data = user.as_json(include: :roles).merge(
                kyc_status_info: user.kyc_status_info,
                can_invest: user.can_invest?,
                can_create_campaign: user.can_create_campaign?
              )
              
              render json: { token: encode_token(user.id), user: user_data }, status: :ok
            else
              user.send_confirmation_email
              render json: { error: 'Email not confirmed. Please confirm with the link sent to your email to log in.' },
                     status: :unauthorized
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

          if user.confirmation_sent_at && user.confirmation_sent_at > 1.minute.ago
            render json: { error: 'Confirmation email already sent recently. Please check your inbox or try again in a minute.' },
                   status: :too_many_requests
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
            :user_type
          )
        end

        def encode_token(user_id)
          JWT.encode({ user_id: user_id, exp: 24.hours.from_now.to_i }, Rails.application.secret_key_base)
        end
      end
    end
  end
end