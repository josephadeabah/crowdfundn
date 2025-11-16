# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  
  # FIXED: Improved processing with better error handling and logging
  def process_completion!
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)
      
      unless membership
        Rails.logger.error "No active membership found for user #{user.id} in club #{investment_club.id}"
        raise "No active membership found for user in club"
      end

      # Store previous values BEFORE any changes
      previous_total = membership.total_contributed.to_f
      previous_share = membership.contributed_share.to_f
      
      Rails.logger.info "Processing contribution #{id}: " +
                       "User: #{user.full_name}, " +
                       "Amount: #{amount}, " +
                       "Previous total: #{previous_total}, " +
                       "Previous share: #{previous_share}%"

      # Update member's total contribution
      new_total = previous_total + amount.to_f
      membership.update!(total_contributed: new_total)
      
      Rails.logger.info "Updated membership total: #{new_total}"

      # Update club financials FIRST - this now has safe error handling
      investment_club.update_financials
      
      # Get fresh total contributions after update
      current_total_contributions = investment_club.total_contributions
      Rails.logger.info "Club total contributions after update: #{current_total_contributions}"

      # Update ALL member shares with proper history tracking
      investment_club.update_all_member_shares_with_history(self)
      
      # Reload membership to get updated share
      membership.reload
      new_share = membership.contributed_share.to_f
      actual_change = new_share - previous_share

      Rails.logger.info "Contribution processed: #{user.full_name} " +
                       "+#{format_currency(amount)} " +
                       "Share: #{previous_share.round(4)}% → #{new_share.round(4)}% " +
                       "(Δ#{actual_change.round(4)}%)"

      # Mark as processed
      update_column(:processed_at, Time.current)
      Rails.logger.info "Contribution #{id} marked as processed at #{processed_at}"
    end
  rescue => e
    Rails.logger.error "Error processing contribution #{id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    
    # Mark as failed if processing fails
    update!(status: 'failed') if may_fail?
    raise
  end
  
  private
  
  def update_club_balance
    if completed? && processed_at.nil?
      process_completion!
    end
  end

  def format_currency(amount)
    "#{amount.to_f.round(2)} #{investment_club.currency}"
  end
end