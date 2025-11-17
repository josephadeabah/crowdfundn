# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user

  validates :amount, numericality: { greater_than: 0 }

  enum status: {
    pending: "pending",
    completed: "completed",
    failed: "failed",
    refunded: "refunded"
  }

  # FIXED: Better processing control
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }

  # FIXED: Thread-safe processing with proper locking
  def process_completion!
    return if processed_at.present?  # Prevent double processing

    ActiveRecord::Base.transaction do
      # Lock the club to prevent race conditions
      club = InvestmentClub.lock.find(investment_club_id)
      membership = club.membership_for(user)

      unless membership
        Rails.logger.error "No membership found for user #{user.id} in club #{club.id}"
        raise "User is not part of the club"
      end

      Rails.logger.info "Processing contribution #{id}: User: #{user.full_name}, Amount: #{amount}"

      # FIXED: Update club balance atomically
      club.update_balance_with_contribution(amount)

      # FIXED: Update member contribution total
      membership.update!(total_contributed: membership.total_contributed.to_f + amount.to_f)

      # FIXED: Update member shares with proper error handling
      club.update_all_member_shares_with_history(self)

      # Mark this contribution as fully processed
      update_column(:processed_at, Time.current)

      Rails.logger.info "Contribution #{id} processed successfully. New club balance: #{club.current_balance}"
    end
  rescue => e
    Rails.logger.error "Error processing contribution #{id}: #{e.message}"
    update!(status: "failed") if may_fail?
    raise
  end

  private

  def update_club_balance
    # Only run if status is completed AND not yet processed
    process_completion! if processed_at.nil?
  end

  def format_currency(amount)
    "#{amount.to_f.round(2)} #{investment_club.currency}"
  end
end