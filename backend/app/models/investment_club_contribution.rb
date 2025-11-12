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
    return if completed? # Already processed
    
    with_lock do
      return if completed? # Double check after acquiring lock
      
      # Update member's total contributions FIRST
      membership = investment_club.membership_for(user)
      if membership
        new_total_contributed = membership.total_contributed + amount
        membership.update!(
          total_contributed: new_total_contributed
        )
        
        # Update member's share percentage AFTER updating total_contributed
        membership.update_share_percentage
      else
        Rails.logger.error "No membership found for user #{user.id} in club #{investment_club.id}"
      end
      
      # Update club financials
      investment_club.update_financials
      
      # Create club transaction record safely
      begin
        ClubTransaction.create!(
          investment_club: investment_club,
          amount: amount,
          transaction_type: 'contribution',
          status: 'completed',
          reference: transaction_reference,
          description: "Member contribution from #{user.full_name}"
        )
      rescue => e
        Rails.logger.error "Failed to create club transaction: #{e.message}"
        # Don't fail the whole process if transaction creation fails
      end
    end
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