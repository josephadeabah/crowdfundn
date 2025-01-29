module Api
    module V1
      module LeaderboardEntry
        class LeaderboardEntryController < ApplicationController
          before_action :authenticate_request!, only: [:my_rank]
  
          # Fetch all leaderboard entries
          def index
            leaderboard = ::LeaderboardEntry.includes(:user).order(points: :desc).limit(10)
            leaderboard_data = leaderboard.map do |entry|
              {
                id: entry.id,
                user_id: entry.user.id,
                username: entry.user.full_name,
                total_donations: entry.user.donations.sum(:amount),
                score: entry.points,
                profile_picture: entry.user.profile.description,
                category_interest: entry.user.category,
                country: entry.user.country,
                bio: entry.user.profile.description
              }
            end
            render json: leaderboard_data, status: :ok
          end
  
          # Fetch the leaderboard position of the authenticated user
          def my_rank
            entry = @current_user.leaderboard_entries.first
            if entry
              render json: {
                id: entry.id,
                user_id: entry.user.id,
                username: entry.user.full_name,
                total_donations: entry.user.donations.sum(:amount),
                score: entry.points,
                rank: entry.ranking,
                profile_picture: entry.user.profile.description
              }, status: :ok
            else
              render json: { error: 'User not on leaderboard' }, status: :not_found
            end
          end
        end
      end
    end
end
  