module Api
  module V1
    module Fundraisers
      class UpdatesController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign
        before_action :set_update, only: %i[update destroy]
        before_action :authorize_campaign_user!, only: %i[create update destroy]

        def create
          update = @campaign.updates.new(update_params)
          if update.save
            render json: update, status: :created
          else
            render json: { errors: update.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @update.update(update_params)
            render json: @update, status: :ok
          else
            render json: { errors: @update.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @update.destroy
          head :no_content
        end

        def authorize_campaign_user!
          authorize_user!(@campaign) # Call the authorization method
        end

        private

        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        end

        def set_update
          @update = @campaign.updates.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Update not found' }, status: :not_found
        end

        def update_params
          params.require(:update).permit(:content)
        end
      end
    end
  end
end
