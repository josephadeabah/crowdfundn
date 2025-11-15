# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  
  # FIXED: Improved processing with better share tracking
  def process_completion!
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)
      if membership
        # Store previous values BEFORE any changes
        previous_total = membership.total_contributed.to_f
        previous_share = membership.contributed_share.to_f
        
        # Update member's total contribution
        new_total = previous_total + amount.to_f
        membership.update!(total_contributed: new_total)
        
        # Update club financials
        investment_club.update_financials
        
        # Update ALL member shares with proper history tracking
        investment_club.update_all_member_shares_with_history(self)
        
        # Verify the new share percentage
        new_share = membership.reload.contributed_share.to_f
        actual_change = new_share - previous_share
        
        Rails.logger.info "Contribution processed: #{user.full_name} " +
                        "+#{format_currency(amount)} " +
                        "Share: #{previous_share.round(4)}% → #{new_share.round(4)}% " +
                        "(Δ#{actual_change.round(4)}%)"
      end
      
      update_column(:processed_at, Time.current)
    end
  rescue => e
    Rails.logger.error "Error processing contribution #{id}: #{e.message}"
    raise
  end
  
  private
  
  def update_club_balance
    process_completion! if completed?
  end

  def format_currency(amount)
  "#{amount.to_f.round(2)} #{investment_club.currency}"
  end
end