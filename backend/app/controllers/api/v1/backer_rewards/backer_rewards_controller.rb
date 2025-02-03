module Api
    module V1
      module BackerRewards
        class BackerRewardsController < ApplicationController
          before_action :authenticate_request, only: [:my_reward]
  
          # Fetch available rewards (public access)
          def index
            rewards = BackerReward.all
            rewards_data = rewards.map do |reward|
              {
                id: reward.id,
                level: reward.level,                # Level of the reward (e.g., Bronze, Silver, Gold)
                points_required: reward.points_required,  # Points required to claim this reward
                description: reward.description      # Description of the reward
              }
            end
            render json: rewards_data, status: :ok
          end
  
          # Fetch user’s assigned reward (requires authentication)
          def my_reward
            reward = @current_user.backer_rewards.order(points_required: :desc, created_at: :desc).first
            if reward
              render json: {
                id: reward.id,
                level: reward.level,                
                points_required: reward.points_required,  
                description: reward.description,     
                status: "Claimed"
              }, status: :ok
            else
              render json: { message: 'No rewards assigned yet' }, status: :ok
            end
          end          
        end
      end
    end
end
  