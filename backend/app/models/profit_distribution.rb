# app/models/profit_distribution.rb
class ProfitDistribution < ApplicationRecord
  belongs_to :club_investment
  
  validates :total_amount, numericality: { greater_than: 0 }
  
  serialize :distribution_data, JSON
end