class BackerReward < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :points_required, numericality: { greater_than_or_equal_to: 0 }
  validates :description, presence: true

  LEVELS = {
    bronze: 0..99,
    silver: 100..499,
    gold: 500..999,
    diamond: 1000..Float::INFINITY
  }.freeze

  def level
    LEVELS.each do |name, range|
      return name.to_s.capitalize if range.include?(points_required)
    end
    "Unknown"
  end

  def self.assign_reward(user)
    user_points = user.total_points
    reward = BackerReward.where('points_required <= ?', user_points).order(points_required: :desc).first
    user.backer_rewards << reward if reward
  end
end
