module Api
  module V1
    module Members
      class ProfilesController < ApplicationController
        before_action :authenticate_request, only: [:update]
        before_action :set_profile, only: [:update]

        # PUT /api/v1/members/profiles/:id
        def update
          avatar = if params[:profile].present?
                     params[:profile][:avatar] || params[:avatar]
                   else
                     params[:avatar] # Handle direct upload case
                   end

          @profile.avatar.attach(avatar) if avatar.present?

          if @profile.update(profile_params)
            render json: { message: 'Profile updated successfully', profile: @profile.as_json }, status: :ok
          else
            render json: { errors: @profile.errors.full_messages }, status: :unprocessable_entity
          end
        end


        private

        def set_profile
          @profile = @current_user.profile
          return if @profile

          render json: { error: 'Profile not found' }, status: :not_found
        end

        def profile_params
          params.require(:profile).permit(:name, :description, :funding_goal, :amount_raised, :status, :end_date,
                                          :category, :location, :avatar)
        end
      end
    end
  end
end
