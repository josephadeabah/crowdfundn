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

    # Remove any existing active reward the user may have
    user.backer_rewards.destroy_all

    # Create and assign the reward with points_required set to user's current points
    user.backer_rewards.create!(
      campaign: user.campaigns.first,  # Assuming we associate it with the first campaign
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "BHC: #{user_points * 10} coins"
    )
  end
end
