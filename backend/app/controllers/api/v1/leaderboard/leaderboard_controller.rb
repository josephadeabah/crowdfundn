module Api
  module V1
    module Leaderboard
      class LeaderboardController < ApplicationController
        def index
          leaderboard = LeaderboardService.fetch_weekly_leaderboard
          render json: leaderboard, status: :ok
        end
      end
    end
  end
end
