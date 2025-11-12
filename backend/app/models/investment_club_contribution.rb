# app/models/investment_club_contribution.rb
class InvestmentClubContribution < ApplicationRecord
  belongs_to :investment_club
  belongs_to :user
  
  validates :amount, numericality: { greater_than: 0 }
  
  enum status: { pending: 'pending', completed: 'completed', failed: 'failed', refunded: 'refunded' }
  
  
  after_save :update_club_balance, if: -> { saved_change_to_status? && completed? }
  
  # CRITICAL: Safe processing method with double-processing protection
  def process_completion!
    return if processed_at.present?
    
    ActiveRecord::Base.transaction do
      membership = investment_club.membership_for(user)
      if membership
        previous_total = membership.total_contributed
        previous_share = membership.contributed_share
        
        new_total = membership.total_contributed + amount
        membership.update!(total_contributed: new_total)
        
        investment_club.update_financials
        
        # Use the enhanced method with history tracking
        investment_club.update_all_member_shares_with_history(self)
        
        # Log the changes
        new_share = membership.reload.contributed_share
        Rails.logger.info "Contribution processed: #{user.full_name} " +
                        "+#{format_currency(amount)} " +
                        "(#{previous_share}% → #{new_share}%)"
      end
      
      update_column(:processed_at, Time.current)
    end
  end
  
  private
  
  def update_club_balance
    process_completion! if completed?
  end

  def format_currency(amount)
  "#{amount.to_f.round(2)} #{investment_club.currency}"
  end
end