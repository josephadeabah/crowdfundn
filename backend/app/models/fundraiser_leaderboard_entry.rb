class FundraiserLeaderboardEntry < ApplicationRecord
  belongs_to :user

  validates :total_raised, numericality: { greater_than_or_equal_to: 0 }
  validates :ranking, numericality: { greater_than: 0 }, allow_nil: true

  # Updates the leaderboard when a campaign raises money
  def self.update_leaderboard(user, total_raised)
    leaderboard_entry = find_or_create_by(user: user)
    leaderboard_entry.update!(total_raised: total_raised)

    recalculate_rankings
  end

  # Recalculate the rankings after a donation is made
  def self.recalculate_rankings
    fundraisers_ranked = FundraiserLeaderboardEntry.order(total_raised: :desc).pluck(:user_id, :total_raised)
    fundraisers_ranked.each_with_index do |(user_id, _total_raised), index|
      where(user_id: user_id).update_all(ranking: index + 1)
    end
  end
end
