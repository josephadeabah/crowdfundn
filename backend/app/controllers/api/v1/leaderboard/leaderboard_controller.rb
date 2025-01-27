module Api
  module V1
    module Leaderboard
      class LeaderboardController < ApplicationController
        # before_action :authenticate_request, only: %i[]
        
        def top_backers
          top_backers = User.joins(:donations)
                            .select(
                              'users.*, SUM(donations.amount) as total_amount'
                            )
                            .group('users.id')
                            .order('total_amount DESC')
                            .limit(7)
  
          render json: top_backers.map { |user| serialize_backer(user) }
        end
  
        def most_active_backers
          most_active_backers = User.joins(:donations)
                                    .select(
                                      'users.*, COUNT(donations.id) as total_contributions'
                                    )
                                    .group('users.id')
                                    .order('total_contributions DESC')
                                    .limit(6)
  
          render json: most_active_backers.map { |user| serialize_active_backer(user) }
        end
  
        def top_backers_with_rewards
          top_backers_with_rewards = User.joins(:donations)
                                         .select(
                                           'users.*, COUNT(donations.reward_id) as rewards'
                                         )
                                         .group('users.id')
                                         .order('rewards DESC')
                                         .limit(5)
  
          render json: top_backers_with_rewards.map { |user| serialize_backer_with_rewards(user) }
        end
  
        def top_fundraisers_graphics
          top_fundraisers_graphics = User.joins(:campaigns)
                                         .select('users.*, campaigns.title as campaign_name')
                                         .group('users.id, campaigns.id')
                                         .order('campaigns.created_at DESC')
                                         .limit(5)
  
          render json: top_fundraisers_graphics.map { |user| serialize_fundraiser(user) }
        end
  
        def top_fundraisers_stories
          top_fundraisers_stories = User.joins(:campaigns)
                                        .select('users.*, campaigns.title as campaign_name')
                                        .group('users.id, campaigns.id')
                                        .order('campaigns.created_at DESC')
                                        .limit(6)
  
          render json: top_fundraisers_stories.map { |user| serialize_fundraiser(user) }
        end
  
        private
  
        def serialize_backer(user)
          {
            name: user.full_name,
            amount: "$#{user.total_amount.to_i}",
            # avatar: user.avatar_url,
            category_interest: user.category,
            country: user.country,
            bio: user.profile.description
          }
        end
  
        def serialize_active_backer(user)
          {
            name: user.full_name,
            contributions: user.total_contributions,
            # avatar: user.avatar_url,
            categoryInterest: user.category,
            country: user.country,
            bio: user.profile.description
          }
        end
  
        def serialize_backer_with_rewards(user)
          {
            name: user.full_name,
            rewards: user.rewards,
            # avatar: user.avatar_url,
            categoryInterest: user.category,
            country: user.country,
            bio: user.profile.description
          }
        end
  
        def serialize_fundraiser(user)
          {
            name: user.full_name,
            campaign: user.campaign_name,
            # avatar: user.avatar_url,
            categoryInterest: user.category,
            country: user.country,
            bio: user.profile.description
          }
        end
      end
    end
  end
end
