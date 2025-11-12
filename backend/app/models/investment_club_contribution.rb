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
      
      # Update club financials
      investment_club.update_financials
      
      # Update member's total contributions
      membership = investment_club.membership_for(user)
      membership.update!(total_contributed: membership.total_contributed + amount)
      
      # Update member's share percentage
      membership.update_share_percentage
      
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
    # This is now handled by process_completion! method
    # Keeping for backward compatibility but it should not trigger double updates
    Rails.logger.info "Club balance updated for contribution #{id}"
  end
  
  def reverse_club_balance
    investment_club.update_financials
    membership = investment_club.membership_for(user)
    membership.update!(total_contributed: membership.total_contributed - amount)
    
    # Update member's contributed share percentage
    membership.update_share_percentage
  end
end