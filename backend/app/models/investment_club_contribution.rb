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

  # Auto-process after Paystack marks status = "completed"
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }

  # ========================================
  # PROCESS COMPLETION
  # ========================================
  def process_completion!
    return if processed_at.present?  # Prevent double processing

    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)

      unless membership
        Rails.logger.error "No membership found for user #{user.id} in club #{investment_club.id}"
        raise "User is not part of the club"
      end

      # Store previous values
      previous_total = membership.total_contributed.to_f
      previous_share = membership.contributed_share.to_f

      Rails.logger.info "Processing contribution #{id}: " \
                        "User: #{user.full_name}, Amount: #{amount}"

      # Update member contribution total
      membership.update!(total_contributed: previous_total + amount.to_f)

      # Update club financials
      investment_club.update_financials

      # Update member shares
      investment_club.update_all_member_shares_with_history(self)

      # Mark this contribution as fully processed
      update_column(:processed_at, Time.current)

      Rails.logger.info "Contribution #{id} processed successfully"
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
