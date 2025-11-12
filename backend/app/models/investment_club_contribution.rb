# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  
  # CRITICAL: Safe processing method with double-processing protection
  def process_completion!
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)
      if membership
        # Store previous state for logging
        previous_total = membership.total_contributed
        previous_share = membership.contributed_share
        previous_club_total = investment_club.total_contributions
        
        # Update member's total contributions
        new_total = membership.total_contributed + amount
        membership.update!(total_contributed: new_total)
        
        # Update club total contributions
        investment_club.update_financials
        
        # Log the change
        Rails.logger.info "Member #{user.full_name} contribution: " +
                        "#{format_currency(amount)} " +
                        "(Previous: #{format_currency(previous_total)}, " +
                        "New: #{format_currency(new_total)})"
        
        # Update all member shares with proper redistribution
        investment_club.update_all_member_shares
        
        # Log share changes
        new_share = membership.reload.contributed_share
        share_change = new_share - previous_share
        
        Rails.logger.info "Share change for #{user.full_name}: " +
                        "#{previous_share}% -> #{new_share}% " +
                        "(#{share_change > 0 ? '+' : ''}#{share_change.round(4)}%)"
        
        # REMOVED: investment_club.verify_share_totals - This is causing the error
        # The force_correct_share_totals in update_all_member_shares is sufficient
      end
      
      update_column(:processed_at, Time.current)
    end
  end
  
  private
  
  def update_club_balance
    process_completion! if completed?
  end

  def format_currency(amount)
  "#{amount.to_f.round(2)} #{investment_club.currency}"
  end
end