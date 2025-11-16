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
  
  # FIXED: Add callback to handle failed transfers and refund balance
  after_update :refund_balance_if_failed, if: -> { saved_change_to_status? && failed? }
  
  private
  
  def generate_reference_if_missing
    self.reference ||= "CLUB_#{SecureRandom.alphanumeric(12).upcase}"
  end
  
  def refund_balance_if_failed
    # If transfer fails, add the amount back to club balance
    club = investment_club
    new_total_contributions = club.total_contributions + amount
    new_current_balance = new_total_contributions - club.total_invested
    
    club.update_columns(
      total_contributions: new_total_contributions,
      current_balance: new_current_balance,
      updated_at: Time.current
    )
    
    Rails.logger.info "Refunded #{amount} to club #{club.id} due to failed transfer"
    Rails.logger.info "New club balance: #{new_current_balance}"
  end
end