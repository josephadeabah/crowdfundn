# app/models/investment_club_membership.rb
class InvestmentClubMembership < ApplicationRecord
  belongs_to :user
  belongs_to :investment_club
  has_many :member_investment_shares, dependent: :destroy
  has_many :club_investments, through: :member_investment_shares
  
  validates :user_id, uniqueness: { scope: :investment_club_id }
  
  enum role: { member: 'member', admin: 'admin', creator: 'creator' }
  enum status: { pending: 'pending', active: 'active', inactive: 'inactive' }
  
  before_create :set_initial_share
  after_save :update_club_financials, if: -> { saved_change_to_total_contributed? }
  after_save :update_club_members_count, if: -> { saved_change_to_status? }
  after_destroy :update_club_members_count
  
  scope :active, -> { where(status: 'active') }
  scope :admin, -> { where(role: ['admin', 'creator']) }
  scope :pending, -> { where(status: 'pending') }
  
  def update_share_percentage
    return if investment_club.total_contributions.zero?
    
    new_share = (total_contributed / investment_club.total_contributions) * 100
    update_column(:current_share, new_share.round(4))
  end
  
  def can_vote?
    active? && investment_club.active?
  end
  
  def can_contribute?
    active? && investment_club.active?
  end
  
  def can_manage?
    admin? || creator?
  end
  
  def total_investment_value
    member_investment_shares.sum do |share|
      share.club_investment.executed? ? share.investment_value : 0
    end
  end

  def portfolio_summary
    ClubPortfolioService.new(investment_club).member_portfolio(user)
  end
  
  def total_investment_value
    portfolio_summary[:current_value] || 0
  end
  
  # Simple method that doesn't duplicate complex logic
  def estimated_share_value
    (current_share / 100) * investment_club.current_balance
  end
  
  private
  
  def set_initial_share
    self.current_share = 0
  end
  
  def update_club_financials
    investment_club.update_financials
    update_share_percentage
  end

  def update_club_members_count
    investment_club.update_members_count if investment_club.persisted?
  end
end