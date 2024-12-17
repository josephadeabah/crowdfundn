module Api
  module V1
    module Members
      class UsersController < ApplicationController
        before_action :authenticate_request, except: [:index]
        before_action :authorize_admin, only: [:make_admin]
        before_action :set_user, only: %i[make_admin make_admin_role show_by_id assign_role show_subaccount update_subaccount] # Added :assign_role
        rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

        def index
          @users = User.includes(:profile, :roles).all
          render json: @users.to_json(include: %i[profile roles]), status: :ok
        end

        def show
          render json: @current_user.as_json(include: %i[profile roles]), status: :ok
        end

        def show_by_id
          render json: @user.as_json(include: %i[profile roles]), status: :ok
        end

        def create_subaccount
          user = User.find(params[:user_id])
          raise "User not found" unless user

          # Prepare metadata
          metadata = params[:subaccount][:metadata]
          if metadata && metadata[:custom_fields]
            # Sanitize custom fields (ensure they have the required keys and valid data)
            metadata[:custom_fields] = metadata[:custom_fields].map do |field|
              # Ensure the field only contains necessary attributes and valid data
              field.slice(:display_name, :variable_name, :value, :type)
            end
          else
            metadata = { custom_fields: [] }  # Default to empty custom fields if not provided
          end
        
          # Check if the user already has a subaccount
          if user.subaccount
            # Optionally, update the existing subaccount fields if needed
            subaccount = user.subaccount
          else
            # If no subaccount exists, create a new one via Paystack
            response = PaystackService.new.create_subaccount(
              business_name: params[:subaccount][:business_name],
              settlement_bank: params[:subaccount][:settlement_bank],
              account_number: params[:subaccount][:account_number],
              bank_code: params[:subaccount][:bank_code],
              percentage_charge: params[:subaccount][:percentage_charge],
              description: params[:subaccount][:description],
              primary_contact_email: user.email,
              primary_contact_name: user.full_name,
              primary_contact_phone: user.phone_number,
              metadata: metadata
            )
        
            if response[:status] == true
              # Create and associate a new subaccount with the user
              subaccount = user.create_subaccount(
                business_name: params[:subaccount][:business_name],
                bank_code: params[:subaccount][:settlement_bank],
                account_number: params[:subaccount][:account_number],
                subaccount_code: response[:data][:subaccount_code],
                subaccount_type: metadata[:custom_fields].first[:type],
                percentage_charge: params[:subaccount][:percentage_charge],
                description: params[:subaccount][:description],
                settlement_bank: params[:subaccount][:settlement_bank],
                metadata: params[:subaccount][:metadata]
              )
            else
              render json: { success: false, error: response[:message] }, status: :unprocessable_entity
              return
            end
          end
        
          # Ensure the user's subaccount_id is set to the subaccount_code
          user.update_columns(subaccount_id: subaccount.subaccount_code)
        
          render json: { success: true, subaccount_code: user.subaccount_id }, status: :ok
        rescue => e
          Rails.logger.error "Error during account creation: #{e.message}"
          render json: { success: false, error: e.message }, status: :unprocessable_entity
        end               
        
        # GET /api/v1/members/users/:user_id/subaccount
        def show_subaccount
          if @user.subaccount_id
            subaccount = Subaccount.find_by(subaccount_code: @user.subaccount_id)
            if subaccount
              render json: subaccount, status: :ok
            else
              render json: { error: "Subaccount not found" }, status: :not_found
            end
          else
            render json: { error: "User has no associated subaccount" }, status: :not_found
          end
        end
        
        
        def update_subaccount
          # Ensure the user is set and has a subaccount
          subaccount = Subaccount.find_by(subaccount_code: @user.subaccount_id)
          
          if subaccount.nil?
            # If no subaccount exists for the user, return an error
            render json: { success: false, error: "Subaccount not found for this user" }, status: :not_found
            return
          end
        
          # Try to update the subaccount with the provided parameters
          if subaccount.update(subaccount_params)
            # If successful, return the updated subaccount
            render json: { success: true, subaccount: subaccount }, status: :ok
          else
            # If the update fails, return validation errors
            render json: { success: false, error: subaccount.errors.full_messages }, status: :unprocessable_entity
          end
        rescue => e
          # Log any errors that occur during the update process
          Rails.logger.error "Error updating subaccount: #{e.message}"
          render json: { success: false, error: "An error occurred while updating the subaccount" }, status: :unprocessable_entity
        end                      
        

        # PUT /api/v1/members/users/:id/make_admin
        def make_admin
          admin_status = params[:admin] == 'true'
          if @user.update(admin: admin_status)
            render json: @user.as_json(include: :profile), status: :ok
          else
            render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def make_admin_role
          admin_role = Role.find_by(name: 'Admin')
          if params[:admin] == 'true'
            @user.roles << admin_role unless @user.has_role?('Admin')
          else
            @user.roles.delete(admin_role)
          end

          render json: @user.as_json(include: %i[profile roles]), status: :ok
        end

        def assign_role
          role = Role.find_by(name: params[:role_name])
          if role.present?
            @user.roles << role unless @user.has_role?(role.name)
            render json: { message: 'Role assigned successfully.' }, status: :ok
          else
            render json: { error: 'Role not found' }, status: :unprocessable_entity
          end
        end

        def update
          if @current_user.update(user_params)
            render json: @current_user.as_json(include: :profile), status: :ok
          else
            render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def change_password
          if @current_user.authenticate(params[:user][:current_password]) && @current_user.update(password_params)
            render json: { message: 'Password updated successfully' }, status: :ok
          else
            render json: { error: 'Current password is incorrect or new password is invalid' },
                   status: :unprocessable_entity
          end
        end

        private

        def subaccount_params
          params.require(:subaccount).permit(
            :business_name,
            :settlement_bank,
            :account_number,
            :bank_code,
            :percentage_charge,
            :description,
            metadata: { custom_fields: [:display_name, :variable_name, :value] }
          )
        end
        
        def record_not_found
          render json: { error: 'User not found' }, status: :not_found
        end

        def set_user
          # First, try to find the user by user_id if it's available
          @user = User.includes(:profile, :roles, :subaccount).find_by(id: params[:user_id]) if params[:user_id]

          # If no user found by user_id, then fallback to finding by id
          @user ||= User.includes(:profile, :roles, :subaccount).find(params[:id]) if params[:id]

          # If still no user found, raise an error
          raise ActiveRecord::RecordNotFound, 'User not found' unless @user
        end

        def user_params
          params.require(:user).permit(
            :email,
            :password,
            :password_confirmation,
            :full_name,
            :phone_number,
            :country,
            :payment_method,
            :mobile_money_provider,
            :currency,
            :birth_date,
            :category,
            :target_amount,
            :national_id,
            profile_attributes: %i[
              name
              description
              funding_goal
              amount_raised
              end_date
              category
              location
              avatar
              status
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
