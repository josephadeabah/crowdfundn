# new model to track share changes
# app/models/member_share_change.rb
class MemberShareChange < ApplicationRecord
  belongs_to :investment_club_membership
  belongs_to :investment_club_contribution, optional: true
  
  validates :previous_share, :new_share, :change_amount, presence: true
  
  # Calculate percentage change
  def share_change_percentage
    return 0 if previous_share.zero?
    ((new_share - previous_share) / previous_share * 100).round(2)
  end
  
  # Human-readable change description
  def change_description
    direction = change_amount.positive? ? "increased" : "decreased"
    "#{direction} by #{change_amount.abs.round(4)}% (#{previous_share.round(4)}% → #{new_share.round(4)}%)"
  end
  
  # Scope for recent changes
  scope :recent, ->(limit = 10) { order(created_at: :desc).limit(limit) }
  
  # Scope for changes within a date range
  scope :between_dates, ->(start_date, end_date) { 
    where(created_at: start_date.beginning_of_day..end_date.end_of_day) 
  }
end