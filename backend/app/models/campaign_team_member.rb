# app/models/campaign_team_member.rb
class CampaignTeamMember < ApplicationRecord
  belongs_to :campaign
  belongs_to :user
  
  ROLES = %w[founder advisor employee].freeze
  validates :role, inclusion: { in: ROLES }
  validates :equity_percentage, numericality: { greater_than_or_equal_to: 0 }
  validates :title, presence: true
  
  # Ensure founder equity doesn't exceed available equity
  validate :founder_equity_limit
  
  private
  
  def founder_equity_limit
    return unless role == 'founder' && equity_percentage.present?
    return unless campaign.is_a?(EquityCampaign)

    available_equity = 100 - campaign.equity_offered.to_f
    if equity_percentage > available_equity
      errors.add(:equity_percentage, "cannot exceed #{available_equity}% for founders")
    end
  end
end