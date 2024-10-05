module Api
  module V1
    module Members
      class RolesController < ApplicationController
        before_action :authenticate_request
        before_action :authorize_admin, only: [:create]

        # Endpoint to create a new role
        def create
          role = Role.new(role_params)
          if role.save
            render json: { message: 'Role created successfully', role: role }, status: :created
          else
            render json: { errors: role.errors.full_messages }, status: :unprocessable_entity
          end
        end

        private

        def role_params
          params.require(:role).permit(:name, :description)
        end
      end
    end
  end
end
