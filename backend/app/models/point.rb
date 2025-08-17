class Point < ApplicationRecord
  belongs_to :user
  belongs_to :donation, optional: true
  belongs_to :equity_investment, optional: true  # Add this line

  validates :amount, numericality: { greater_than: 0 }
  validates :reason, presence: true

  def self.add_points(user, donation_or_investment)
    if donation_or_investment.is_a?(Donation)
      add_donation_points(user, donation_or_investment)
    elsif donation_or_investment.is_a?(EquityInvestment)
      add_investment_points(user, donation_or_investment)
    end
  end

  private

  def self.add_donation_points(user, donation)
    return unless user.present? && donation.net_amount.to_f > 0

    net_amount = donation.net_amount.to_f
    percentage_points = (net_amount * 1.5).round.to_i

    if percentage_points.positive?
      Point.create!(
        user: user,
        donation: donation,
        amount: percentage_points,
        reason: 'Donation'
      )
      LeaderboardEntry.update_leaderboard(user, user.total_points)
    end
  rescue StandardError => e
    Rails.logger.error "Failed to add donation points: #{e.message}"
  end

  def self.add_investment_points(user, investment)
    return unless user.present? && investment.amount.to_f > 0

    percentage_points = (investment.amount.to_f * 2).round.to_i

    if percentage_points.positive?
      Point.create!(
        user: user,
        equity_investment: investment,
        amount: percentage_points,
        reason: 'Investment'
      )
      LeaderboardEntry.update_leaderboard(user, user.total_points)
    end
  rescue StandardError => e
    Rails.logger.error "Failed to add investment points: #{e.message}"
  end
end