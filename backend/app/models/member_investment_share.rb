# app/models/member_investment_share.rb
class MemberInvestmentShare < ApplicationRecord
  belongs_to :user
  belongs_to :club_investment
  
  validates :user_id, uniqueness: { scope: :club_investment_id }
  validates :share_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :effective_shares, numericality: { greater_than_or_equal_to: 0 }
  
  before_save :calculate_investment_amount
  
  # Simple helper method - complex calculations delegated to ClubPortfolioService
  def invested_amount
    (share_percentage / 100) * club_investment.investment_amount.to_f
  end
  
  # Delegate complex valuation to ClubPortfolioService
  def current_value
    return 0 unless club_investment.executed?
    
    portfolio_service = ClubPortfolioService.new(club_investment.investment_club)
    portfolio_service.calculate_member_share_value(self)
  end
  
  private
  
  def calculate_investment_amount
    return unless club_investment && share_percentage_changed?
    
    self.investment_amount = invested_amount
  end
end