class CampaignShare < ApplicationRecord
  belongs_to :user, optional: true # Allows anonymous shares
  belongs_to :campaign

  # Validation to ensure a user can only share a campaign once
  validates :user_id, uniqueness: { scope: :campaign_id, message: "You can only share a campaign once." }, if: -> { user.present? }

  after_create :award_share_points

  private

  def award_share_points
    points = 0.01 # Customize points per share
    user.points.create!(amount: points, reason: "Shared Campaign #{campaign.title}")
  end
end
