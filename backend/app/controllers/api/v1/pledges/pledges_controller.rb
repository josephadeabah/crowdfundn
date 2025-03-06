module Api
  module V1
    module Pledges
      class PledgesController < ApplicationController
        before_action :authenticate_request
        before_action :set_pledge, only: [:destroy]

        # GET /api/v1/pledges
        def index
          # Fetch all pledges for the current user
          pledges = @current_user.pledges.includes(:campaign)

          # Group pledges by campaign
          grouped_pledges = pledges.group_by(&:campaign_id)

          # Build the response
          response = grouped_pledges.map do |campaign_id, campaign_pledges|
            {
              campaign_id: campaign_id,
              campaign_name: campaign_pledges.first.campaign.title, # Assuming Campaign has a `title` field
              pledges: campaign_pledges.map do |pledge|
                {
                  id: pledge.id,
                  donation_id: pledge.donation_id,
                  reward_id: pledge.reward_id,
                  amount: pledge.amount,
                  status: pledge.status,
                  shipping_status: pledge.shipping_status,
                  created_at: pledge.created_at,
                  shipping_data: pledge.shipping_data,
                  delivery_option: pledge.delivery_option,
                  selected_rewards: pledge.selected_rewards
                }
              end
            }
          end

          render json: response, status: :ok
        end

        # DELETE /api/v1/pledges/:id
        def destroy
          # Ensure the pledge belongs to the current user
          if @pledge.user_id == @current_user.id
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