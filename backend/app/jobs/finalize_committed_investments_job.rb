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
        
        # Get net_amount before updating campaign
        net_amount = investment.net_amount
        
        # Update campaign totals WITHOUT double-counting
        campaign = investment.campaign
        campaign.with_lock do
          # Only update these amounts once
          campaign.update!(
            current_amount: campaign.current_amount + net_amount,
            total_successful_donations: campaign.total_successful_donations + net_amount,
            total_equity_invested: campaign.total_equity_invested + net_amount
          )
          
          # update_transferred_amount also updates the campaign's transferred_amount
          # and fundraiser's total_transferred_amount
          campaign.update_transferred_amount(net_amount)
        end
        
        campaign_identifier = campaign.slug || campaign.id
        
        # Send final confirmation using existing service
        InvestmentConfirmationEmailService.send_confirmation_email(
          investment: investment,
          recipient_email: investment.email,
          recipient_name: investment.user&.full_name || investment.full_name || 'Investor',
          metadata: {
            redirect_url: Rails.application.routes.url_helpers.campaign_url(
                campaign_identifier,
                host: ENV.fetch('FRONTEND_HOST', 'crowdfundn.vercel.app')
            ),
            finalized: true,
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