class BackerReward < ApplicationRecord
  belongs_to :user

  validates :description, presence: true

  LEVELS = {
    bronze: 100..499,
    silver: 500..999,
    gold: 1000..1999,
    diamond: 2000..Float::INFINITY
  }.freeze

  def self.assign_reward(user)
    user_points = user.total_points

    # Find the highest reward level the user qualifies for, or nil if not in range
    reward_level = LEVELS.find { |_, range| range.include?(user_points) }&.first

    # Remove any existing active reward the user may have
    user.backer_rewards.destroy_all

    # If no reward level is found, do not create a reward
    return unless reward_level

    # Create and assign the reward with points_required set to user's current points
    user.backer_rewards.create!(
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "BHC: #{user_points * 10} coins"
    )
  end
end
