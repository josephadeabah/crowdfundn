module Api
    module V1
      module Members
        class ProfilesController < ApplicationController
          before_action :authenticate_request, only: [:update]
          before_action :set_profile, only: [:update]
  
          # PUT /api/v1/members/profiles/:id
          def update
            if @profile.update(profile_params)
              render json: { message: 'Profile updated successfully', profile: @profile }, status: :ok
            else
              render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity
            end
          end
  
          private
  
          def set_profile
            @profile = @current_user.profile
            unless @profile
              render json: { error: 'Profile not found' }, status: :not_found
            end
          end
  
          def profile_params
            params.require(:profile).permit(:name, :description, :funding_goal, :amount_raised, :status, :end_date, :category, :location, :currency, :currency_code, :currency_symbol)
          end
        end
      end
    end
end
  