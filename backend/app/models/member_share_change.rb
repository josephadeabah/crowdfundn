# app/models/member_share_change.rb
class MemberShareChange < ApplicationRecord
  belongs_to :investment_club_membership
  belongs_to :investment_club_contribution, optional: true
  
  validates :previous_share, :new_share, :change_amount, presence: true
  validates :previous_share, :new_share, numericality: { greater_than_or_equal_to: 0 }
  
  # Add validation to ensure logical consistency
  validate :share_values_are_logical
  
  before_create :log_share_change_details
  
  def share_values_are_logical
    return if previous_share.blank? || new_share.blank?
    
    # Check if the change amount matches the difference
    calculated_change = new_share - previous_share
    if (change_amount - calculated_change).abs > 0.001 # Allow small floating point differences
      errors.add(:change_amount, "does not match the difference between new and previous share")
    end
    
    # Check if shares are reasonable (shouldn't jump dramatically for one contribution)
    if change_amount.abs > 50 # More than 50% change is suspicious
      errors.add(:change_amount, "appears too large for a single change")
    end
  end
  
  def log_share_change_details
    Rails.logger.info "Share Change Record: " +
                     "Member: #{investment_club_membership.user.full_name} " +
                     "Previous: #{previous_share}% " +
                     "New: #{new_share}% " +
                     "Change: #{change_amount}% " +
                     "Contributions: #{total_contributions_at_time} " +
                     "Contribution: #{investment_club_contribution&.amount}"
  end
  
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