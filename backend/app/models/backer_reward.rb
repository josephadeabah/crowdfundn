class BackerReward < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :description, presence: true

  LEVELS = {
    bronze: 0..99,
    silver: 100..499,
    gold: 500..999,
    diamond: 1000..Float::INFINITY
  }.freeze

  def self.assign_reward(user)
    user_points = user.total_points

    # Find the highest reward level the user qualifies for
    reward_level = LEVELS.select { |_, range| range.include?(user_points) }.keys.last
    return unless reward_level

    # Check if the user already has the highest reward they qualify for
    existing_reward = user.backer_rewards.find_by(level: reward_level.to_s.capitalize)
    return if existing_reward

    # Create and assign the reward with points_required set to user's current points
    reward = user.backer_rewards.create!(
      campaign: user.campaigns.first,  # Assuming we associate it with the first campaign
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "You have reached #{reward_level.to_s.capitalize} level with #{user_points} points!"
    )
    user.backer_rewards << reward
  end
end
