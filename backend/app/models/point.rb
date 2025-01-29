class Point < ApplicationRecord
  belongs_to :user
  belongs_to :donation

  validates :amount, numericality: { greater_than: 0 }
  validates :reason, presence: true

  def self.add_points(user, donation)
    return unless user
  
    percentage_points = (donation.net_amount * 10).to_i
    Point.create!(user: user, donation: donation, amount: percentage_points, reason: "Donation")
  
    # ✅ Update leaderboard rankings
    LeaderboardEntry.update_leaderboard(user, user.total_points)
  end
end
