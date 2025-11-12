# app/models/member_investment_share.rb
class MemberInvestmentShare < ApplicationRecord
  belongs_to :user
  belongs_to :club_investment
  
  validates :user_id, uniqueness: { scope: :club_investment_id }
  validates :share_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :effective_shares, numericality: { greater_than_or_equal_to: 0 }
  
  before_save :calculate_investment_amount
  
  def invested_amount
    (share_percentage / 100) * club_investment.investment_amount.to_f
  end
  
  def current_value
    return 0 unless club_investment.executed?
    
    if club_investment.campaign.is_a?(EquityCampaign)
      campaign = club_investment.campaign
      (effective_shares / campaign.total_shares.to_f) * campaign.valuation
    else
      invested_amount
    end
  end
  
  def total_return
    current_value - invested_amount
  end
  
  def roi
    return 0 if invested_amount.zero?
    (total_return / invested_amount) * 100
  end
  
  private
  
  def calculate_investment_amount
    return unless club_investment && share_percentage_changed?
    
    self.investment_amount = invested_amount
  end
end