module Api
    module V1
      module LeaderboardEntry
        class LeaderboardEntryController < ApplicationController
          before_action :authenticate_request, only: [:my_rank, :fundraiser_rank]
  
          # Fetch all leaderboard entries
          def index
            leaderboard = ::LeaderboardEntry.includes(:user).order(points: :desc).limit(10)
            leaderboard_data = leaderboard.map do |entry|
              user_points = entry.user.total_points
              level = BackerReward::LEVELS.find { |_, range| range.include?(user_points) }&.first
          
              {
                id: entry.id,
                user_id: entry.user.id,
                username: entry.user.full_name,
                total_donations: entry.user.donations.sum(:amount),
                score: entry.points,
                rank: entry.ranking,
                profile_picture: entry.user.profile.avatar_url, # Changed to avatar_url
                category_interest: entry.user.category,
                currency: entry.user.currency,
                country: entry.user.country,
                bio: entry.user.profile.description,
                level: level.to_s.capitalize # Add the level
              }
            end
            render json: leaderboard_data, status: :ok
          end          

          # fetch all leaderboard entries for fundraisers
          def fundraisers
            leaderboard_entries = ::FundraiserLeaderboardEntry.includes(:user).order(total_raised: :desc)
            leaderboard_data = leaderboard_entries.map do |entry|
              user_points = entry.user.total_points
              level = BackerReward::LEVELS.find { |_, range| range.include?(user_points) }&.first
              {
                id: entry.id,
                user_id: entry.user.id,
                username: entry.user.full_name,
                total_raised: entry.total_raised,
                rank: entry.ranking,
                profile_picture: entry.user.profile.avatar_url, # Changed to avatar_url
                category_interest: entry.user.category,
                currency: entry.user.currency,
                country: entry.user.country,
                bio: entry.user.profile.description,
                level: level.to_s.capitalize
              }
            end
            render json: leaderboard_data, status: :ok
          end

          # Fetch the leaderboard position of the authenticated user
          def fundraiser_rank
            entry = @current_user.fundraiser_leaderboard_entries.first
            if entry
              render json: {
                id: entry.id,
                user_id: entry.user.id,
                username: entry.user.full_name,
                total_raised: entry.total_raised,
                rank: entry.ranking,
                profile_picture: entry.user.profile.avatar_url, # Changed to avatar_url
                category_interest: entry.user.category,
                currency: entry.user.currency,
                country: entry.user.country,
                bio: entry.user.profile.description
              }, status: :ok
            else
              render json: { error: 'User not on fundraiser leaderboard' }, status: :not_found
            end
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
                currency: entry.user.currency,
                score: entry.points,
                rank: entry.ranking,
                profile_picture: entry.user.profile.avatar_url, # Changed to avatar_url
                }, status: :ok
            else
              render json: { error: 'User not on leaderboard' }, status: :not_found
            end
          end
        end
      end
    end
end
  