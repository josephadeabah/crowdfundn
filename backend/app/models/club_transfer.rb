# app/models/club_transfer.rb
class ClubTransfer < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, :currency, :status, presence: true
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: {
    pending: 'pending',
    success: 'success', 
    failed: 'failed',
    reversed: 'reversed'
  }
  
  before_create :generate_reference_if_missing
  
  # FIXED: Proper callback for failed transfers with transaction safety
  after_update :refund_balance_if_failed, if: -> { saved_change_to_status? && failed? }
  
  # FIXED: Add method to mark as successful with proper balance handling
  def mark_as_successful!(transfer_data = {})
    ActiveRecord::Base.transaction do
      update!(
        status: 'success',
        completed_at: Time.current,
        bank_name: transfer_data.dig(:recipient, :details, :bank_name),
        account_number: transfer_data.dig(:recipient, :details, :account_number),
        reference: transfer_data[:reference] || reference
      )
      
      # Balance was already deducted when transfer was initiated
      # No need to deduct again for successful transfers
      Rails.logger.info "Club transfer #{transfer_code} marked as successful - balance already deducted"
    end
  end
  
  # FIXED: Add method to mark as failed with proper balance refund
  def mark_as_failed!(failure_reason = nil)
    ActiveRecord::Base.transaction do
      update!(
        status: 'failed',
        failure_reason: failure_reason || 'Transfer failed',
        completed_at: Time.current
      )
      
      # Refund will happen in the after_update callback
      Rails.logger.info "Club transfer #{transfer_code} marked as failed - refund will be processed"
    end
  end
  
  # FIXED: Check if transfer can be refunded
  def can_refund?
    (pending? || success?) && amount > 0
  end
  
  private
  
  def generate_reference_if_missing
    self.reference ||= "CLUB_#{SecureRandom.alphanumeric(12).upcase}"
  end
  
  # FIXED: Thread-safe balance refund with proper error handling
  def refund_balance_if_failed
    # Only refund if the transfer was previously pending (not already refunded)
    return unless saved_change_to_status? && status_was == 'pending'
    
    # Use the thread-safe refund method from InvestmentClub
    investment_club.refund_balance(amount)
    
    Rails.logger.info "Refunded #{amount} #{currency} to club #{investment_club.id} due to failed transfer #{id}"
  rescue => e
    Rails.logger.error "Failed to refund balance for club transfer #{id}: #{e.message}"
    # Don't raise error to prevent callback chain from breaking
  end
end