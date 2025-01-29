class LeaderboardEntry < ApplicationRecord
  belongs_to :user

  validates :points, numericality: { greater_than_or_equal_to: 0 }
  validates :ranking, numericality: { greater_than: 0 }, allow_nil: true

  def self.update_leaderboard(user, new_score)
    leaderboard_entry = find_or_create_by(user: user)
    leaderboard_entry.update!(points: new_score)

    recalculate_rankings
  end

  def self.recalculate_rankings
    users_ranked = LeaderboardEntry.order(points: :desc).pluck(:user_id, :points)
    users_ranked.each_with_index do |(user_id, _score), index|
      where(user_id: user_id).update_all(ranking: index + 1)
    end
  end
end
