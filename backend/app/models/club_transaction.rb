# app/models/club_transaction.rb
class ClubTransaction < ApplicationRecord
  belongs_to :investment_club
  belongs_to :club_investment, optional: true
  
  validates :amount, numericality: { greater_than: 0 }
  validates :transaction_type, presence: true
  
  enum transaction_type: {
    contribution: 'contribution',
    investment: 'investment',
    distribution: 'distribution',
    fee: 'fee'
  }
  
  enum status: {
    pending: 'pending',
    completed: 'completed',
    failed: 'failed'
  }
  
  after_save :update_club_balance
  
  private
  
  def update_club_balance
    investment_club.update_financials
  end
end