# app/models/premium_plan.rb
class PremiumPlan < ApplicationRecord
  INTERVALS = %w[monthly quarterly annually one_time].freeze
  
  validates :name, :price, :interval, presence: true
  validates :interval, inclusion: { in: INTERVALS }
  validates :price, numericality: { greater_than: 0 }
  
  scope :active, -> { where(active: true) }
  
  def display_price
    "#{currency} #{price}"
  end
  
  def monthly_equivalent
    case interval
    when 'monthly' then price
    when 'quarterly' then price / 3
    when 'annually' then price / 12
    when 'one_time' then price
    else price
    end
  end
  
  def recurring?
    interval != 'one_time'
  end
end