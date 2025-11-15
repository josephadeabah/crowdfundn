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
  
  private
  
  def generate_reference_if_missing
    self.reference ||= "CLUB_#{SecureRandom.alphanumeric(12).upcase}"
  end
end