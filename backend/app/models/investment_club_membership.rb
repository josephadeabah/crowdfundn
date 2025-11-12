# app/models/investment_club_membership.rb
class InvestmentClubMembership < ApplicationRecord
  belongs_to :user
  belongs_to :investment_club
  
  # FIXED: Use the correct association through user
  has_many :member_investment_shares, through: :user
  has_many :club_investments, through: :member_investment_shares
  
  validates :user_id, uniqueness: { scope: :investment_club_id }
  
  enum role: { member: 'member', admin: 'admin', creator: 'creator' }
  enum status: { pending: 'pending', active: 'active', inactive: 'inactive' }
  
  # RENAME: current_share to contributed_share
  attribute :contributed_share, :decimal, default: 0.0
  attribute :total_contributed, :decimal, default: 0.0
  
  before_create :set_initial_share
  after_save :update_club_financials, if: -> { saved_change_to_total_contributed? }
  
  # FIXED: Simplified callback to avoid issues
  after_commit :update_club_members_count_callback
  
  scope :active, -> { where(status: 'active') }
  scope :admin, -> { where(role: ['admin', 'creator']) }
  scope :pending, -> { where(status: 'pending') }
  
  def update_share_percentage
    return if investment_club.total_contributions.zero?
    
    new_share = (total_contributed / investment_club.total_contributions) * 100
    update_column(:contributed_share, new_share.round(4))
  end

  # FIXED: Safe callback method
  def update_club_members_count_callback
    return if destroyed? || investment_club.destroyed?
    
    # Use update_column to avoid callbacks and validations
    investment_club.update_column(:current_members_count, investment_club.investment_club_memberships.active.count)
  rescue => e
    Rails.logger.error "Error updating club members count: #{e.message}"
  end
  
  def can_manage?
    admin? || creator?
  end
  
  def can_vote?
    active?
  end
  
  def can_contribute?
    active?
  end
  
  def portfolio_summary
    ClubPortfolioService.new(investment_club).member_portfolio(user)
  end
  
  def total_investment_value
    portfolio_summary[:current_value] || 0
  end
  
  private
  
  def set_initial_share
    self.contributed_share = 0
    self.total_contributed = 0
  end
  
  def update_club_financials
    investment_club.update_financials
    update_share_percentage
  end
end