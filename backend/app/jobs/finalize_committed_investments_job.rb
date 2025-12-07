# app/jobs/finalize_committed_investments_job.rb
class FinalizeCommittedInvestmentsJob < ApplicationJob
  queue_as :investments

  def perform
    expired_investments = EquityInvestment.committed
                                         .where('cancel_window_expires_at <= ?', Time.current)

    expired_investments.find_each do |investment|
      ActiveRecord::Base.transaction do
        # Finalize the investment - capture payment and update campaign
        investment.update!(status: EquityInvestment::STATUS_SUCCESSFUL)
        
        # Update campaign totals including transferred_amount
        campaign = investment.campaign
        campaign.with_lock do
          campaign.update!(
            current_amount: campaign.current_amount + investment.net_amount,
            total_successful_donations: campaign.total_successful_donations + investment.net_amount,
            total_equity_invested: campaign.total_equity_invested + investment.net_amount
          )
          
          # Use force: true to bypass transfer lock for finalized investments
          campaign.update_transferred_amount(investment.net_amount, force: true)
        end
        
        campaign_identifier = campaign.slug || campaign.id
        # Send final confirmation using existing service
        InvestmentConfirmationEmailService.send_confirmation_email(
          investment: investment,
          recipient_email: investment.email,
          recipient_name: investment.user&.full_name || investment.full_name || 'Investor',
          metadata: {
            redirect_url: Rails.application.routes.url_helpers.campaign_url(campaign_identifier, host: 'bantuhive.com'),
            finalized: true, # Add flag to indicate this is after cancellation window
            cancellation_window_ended: true
          }
        )
        
        Rails.logger.info "Successfully finalized investment #{investment.id}"
      end
    rescue => e
      Rails.logger.error "Failed to finalize investment #{investment.id}: #{e.message}"
      # Don't re-raise to allow other investments to process
    end
  end
end