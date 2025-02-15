class Point < ApplicationRecord
  belongs_to :user
  belongs_to :donation, optional: true

  validates :amount, numericality: { greater_than: 0 }
  validates :reason, presence: true

  def self.add_points(user, donation)
    return unless user && donation.net_amount > 0
  
    percentage_points = (donation.net_amount * 1.5).to_i
  
    # Ensure points are greater than 0 before creating the record
    if percentage_points > 0
      Point.create!(user: user, donation: donation, amount: percentage_points, reason: "Donation")
  
      # ✅ Update leaderboard rankings
      LeaderboardEntry.update_leaderboard(user, user.total_points)
    else
      Rails.logger.info "Attempted to add invalid points (zero or negative) for user #{user.id}, donation #{donation.id}. Points: #{percentage_points}"
    end
  end  
end
