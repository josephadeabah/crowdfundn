module Api
  module V1
    module Fundraisers
      class RewardsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign
        before_action :set_reward, only: %i[show update destroy]
        before_action :authorize_campaign_user!, only: %i[create update destroy]

        # GET /api/v1/fundraisers/campaigns/:campaign_id/rewards
        def index
          @rewards = @campaign.rewards
          render json: @rewards, status: :ok
        end

        # GET /api/v1/fundraisers/campaigns/:campaign_id/rewards/:id
        def show
          render json: @reward, status: :ok
        end

        # POST /api/v1/fundraisers/campaigns/:campaign_id/rewards
        def create
          @reward = @campaign.rewards.new(reward_params)
          if params[:image].present?
            @reward.image.attach(params[:image])
            set_media_content_disposition(@reward.image)
          end

          if @reward.save
            render json: { message: 'Reward created successfully', reward: @reward }, status: :created
          else
            render json: { errors: @reward.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PUT /api/v1/fundraisers/campaigns/:campaign_id/rewards/:id
        def update
          if @reward.update(reward_params)
            if params[:image].present?
              @reward.image.attach(params[:image])
              set_media_content_disposition(@reward.image)
            end
            render json: @reward, status: :ok
          else
            render json: { errors: @reward.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/fundraisers/campaigns/:campaign_id/rewards/:id
        def destroy
          @reward.destroy
          head :no_content
        end

        def authorize_campaign_user!
          authorize_user!(@campaign) # Call the authorization method
        end

        private

        def set_media_content_disposition(media)
          s3 = Aws::S3::Resource.new
          object = s3.bucket(Rails.application.credentials.dig(:digitalocean, :bucket)).object(media.key)
          object.copy_from(object.bucket.name + '/' + object.key, {
                             metadata_directive: 'REPLACE',
                             content_disposition: 'inline',
                             acl: 'public-read'
                           })
        end

        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end

        def set_reward
          @reward = @campaign.rewards.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Reward not found' }, status: :not_found
        end

        def reward_params
          params.require(:reward).permit(:title, :description, :amount, :image)
        end
      end
    end
  end
end
