module Api
  module V1
    module Leaderboard
      class LeaderboardController < ApplicationController
        before_action :authenticate_request, only: %i[index]
        
        def index
          leaderboard_data = LeaderboardService.fetch_weekly_leaderboard(@current_user)  # Pass @current_user here
          render json: leaderboard_data, status: :ok
        rescue StandardError => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
end
