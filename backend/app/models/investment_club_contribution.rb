# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  # Add optimistic locking to prevent race conditions
  self.locking_column = :lock_version
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  after_save :reverse_club_balance, if: -> { saved_change_to_status? && refunded? }
  
  # Add these columns to track financial details
  attribute :paystack_fee, :decimal, default: 0
  attribute :amount_settled, :decimal
  
  # Add method to safely process completion
  def process_completion!
    return unless completed? && saved_change_to_status?(to: 'completed')
    
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
    end
  end
  
  # Safe processing that prevents double counting
  def safe_process_completion!
    # Double-check this hasn't been processed already
    return if processed_at.present?
    
    process_completion!
    update_column(:processed_at, Time.current)
  end
  
  private
  
  def update_club_balance
    # This method should call process_completion! to ensure consistent processing
    process_completion! if completed? && !@processed_via_callback
    @processed_via_callback = true
  end
  
  def reverse_club_balance
    investment_club.update_financials
    membership = investment_club.membership_for(user)
    if membership
      membership.update!(total_contributed: membership.total_contributed - amount)
      membership.update_share_percentage
    end
  end
end