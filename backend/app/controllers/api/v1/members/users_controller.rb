module Api
  module V1
    module Members
      class UsersController < ApplicationController
        before_action :authenticate_request, except: [:index]  # Skip authentication for index action
        before_action :authorize_admin, only: [:make_admin]
        before_action :set_user, only: [:make_admin, :show_by_id]

        def index
          @users = User.includes(:profiles).all
          render json: @users.to_json(include: :profiles), status: :ok
        end

        def show
          render json: @current_user.as_json(include: :profiles), status: :ok
        end

        def show_by_id
          render json: @user.as_json(include: :profiles), status: :ok
        end

        def make_admin
          admin_status = params[:admin] == "true"
          if @user.update(admin: admin_status)
            render json: @user.as_json(include: :profiles), status: :ok
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @current_user.update(user_params)
            render json: @current_user.as_json(include: :profiles), status: :ok
          else
            render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def change_password
          if @current_user.authenticate(params[:user][:current_password]) && @current_user.update(password_params)
            render json: { message: 'Password updated successfully' }, status: :ok
          else
            render json: { error: 'Current password is incorrect or new password is invalid' }, status: :unprocessable_entity
          end
        end

        private

        def set_user
          @user = User.includes(:profiles).find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :not_found
        end

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
            :birth_date,
            :category,
            :target_amount,
            :duration_in_days,
            :national_id,
            profiles_attributes: [
              :name,
              :description,
              :funding_goal,
              :amount_raised,
              :end_date,
              :category,
              :location,
              :avatar,
              :status
            ]
          )
        end

        def password_params
          params.require(:user).permit(:password, :password_confirmation)
        end
      end
    end
  end
end
