class Point < ApplicationRecord
  belongs_to :user
  belongs_to :donation, optional: true

  validates :amount, numericality: { greater_than: 0 }
  validates :reason, presence: true

  def self.add_points(user, donation)
    # Ensure the donation is associated with a logged-in user and has a positive net amount
    return unless user.present? && donation.net_amount.to_f > 0
  
    # Convert to float first, then calculate points
    net_amount = donation.net_amount.to_f
    percentage_points = (net_amount * 1.5).round.to_i
  
    # Additional check to ensure points are positive
    if percentage_points.positive?
      Point.create!(
        user: user, 
        donation: donation, 
        amount: percentage_points, 
        reason: 'Donation'
      )
      
      # Update leaderboard rankings
      LeaderboardEntry.update_leaderboard(user, user.total_points)
    else
      Rails.logger.error "Invalid points calculation for donation #{donation.id}: net_amount=#{net_amount}, calculated_points=#{percentage_points}"
    end
  rescue => e
    Rails.logger.error "Failed to add points: #{e.message}"
  end
end
