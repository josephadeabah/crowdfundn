# app/models/club_investment.rb
class ClubInvestment < ApplicationRecord
  belongs_to :investment_club
  belongs_to :campaign
  belongs_to :created_by, class_name: 'User'
  
  has_many :member_investment_shares, dependent: :destroy
  has_many :members, through: :member_investment_shares, source: :user
  has_many :votes, as: :votable, dependent: :destroy
  
  # REMOVED: profit_distributions association since we're getting rid of profit distribution
  
  validates :investment_amount, :proposed_share_percentage, numericality: { greater_than: 0 }
  validates :shares_acquired, numericality: { greater_than_or_equal_to: 0 }
  
  enum status: {
    pending: 'pending',
    voting: 'voting',
    approved: 'approved',
    rejected: 'rejected',
    executed: 'executed',
    failed: 'failed'
  }
  
  before_create :generate_reference
  after_save :distribute_shares_after_execution, if: -> { saved_change_to_status?(to: 'executed') }
  
  def distribute_shares_after_execution
    return unless campaign.is_a?(EquityCampaign)
    
    # Calculate total contributed shares from all active members
    total_contributed_shares = investment_club.investment_club_memberships.active.sum(:contributed_share)
    return if total_contributed_shares.zero?
    
    ActiveRecord::Base.transaction do
      investment_club.investment_club_memberships.active.each do |membership|
        member_share_percentage = (membership.contributed_share / total_contributed_shares) * 100
        
        MemberInvestmentShare.create!(
          user: membership.user,
          club_investment: self,
          share_percentage: member_share_percentage.round(4),
          effective_shares: (member_share_percentage / 100) * shares_acquired.to_f
        )
      end
    end
  end
  
  def current_value
    return investment_amount unless campaign.is_a?(EquityCampaign)
    
    # Calculate current value based on campaign valuation and shares owned
    (shares_acquired / campaign.total_shares.to_f) * campaign.valuation
  end
  
  def total_return
    current_value - investment_amount
  end
  
  def roi
    return 0 if investment_amount.zero?
    (total_return / investment_amount) * 100
  end
  
  private
  
  def generate_reference
    self.reference ||= "CLUB-INV-#{SecureRandom.alphanumeric(10).upcase}"
  end
end