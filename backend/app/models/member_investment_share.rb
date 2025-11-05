# app/models/member_investment_share.rb
class MemberInvestmentShare < ApplicationRecord
  belongs_to :user
  belongs_to :club_investment
  
  validates :user_id, uniqueness: { scope: :club_investment_id }
  validates :share_percentage, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }
  validates :effective_shares, numericality: { greater_than_or_equal_to: 0 }
end