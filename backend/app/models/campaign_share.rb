class CampaignShare < ApplicationRecord
  belongs_to :user, optional: true # Allows anonymous shares
  belongs_to :campaign

  validates :user_id, uniqueness: { scope: :campaign_id, message: "You can only share a campaign once." }, if: -> { user.present? }

  # after_create :award_share_points

  # private

  # def award_share_points
  #   return unless user.present?

  #   # Award points for sharing
  #   points = 0.25
  #   user.points.create!(amount: points, reason: "Shared Campaign #{campaign.title}")

  #   # ✅ Update leaderboard rankings
  #   LeaderboardEntry.update_leaderboard(user, user.total_points)
  # end
end
