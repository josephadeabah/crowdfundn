# app/models/investment_club_membership.rb
class InvestmentClubMembership < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :user_id, uniqueness: { scope: :investment_club_id }
  
  enum role: { member: 'member', admin: 'admin', creator: 'creator' }
  enum status: { pending: 'pending', active: 'active', inactive: 'inactive' }
  
  before_create :set_initial_share
  after_save :update_club_financials, if: -> { saved_change_to_total_contributed? }
  
  def update_share_percentage
    return if investment_club.total_contributions.zero?
    
    new_share = (total_contributed / investment_club.total_contributions) * 100
    update_column(:current_share, new_share.round(4))
  end
  
  private
  
  def set_initial_share
    self.current_share = 0
  end
  
  def update_club_financials
    investment_club.update_financials
    update_share_percentage
  end
end