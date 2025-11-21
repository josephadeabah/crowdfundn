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

  # FIXED: Enhanced processing with better error handling and validation
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

      Rails.logger.info "Processing contribution #{id}: User: #{user.full_name}, Amount: #{amount}, Club Total Before: #{club.total_contributions}"

      # FIXED: Update club balance atomically with fresh calculations
      club.update_balance_with_contribution(amount)

      # FIXED: Update member contribution total with validation
      new_total_contributed = membership.total_contributed.to_f + amount.to_f
      membership.update!(total_contributed: new_total_contributed)

      Rails.logger.info "Updated member #{user.full_name} total contributed: #{new_total_contributed}"

      # FIXED: Enhanced share update with fallback
      begin
        club.update_all_member_shares_with_history(self)
        
        # Verify the update worked correctly
        unless club.verify_share_totals_immediately
          Rails.logger.warn "Share verification failed after contribution #{id}, attempting recalculation"
          club.update_all_member_shares_without_history
        end
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.warn "Share change validation failed for contribution #{id}: #{e.message}. Using fallback method..."
        club.update_all_member_shares_without_history
      rescue NoMethodError => e
        Rails.logger.error "Method error in share update: #{e.message}. Using fallback method."
        club.update_all_member_shares_without_history
      rescue => e
        Rails.logger.error "Unexpected error in share update: #{e.message}. Using fallback method."
        club.update_all_member_shares_without_history
      end

      # Mark this contribution as fully processed
      update_column(:processed_at, Time.current)

      # Final verification
      final_membership = club.membership_for(user)
      Rails.logger.info "Contribution #{id} processed successfully. " +
                       "New club balance: #{club.current_balance}, " +
                       "Member share: #{final_membership.contributed_share}%, " +
                       "Member total: #{final_membership.total_contributed}"
    end
  rescue => e
    Rails.logger.error "Error processing contribution #{id}: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    
    # FIXED: Better error handling for contribution status
    if pending? || completed?
      update!(status: "failed", processed_at: Time.current) 
    end
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