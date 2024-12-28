module Api
  module V1
    module Members
      class UsersController < ApplicationController
        before_action :authenticate_request, except: [:index]
        before_action :authorize_admin, only: [:make_admin]
        before_action :set_user, only: %i[make_admin make_admin_role show_by_id assign_role show_subaccount update_subaccount destroy block_user activate_user] # Added :assign_role
        rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

        def index
          @users = User.includes(:profile, :roles).page(params[:page]).per(params[:per_page] || 10) # Default to 10 per page
          render json: {
            users: @users.as_json(include: %i[profile roles]),
            meta: {
              current_page: @users.current_page,
              next_page: @users.next_page,
              prev_page: @users.prev_page,
              total_pages: @users.total_pages,
              total_count: @users.total_count
            }
          }, status: :ok
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
            metadata[:custom_fields] = metadata[:custom_fields].map do |field|
              field.slice(:display_name, :variable_name, :value, :type)
            end
          else
            metadata = { custom_fields: [] }
          end
        
          ActiveRecord::Base.transaction do
            # Check if the user already has a subaccount
            if user.subaccount
              existing_recipient_code = user.subaccount.recipient_code
              if existing_recipient_code.present?
                # Attempt to delete the recipient code on Paystack
                delete_response = PaystackService.new.delete_transfer_recipient(existing_recipient_code)
                unless delete_response[:status]
                  raise StandardError, "Failed to delete recipient on Paystack: #{delete_response[:message]}"
                end
              end
        
              # Delete recipient code locally
              user.subaccount.update!(recipient_code: nil)
            end
        
            # Create a new subaccount via Paystack
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
              subaccount = Subaccount.create!(
                business_name: response[:data][:business_name],
                bank_code: response[:data][:bank_code],
                account_number: response[:data][:account_number],
                subaccount_code: response[:data][:subaccount_code],
                subaccount_type: metadata[:custom_fields].first[:type],
                percentage_charge: response[:data][:percentage_charge],
                description: response[:data][:description],
                settlement_bank: response[:data][:settlement_bank],
                metadata: metadata,
                user_id: user.id
              )
            else
              raise StandardError, response[:message]
            end
        
            # Update user's subaccount_id
            user.update_columns(subaccount_id: subaccount.subaccount_code)
          end
        
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
          user = User.find(params[:user_id])
          raise "User not found" unless user
        
          subaccount = Subaccount.find_by(subaccount_code: params[:subaccount_code])
          if subaccount.nil?
            render json: { success: false, error: "Subaccount not found" }, status: :not_found
            return
          end
        
          metadata = params[:metadata] || {}
        
          # Delete the existing recipient code on Paystack
          if subaccount.recipient_code.present?
            delete_response = PaystackService.new.delete_transfer_recipient(subaccount.recipient_code)
            unless delete_response[:status]
              raise StandardError, "Failed to delete recipient on Paystack: #{delete_response[:message]}"
            end
        
            # Delete recipient code locally
            subaccount.update!(recipient_code: nil)
          end
        
          # Call Paystack API to update the subaccount
          response = PaystackService.new.update_subaccount(
            subaccount_code: subaccount.subaccount_code,
            business_name: params[:business_name],
            settlement_bank: params[:settlement_bank],
            account_number: params[:account_number],
            bank_code: params[:bank_code],
            percentage_charge: params[:percentage_charge],
            description: params[:description],
            primary_contact_email: user.email,
            primary_contact_name: user.full_name,
            primary_contact_phone: user.phone_number,
            metadata: metadata
          )
        
          if response[:status] == true
            subaccount.update!(
              business_name: response[:data][:business_name],
              bank_code: response[:data][:bank_code],
              account_number: response[:data][:account_number],
              subaccount_code: response[:data][:subaccount_code],
              percentage_charge: response[:data][:percentage_charge],
              description: response[:data][:description],
              settlement_bank: response[:data][:settlement_bank],
              metadata: metadata,
              user_id: user.id
            )
            render json: { success: true, subaccount: subaccount }, status: :ok
          else
            render json: { success: false, error: response[:message] }, status: :unprocessable_entity
          end
        rescue => e
          Rails.logger.error "Error updating subaccount: #{e.message}"
          render json: { success: false, error: "An error occurred while updating the subaccount" }, status: :unprocessable_entity
        end   
        
        def block_user
          if @user.nil?
            render json: { error: 'User not found' }, status: :not_found
            return
          end
        
          if @user.update(status: 'blocked')
            render json: { message: "User #{@user.id} has been blocked." }, status: :ok
          else
            render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end        
        
        def activate_user
          if @user.update(status: 'active')
            render json: { message: "User #{@user.id} has been activated." }, status: :ok
          else
            render json: { error: @user.errors.full_messages }, status: :unprocessable_entity
          end
        end
        

        # PUT /api/v1/members/users/:id/make_admin
        def make_admin
          admin_status = params[:admin] == true
        
          # Use default values if currency_symbol and phone_code are not provided
          currency_symbol = params[:currency_symbol] || 'GHS'  # Default to 'GHS'
          phone_code = params[:phone_code] || '+233'             # Default to '+233'
        
          if @user.update(admin: admin_status, currency_symbol: currency_symbol, phone_code: phone_code)
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

      # DELETE /api/v1/members/users/:id
      def destroy
        if @user.destroy
          render json: { message: "User #{@user.id} has been successfully deleted." }, status: :ok
        else
          render json: { error: "Failed to delete the user." }, status: :unprocessable_entity
        end
      end

        private
        
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
