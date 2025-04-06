# app/models/campaign_partnership.rb
class CampaignPartnership < ApplicationRecord
  belongs_to :campaign
  belongs_to :partner

  enum status: {
    pending: 'pending',
    accepted: 'accepted',
    declined: 'declined',
    ended: 'ended'
  }

  validates :commission_rate, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end