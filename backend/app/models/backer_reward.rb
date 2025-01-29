class BackerReward < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :level, presence: true
  validates :points_required, numericality: { greater_than_or_equal_to: 0 }
  validates :description, presence: true

  def self.assign_reward(user)
    user_points = user.total_points
    reward = BackerReward.where('points_required <= ?', user_points).order(points_required: :desc).first
    user.backer_rewards << reward if reward
  end
end
