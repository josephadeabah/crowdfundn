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

    # Determine the correct level based on user points
    reward_level = LEVELS.find { |_, range| range.include?(user_points) }&.first
    return unless reward_level

    # Check if user already has a reward at this level
    existing_reward = user.backer_rewards.find_by(level: reward_level.to_s.capitalize)
    return if existing_reward

    # Create and assign the new reward with points_required set to user's current points
    reward = BackerReward.create!(
      user: user,
      campaign: user.campaigns.first, # Assuming we associate it with the first campaign
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "You have reached #{reward_level.to_s.capitalize} level with #{user_points} points!"
    )

    user.backer_rewards << reward
  end
end
