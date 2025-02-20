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
    return if user.nil? || user.id.nil? # Skip anonymous users
  
    user_points = user.total_points
  
    reward_level = LEVELS.find { |_, range| range.include?(user_points) }&.first
  
    user.backer_rewards.destroy_all
  
    return unless reward_level
  
    user.backer_rewards.create!(
      level: reward_level.to_s.capitalize,
      points_required: user_points,
      description: "BHC: #{user_points * 10} coins"
    )
  end  
end
