# app/models/archived_campaign.rb
class ArchivedCampaign < ApplicationRecord
  belongs_to :user
  belongs_to :campaign

  validates :user_id, uniqueness: { scope: :campaign_id, message: "has already archived this campaign" }

  before_create :set_archived_at

  private

  def set_archived_at
    self.archived_at ||= Time.current
  end
end