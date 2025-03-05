module Api
  module V1
    module Pledges
      class PledgesController < ApplicationController
        before_action :authenticate_request
        before_action :set_pledge, only: [:destroy]

        # GET /api/v1/pledges
        def index
          # Fetch all pledges for the current user
          pledges = @current_user.pledges
          render json: pledges, status: :ok
        end

        # DELETE /api/v1/pledges/:id
        def destroy
          # Ensure the pledge belongs to the current user
          if @pledge.fundraiser_id == @current_user.id
            if @pledge.destroy
              render json: { message: 'Pledge deleted successfully' }, status: :ok
            else
              render json: { error: 'Failed to delete pledge' }, status: :unprocessable_entity
            end
          else
            render json: { error: 'You are not authorized to delete this pledge' }, status: :forbidden
          end
        end

        private

        # Set the pledge for the destroy action
        def set_pledge
          @pledge = Pledge.find_by(id: params[:id])
          if @pledge.nil?
            render json: { error: 'Pledge not found' }, status: :not_found
          end
        end
      end
    end
  end
end