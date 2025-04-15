# app/models/equity_investment.rb
class EquityInvestment < ApplicationRecord
  belongs_to :campaign  
  belongs_to :user
  
  STATUSES = %w[pending completed canceled refunded].freeze
  
  validates :amount, :status, presence: true
  validates :amount, numericality: { greater_than: 0 }
  validates :status, inclusion: { in: STATUSES }
  
  before_create :set_share_count
  
  private
  
  def set_share_count
    self.share_count = amount / (campaign.valuation / campaign.equity_offered * 100)
  end
end