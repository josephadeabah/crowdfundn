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

  def equity_campaign
    campaign.is_a?(EquityCampaign) ? campaign : nil
  end
  
  private
  
  def founder_equity_limit
    if role == 'founder' && equity_percentage.present? && equity_campaign.present?
      available_equity = 100 - equity_campaign.equity_offered.to_f
      if equity_percentage > available_equity
        errors.add(:equity_percentage, "cannot exceed #{available_equity}% for founders")
      end
    end
  end
end