class BackerReward < ApplicationRecord
  belongs_to :user

  validates :description, presence: true

  LEVELS = {
    bronze: 100..499,  # Changed to start from 100
    silver: 500..999,  # Changed to start from 500
    gold: 1000..1999,  # Adjusted range to follow the pattern
    diamond: 2000..Float::INFINITY # Diamond starts from 2000
  }.freeze

  def self.assign_reward(user)
    user_points = user.total_points

    # Find the highest reward level the user qualifies for
    reward_level = LEVELS.select { |_, range| range.include?(user_points) }.keys.last
    return unless reward_level

    # Remove any existing active reward the user may have
    user.backer_rewards.destroy_all

    # Create and assign the reward with points_required set to user's current points
    user.backer_rewards.create!(
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "BHC: #{user_points * 10} coins"
    )
  end
end
