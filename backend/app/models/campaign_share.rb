class CampaignShare < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  after_create :award_share_points

  private

  def award_share_points
    points = 0.01 # Customize points per share
    user.points.create!(amount: points, reason: "Shared Campaign #{campaign.title}")
  end
end
