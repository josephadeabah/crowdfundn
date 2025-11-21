# app/jobs/club_investment_finalization_job.rb
class ClubInvestmentFinalizationJob < ApplicationJob
  queue_as :club_investments

  def perform
    expired_investments = ClubInvestment.committed
                                       .where('cancel_window_expires_at <= ?', Time.current)

    expired_investments.find_each do |club_investment|
      ActiveRecord::Base.transaction do
        # Finalize the club investment
        club_investment.update!(status: ClubInvestment::STATUS_SUCCESSFUL)
        
        # Update campaign totals (moved from webhook handler)
        if club_investment.equity_investment
          campaign = club_investment.campaign
          campaign.update!(
            current_amount: campaign.current_amount + club_investment.equity_investment.net_amount,
            total_successful_donations: campaign.total_successful_donations + club_investment.equity_investment.net_amount,
            total_equity_invested: campaign.total_equity_invested + club_investment.equity_investment.net_amount
          )

          campaign.update_transferred_amount(club_investment.equity_investment.net_amount)
        end
        
        campaign_identifier = club_investment.campaign.slug || club_investment.campaign.id
        # Send final confirmation using existing service
        ClubEmailService.send_investment_finalized_notification(
          club_investment: club_investment,
          campaign_identifier: campaign_identifier,
          finalized: true, # Add flag to indicate this is after cancellation window
          cancellation_window_ended: true
        )
        
        Rails.logger.info "Successfully finalized club investment #{club_investment.id}"
      end
    rescue => e
      Rails.logger.error "Failed to finalize club investment #{club_investment.id}: #{e.message}"
      # Don't re-raise to allow other investments to process
    end
  end
end