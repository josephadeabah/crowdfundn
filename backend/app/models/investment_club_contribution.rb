# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  
  # CRITICAL: Safe processing method with double-processing protection
  def process_completion!
    # Double-check using processed_at to prevent ANY double processing
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      # Update member's total contributions
      membership = investment_club.membership_for(user)
      if membership
        new_total = membership.total_contributed + amount
        membership.update!(total_contributed: new_total)
        
        # Update club total contributions
        investment_club.update_financials
        
        # Update all member shares
        investment_club.update_all_member_shares
      end
      
      # Mark as processed to prevent any future processing
      update_column(:processed_at, Time.current)
    end
  end
  
  private
  
  def update_club_balance
    process_completion! if completed?
  end
end