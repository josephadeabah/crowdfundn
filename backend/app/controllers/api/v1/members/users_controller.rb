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

        def show_by_id
          render json: @user.as_json(include: %i[profile roles]), status: :ok
        end

        def create_subaccount
          user = User.find(params[:user_id])
          raise 'User not found' unless user

          # Validate if this is a mobile money account (not supported for subaccounts)
          if mobile_money_account?(params[:subaccount][:settlement_bank])
            render json: { 
              success: false, 
              error: 'Mobile money accounts are not supported for receiving payments. Please use a bank account instead.' 
            }, status: :unprocessable_entity
            return
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
            # Check if user already has a subaccount in our database
            existing_subaccount = user.subaccount
            
            if existing_subaccount.present?
              # User has a subaccount record locally - check if it exists on Paystack
              paystack_subaccount = PaystackService.new.fetch_subaccount(existing_subaccount.subaccount_code)
              
              if paystack_subaccount.nil? || paystack_subaccount[:status] == false
                # Subaccount doesn't exist on Paystack - delete the local record and create fresh
                Rails.logger.info "Subaccount #{existing_subaccount.subaccount_code} not found on Paystack, deleting local record and creating new one"
                existing_subaccount.destroy!
                create_fresh_subaccount(user, metadata)
              else
                # Subaccount exists on Paystack - update it
                update_existing_subaccount_on_paystack(user, existing_subaccount, metadata)
              end
            else
              # User has no subaccount at all - create fresh
              create_fresh_subaccount(user, metadata)
            end
          end

          # Reload the user to get the updated subaccount
          user.reload
          
          render json: { 
            success: true, 
            subaccount_code: user.subaccount_id,
            message: 'Subaccount processed successfully'
          }, status: :ok
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

          subaccount = user.subaccount
          if subaccount.nil?
            render json: { success: false, error: 'Subaccount not found' }, status: :not_found
            return
          end

          begin
            # Validate if this is a mobile money account (not supported for subaccounts)
            if mobile_money_account?(params[:settlement_bank])
              render json: { 
                success: false, 
                error: 'Mobile money accounts are not supported for receiving payments. Please use a bank account instead.' 
              }, status: :unprocessable_entity
              return
            end

            ActiveRecord::Base.transaction do
              # Store old account details to check if recipient code needs to be cleared
              old_account_number = subaccount.account_number
              old_bank_code = subaccount.bank_code
              old_settlement_bank = subaccount.settlement_bank

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
                  user_id: user.id,
                  recipient_code: nil # Clear recipient code since account changed
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

                # Check if account details changed - the before_save callback will handle recipient deletion
                account_changed = (old_account_number != params[:account_number]) ||
                                (old_bank_code != params[:bank_code]) ||
                                (old_settlement_bank != params[:settlement_bank])

                update_attributes = {
                  business_name: params[:business_name],
                  bank_code: params[:bank_code],
                  account_number: params[:account_number],
                  percentage_charge: params[:percentage_charge],
                  description: params[:description],
                  settlement_bank: params[:settlement_bank],
                  metadata: metadata,
                  subaccount_type: subaccount_type,
                  user_id: user.id
                }

                # If account changed, recipient code will be cleared by the before_save callback
                # If account didn't change but we want to ensure recipient matches, we can keep existing recipient
                unless account_changed
                  # Verify the existing recipient still matches current account details
                  if subaccount.recipient_code.present?
                    recipient_response = PaystackService.new.fetch_transfer_recipient(subaccount.recipient_code)
                    unless recipient_response[:status]
                      # Recipient is invalid, clear it so a new one gets created
                      update_attributes[:recipient_code] = nil
                    end
                  end
                end

                subaccount.update!(update_attributes)
              end

              # Always create a new recipient code after subaccount update to ensure consistency
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
                  Rails.logger.info "New recipient code created: #{create_response[:data][:recipient_code]}"
                else
                  raise StandardError, "Recipient creation failed: #{create_response[:message]}"
                end
              end

              render json: { 
                success: true, 
                subaccount: subaccount,
                recipient_code: subaccount.recipient_code,
                message: 'Subaccount updated successfully with new recipient code'
              }, status: :ok
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

        # Check if the bank code is for mobile money (not supported for subaccounts)
        def mobile_money_account?(bank_code)
          mobile_money_codes = ['MTN', 'VOD', 'TGO'] # MTN, Vodafone, AirtelTigo
          mobile_money_codes.include?(bank_code)
        end

        def create_fresh_subaccount(user, metadata)
          # Extract bank code from metadata for Ghanaian banks
          bank_code = extract_bank_code_for_subaccount(metadata, params[:subaccount][:settlement_bank])
          
          # Create a new subaccount via Paystack
          response = PaystackService.new.create_subaccount(
            business_name: params[:subaccount][:business_name],
            settlement_bank: params[:subaccount][:settlement_bank],
            account_number: params[:subaccount][:account_number],
            bank_code: bank_code,
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
            bank_code: bank_code,
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

          # Create transfer recipient immediately after subaccount creation
          create_recipient_for_subaccount(subaccount, user)
          
          Rails.logger.info "Fresh subaccount created: #{subaccount.subaccount_code}"
        end

        def create_recipient_for_subaccount(subaccount, user)
          metadata = subaccount.metadata || {}
          custom_fields = metadata['custom_fields'] || []

          bank_code_value = extract_bank_code_for_recipient(custom_fields, subaccount.bank_code, subaccount.settlement_bank)

          return if bank_code_value.blank?

          recipient_type = subaccount.subaccount_type || 'nuban'

          recipient_metadata = {
            user_id: user.id,
            email: user.email,
            user_name: user.full_name,
            subaccount_code: subaccount.subaccount_code,
            metadata: metadata
          }

          response = PaystackService.new.create_transfer_recipient(
            type: recipient_type,
            name: subaccount.business_name,
            account_number: subaccount.account_number,
            bank_code: bank_code_value,
            currency: user.currency.upcase,
            description: "Recipient for #{subaccount.business_name}",
            metadata: recipient_metadata
          )

          if response[:status] == true
            subaccount.update!(recipient_code: response.dig(:data, :recipient_code))
            Rails.logger.info "Recipient created for subaccount: #{response.dig(:data, :recipient_code)}"
          else
            Rails.logger.error "Failed to create recipient for subaccount: #{response[:message]}"
            # Don't raise error here - we can still proceed without recipient for now
          end
        end

        def update_existing_subaccount_on_paystack(user, existing_subaccount, metadata)
          # Extract bank code from metadata for Ghanaian banks
          bank_code = extract_bank_code_for_subaccount(metadata, params[:subaccount][:settlement_bank])
          
          # Update the existing subaccount on Paystack
          response = PaystackService.new.update_subaccount(
            subaccount_code: existing_subaccount.subaccount_code,
            business_name: params[:subaccount][:business_name],
            settlement_bank: params[:subaccount][:settlement_bank],
            account_number: params[:subaccount][:account_number],
            bank_code: bank_code,
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

          # Store old account details
          old_account_number = existing_subaccount.account_number
          old_bank_code = existing_subaccount.bank_code
          old_settlement_bank = existing_subaccount.settlement_bank

          # Check if account details changed and clear recipient code if they did
          account_changed = (old_account_number != params[:subaccount][:account_number]) ||
                          (old_bank_code != bank_code) ||
                          (old_settlement_bank != params[:subaccount][:settlement_bank])

          update_attributes = {
            business_name: params[:subaccount][:business_name],
            bank_code: bank_code,
            account_number: params[:subaccount][:account_number],
            percentage_charge: params[:subaccount][:percentage_charge],
            description: params[:subaccount][:description],
            settlement_bank: params[:subaccount][:settlement_bank],
            metadata: metadata,
            subaccount_type: metadata[:custom_fields].first[:type]
          }

          # Clear recipient code if account details changed
          if account_changed && existing_subaccount.recipient_code.present?
            update_attributes[:recipient_code] = nil
            Rails.logger.info "Account details changed - clearing recipient code"
          end

          # Update the local subaccount record
          existing_subaccount.update!(update_attributes)

          # Create new recipient code if it was cleared or doesn't exist
          if existing_subaccount.recipient_code.blank?
            create_recipient_for_subaccount(existing_subaccount, user)
          end

          Rails.logger.info "Existing subaccount updated: #{existing_subaccount.subaccount_code}"
        end

        # Helper method to extract bank code for subaccount creation
        def extract_bank_code_for_subaccount(metadata, settlement_bank)
          custom_fields = metadata[:custom_fields] || []
          ghipss_field = custom_fields.find { |field| field[:type] == 'ghipss' }
          
          # For Ghanaian banks with GHIPSS, use the settlement_bank directly
          # For other countries, use the bank_code from custom fields or settlement_bank
          if ghipss_field.present?
            settlement_bank
          else
            params[:subaccount][:bank_code] || settlement_bank
          end
        end

        # Helper method to extract bank code for recipient creation
        def extract_bank_code_for_recipient(custom_fields, bank_code, settlement_bank)
          ghipss_field = custom_fields.find { |field| field['type'] == 'ghipss' }
          
          if ghipss_field.present?
            # For Ghanaian GHIPSS banks, use the value from custom fields
            ghipss_field['value']
          else
            # For other banks, use bank_code or settlement_bank
            bank_code || settlement_bank
          end
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