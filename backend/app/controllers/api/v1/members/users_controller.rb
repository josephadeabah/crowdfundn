module Api
  module V1
    module Members
      class UsersController < ApplicationController
        before_action :authenticate_request, except: [:index]
        before_action :authorize_admin, only: [:make_admin]
        before_action :set_user, only: %i[make_admin make_admin_role show_by_id assign_role remove_role show_subaccount update_subaccount destroy block_user activate_user]
        rescue_from ActiveRecord::RecordNotFound, with: :record_not_found

        def index
          # Support search across all users
          users_scope = User.includes(:profile, :roles)
          
          # Apply search filter if search parameter is provided
          if params[:search].present?
            search_term = "%#{params[:search].downcase}%"
            users_scope = users_scope.where(
              "LOWER(users.full_name) LIKE ? OR LOWER(users.email) LIKE ?", 
              search_term, 
              search_term
            )
          end
          
          # Apply pagination
          @users = users_scope.page(params[:page]).per(params[:per_page] || 10)
          
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

        def transfer_status
          render json: {
            transfer_locked: @current_user.transfer_locked?,
            transfer_lock_info: @current_user.transfer_lock_info,
            can_make_transfers: @current_user.can_make_transfers?
          }
        end

        # In your subscriptions_controller or payment processor
        def create
          # Process payment...
          if payment_successful?
            subscription = @current_user.subscriptions.create!(
              plan_id: params[:plan_id],
              starts_at: Time.current,
              expires_at: 1.month.from_now,
              status: 'active'
            )

            # Update user's premium access
            @current_user.update(premium_access: true)

            render json: { success: true, subscription: subscription }
          else
            render json: { success: false, error: 'Payment failed' }, status: :unprocessable_entity
          end
        end

        def show_by_id
          render json: @user.as_json(include: %i[profile roles]), status: :ok
        end

        def create_subaccount
          user = User.find(params[:user_id])
          raise 'User not found' unless user

          # Check if user already has a subaccount
          if user.subaccount.present?
            # Update existing subaccount instead of creating new one
            return update_existing_subaccount(user, user.subaccount)
          end

          # Prepare metadata
          metadata = params[:subaccount][:metadata] || { custom_fields: [] }

          # Add user and campaign details to metadata
          metadata.merge!(
            user_id: user.id,
            email: user.email,
            user_name: user.full_name
          )

          # Ensure custom_fields is an array
          metadata[:custom_fields] = if metadata[:custom_fields]
                                      metadata[:custom_fields].map do |field|
                                        field.slice(:display_name, :variable_name, :value, :type)
                                      end
                                    else
                                      []
                                    end

          ActiveRecord::Base.transaction do
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

            raise StandardError, response[:message] unless response[:status] == true

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

            # Update user's subaccount_id (maintains backward compatibility)
            user.update_columns(subaccount_id: subaccount.subaccount_code)
          end

          render json: { success: true, subaccount_code: user.subaccount_id }, status: :ok
        rescue StandardError => e
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
              render json: { error: 'Subaccount not found' }, status: :not_found
            end
          else
            render json: { error: 'User has no associated subaccount' }, status: :not_found
          end
        end

        def update_subaccount
          user = User.find(params[:user_id])
          raise 'User not found' unless user

          # Use the has_one association instead of searching by subaccount_code
          subaccount = user.subaccount
          if subaccount.nil?
            render json: { success: false, error: 'Subaccount not found' }, status: :not_found
            return
          end

          begin
            ActiveRecord::Base.transaction do
              # Prepare metadata
              metadata = params[:metadata] || {}
              metadata[:custom_fields] ||= []
              metadata.merge!(
                user_id: user.id,
                email: user.email,
                user_name: user.full_name
              )
              subaccount_type = metadata[:custom_fields].first[:type] rescue nil

              # First verify if subaccount exists on Paystack
              paystack_subaccount = PaystackService.new.fetch_subaccount(subaccount.subaccount_code)
              
              if paystack_subaccount.nil? || paystack_subaccount[:status] == false
                # Subaccount doesn't exist on Paystack - recreate it
                Rails.logger.info "Subaccount not found on Paystack, recreating..."
                
                create_response = PaystackService.new.create_subaccount(
                  business_name: params[:business_name],
                  settlement_bank: params[:settlement_bank],
                  account_number: params[:account_number],
                  bank_code: params[:bank_code] || params[:settlement_bank],
                  percentage_charge: params[:percentage_charge],
                  description: params[:description],
                  primary_contact_email: user.email,
                  primary_contact_name: user.full_name,
                  primary_contact_phone: user.phone_number,
                  metadata: metadata
                )

                unless create_response[:status]
                  raise StandardError, "Failed to recreate subaccount: #{create_response[:message]}"
                end

                # Update local record with new subaccount code
                subaccount.update!(
                  subaccount_code: create_response[:data][:subaccount_code],
                  business_name: params[:business_name],
                  bank_code: params[:bank_code],
                  account_number: params[:account_number],
                  percentage_charge: params[:percentage_charge],
                  description: params[:description],
                  settlement_bank: params[:settlement_bank],
                  metadata: metadata,
                  subaccount_type: subaccount_type,
                  user_id: user.id
                )
                
                # Update user's subaccount_id for backward compatibility
                user.update_columns(subaccount_id: create_response[:data][:subaccount_code])
              else
                # Subaccount exists - proceed with normal update
                response = PaystackService.new.update_subaccount(
                  subaccount_code: subaccount.subaccount_code,
                  business_name: params[:business_name],
                  settlement_bank: params[:settlement_bank],
                  account_number: params[:account_number],
                  bank_code: params[:bank_code] || params[:settlement_bank],
                  percentage_charge: params[:percentage_charge],
                  description: params[:description],
                  primary_contact_email: user.email,
                  primary_contact_name: user.full_name,
                  primary_contact_phone: user.phone_number,
                  metadata: metadata
                )

                unless response[:status] || response[:message] == 'Subaccount updated'
                  raise StandardError, response[:message] || 'Paystack update failed'
                end

                subaccount.update!(
                  business_name: params[:business_name],
                  bank_code: params[:bank_code],
                  account_number: params[:account_number],
                  percentage_charge: params[:percentage_charge],
                  description: params[:description],
                  settlement_bank: params[:settlement_bank],
                  metadata: metadata,
                  subaccount_type: subaccount_type,
                  user_id: user.id
                )
              end

              # Handle recipient code (same as before)
              if subaccount.recipient_code.blank?
                recipient_type = metadata[:custom_fields].first[:type] rescue 'nuban'
                
                create_response = PaystackService.new.create_transfer_recipient(
                  type: recipient_type,
                  name: params[:business_name],
                  account_number: params[:account_number],
                  bank_code: params[:settlement_bank],
                  currency: user.currency.upcase,
                  description: "Recipient for #{params[:business_name]}",
                  metadata: metadata
                )

                if create_response[:status] == true
                  subaccount.update!(recipient_code: create_response[:data][:recipient_code])
                else
                  raise StandardError, "Recipient creation failed: #{create_response[:message]}"
                end
              end

              render json: { success: true, subaccount: subaccount }, status: :ok
            end
          rescue StandardError => e
            Rails.logger.error "Subaccount update error: #{e.message}"
            render json: { 
              success: false, 
              error: "Subaccount update failed: #{e.message}",
              backtrace: Rails.env.development? ? e.backtrace : nil
            }, status: :unprocessable_entity
          end
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
          
          if @user.update_column(:admin, admin_status)
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

        def remove_role
          return render json: { error: 'User not found' }, status: :not_found if @user.nil?

          role = Role.find_by(name: params[:role_name])
          if role.present?
            if @user.roles.include?(role)
              @user.roles.delete(role)
              render json: { message: 'Role removed successfully.' }, status: :ok
            else
              render json: { error: 'User does not have the specified role.' }, status: :unprocessable_entity
            end
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
            render json: { error: 'Failed to delete the user.' }, status: :unprocessable_entity
          end
        end

        private

        def update_existing_subaccount(user, existing_subaccount)
          # Prepare metadata for update
          metadata = params[:subaccount][:metadata] || { custom_fields: [] }
          metadata.merge!(
            user_id: user.id,
            email: user.email,
            user_name: user.full_name
          )

          metadata[:custom_fields] = if metadata[:custom_fields]
                                      metadata[:custom_fields].map do |field|
                                        field.slice(:display_name, :variable_name, :value, :type)
                                      end
                                    else
                                      []
                                    end

          ActiveRecord::Base.transaction do
            # Update the existing subaccount on Paystack
            response = PaystackService.new.update_subaccount(
              subaccount_code: existing_subaccount.subaccount_code,
              business_name: params[:subaccount][:business_name],
              settlement_bank: params[:subaccount][:settlement_bank],
              account_number: params[:subaccount][:account_number],
              bank_code: params[:subaccount][:bank_code] || params[:subaccount][:settlement_bank],
              percentage_charge: params[:subaccount][:percentage_charge],
              description: params[:subaccount][:description],
              primary_contact_email: user.email,
              primary_contact_name: user.full_name,
              primary_contact_phone: user.phone_number,
              metadata: metadata
            )

            unless response[:status] || response[:message] == 'Subaccount updated'
              raise StandardError, response[:message] || 'Paystack update failed'
            end

            # Update the local subaccount record
            existing_subaccount.update!(
              business_name: params[:subaccount][:business_name],
              bank_code: params[:subaccount][:bank_code],
              account_number: params[:subaccount][:account_number],
              percentage_charge: params[:subaccount][:percentage_charge],
              description: params[:subaccount][:description],
              settlement_bank: params[:subaccount][:settlement_bank],
              metadata: metadata,
              subaccount_type: metadata[:custom_fields].first[:type]
            )

            # Ensure user's subaccount_id is still set correctly (for backward compatibility)
            user.update_columns(subaccount_id: existing_subaccount.subaccount_code) if user.subaccount_id != existing_subaccount.subaccount_code
          end

          render json: { 
            success: true, 
            message: 'Subaccount updated successfully',
            subaccount_code: user.subaccount_id 
          }, status: :ok
        rescue StandardError => e
          Rails.logger.error "Error during subaccount update: #{e.message}"
          render json: { success: false, error: e.message }, status: :unprocessable_entity
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
            :user_type,
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