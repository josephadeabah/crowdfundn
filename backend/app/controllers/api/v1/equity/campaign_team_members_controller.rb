# app/controllers/api/v1/equity/campaign_team_members_controller.rb
module Api
  module V1
    module Equity
      class CampaignTeamMembersController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign
        before_action :authorize_campaign_user!
        before_action :set_team_member, only: [:update, :destroy]

        def index
          @team_members = @campaign.campaign_team_members.includes(:user)
          render json: team_members_json(@team_members), status: :ok
        end

        def create
          @team_member = @campaign.campaign_team_members.new(team_member_params)
          @team_member.avatar.attach(params[:avatar]) if params[:avatar].present?

          if @team_member.save
            render json: team_member_json(@team_member), status: :created
          else
            render json: { errors: @team_member.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def update
          if @team_member.update(team_member_params)
            @team_member.avatar.attach(params[:avatar]) if params[:avatar].present?
            render json: team_member_json(@team_member), status: :ok
          else
            render json: { errors: @team_member.errors.full_messages }, status: :unprocessable_entity
          end
        end

        def destroy
          @team_member.destroy
          head :no_content
        end

        private

        def set_campaign
          @campaign = EquityCampaign.find(params[:campaign_id])
        end

        def set_team_member
          @team_member = @campaign.campaign_team_members.find(params[:id])
        end

        def authorize_campaign_user!
          render json: { error: 'Unauthorized' }, status: :unauthorized unless @campaign.fundraiser == @current_user
        end

        def team_member_params
          params.require(:campaign_team_member).permit(
            :user_id, 
            :role, 
            :title, 
            :equity_percentage,
            :description
          )
        end

        def team_member_json(team_member)
          team_member.as_json(
            only: %i[id user_id role title equity_percentage description created_at updated_at],
            methods: [:avatar_url]
          ).merge(
            user: team_member.user.as_json(
              only: %i[id email],
              include: { profile: { only: %i[first_name last_name] } }
            )
          )
        end

        def team_members_json(team_members)
          team_members.map { |tm| team_member_json(tm) }
        end
      end
    end
  end
end