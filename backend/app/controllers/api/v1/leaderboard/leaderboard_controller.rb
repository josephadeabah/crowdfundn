module Api
  module V1
    module Leaderboard
      class LeaderboardController < ApplicationController
        def index
          leaderboard_data = LeaderboardService.fetch_weekly_leaderboard
          render json: leaderboard_data, status: :ok
        rescue StandardError => e
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
end