# app/models/investment_club_membership.rb
class InvestmentClubMembership < ApplicationRecord
  belongs_to :user
  belongs_to :investment_club
  
  has_many :member_investment_shares, through: :user
  has_many :club_investments, through: :member_investment_shares
  has_many :member_share_changes, dependent: :destroy
  
  validates :user_id, uniqueness: { scope: :investment_club_id }
  
  enum role: { member: 'member', admin: 'admin', creator: 'creator' }
  enum status: { pending: 'pending', active: 'active', inactive: 'inactive' }
  
  attribute :contributed_share, :decimal, default: 0.0
  attribute :total_contributed, :decimal, default: 0.0
  
  scope :active, -> { where(status: 'active') }
  
  before_create :set_initial_share
  
  after_commit :update_club_members_count_callback
  
  scope :admin, -> { where(role: ['admin', 'creator']) }
  scope :pending, -> { where(status: 'pending') }
  
  # FIXED: Enhanced share percentage calculation with validation
  def update_share_percentage
    club_total = investment_club.total_contributions.to_f
    
    if club_total.zero?
      Rails.logger.info "Club #{investment_club_id} has zero total contributions, setting share to 0"
      update_column(:contributed_share, 0.0)
      return
    end
    
    calculated_share = (total_contributed.to_f / club_total) * 100.0
    new_share = calculated_share.round(4)
    
    # Validate the share is reasonable
    if new_share > 100.0
      Rails.logger.warn "Calculated share #{new_share}% exceeds 100% for member #{user_id} in club #{investment_club_id}"
      new_share = 100.0
    elsif new_share < 0.0
      Rails.logger.warn "Calculated share #{new_share}% is negative for member #{user_id} in club #{investment_club_id}"
      new_share = 0.0
    end
    
    if contributed_share.to_f != new_share
      update_column(:contributed_share, new_share)
      Rails.logger.info "Updated share for member #{user.full_name}: #{new_share}% (contributed: #{total_contributed}, club total: #{club_total})"
    else
      Rails.logger.debug "No share update needed for member #{user.full_name}: #{new_share}%"
    end
  rescue => e
    Rails.logger.error "Error updating share percentage for membership #{id}: #{e.message}"
    # Set to 0 as fallback
    update_column(:contributed_share, 0.0) if persisted?
  end

  # FIXED: Add method to refresh share based on current club state
  def refresh_share!
    club_total = investment_club.total_contributions.to_f
    return if club_total.zero?
    
    new_share = (total_contributed.to_f / club_total * 100.0).round(4)
    if (contributed_share.to_f - new_share).abs > 0.0001
      update_column(:contributed_share, new_share)
      Rails.logger.info "Refreshed share for #{user.full_name}: #{new_share}%"
    end
  end

  def update_club_members_count_callback
    return if destroyed? || investment_club.destroyed?
    
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