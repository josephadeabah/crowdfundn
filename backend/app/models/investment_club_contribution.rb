# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  after_save :reverse_club_balance, if: -> { saved_change_to_status? && refunded? }
  
  # Add these columns to track financial details
  attribute :paystack_fee, :decimal, default: 0
  attribute :amount_settled, :decimal
  
  private
  
  def update_club_balance
    investment_club.update_financials
    membership = investment_club.membership_for(user)
    membership.update(total_contributed: membership.total_contributed + amount)
    
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
  
  def reverse_club_balance
    investment_club.update_financials
    membership = investment_club.membership_for(user)
    membership.update(total_contributed: membership.total_contributed - amount)
    
    # Update member's share percentage
    membership.update_share_percentage
  end
end