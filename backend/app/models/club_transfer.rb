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
  
  # FIXED: Proper callback for failed transfers
  after_update :refund_balance_if_failed, if: -> { saved_change_to_status? && failed? }
  
  private
  
  def generate_reference_if_missing
    self.reference ||= "CLUB_#{SecureRandom.alphanumeric(12).upcase}"
  end
  
  def refund_balance_if_failed
    # Refund the amount back to club balance
    investment_club.refund_transfer_amount(amount)
    
    Rails.logger.info "Refunded #{amount} to club #{investment_club.id} due to failed transfer"
  end
end