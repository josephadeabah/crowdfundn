# app/jobs/club_investment_finalization_job.rb
class ClubInvestmentFinalizationJob < ApplicationJob
  queue_as :club_investments

  def perform
    expired_investments = ClubInvestment.where(status: ClubInvestment::STATUS_COMMITTED)
                                       .where('cancel_window_expires_at <= ?', Time.current)

    Rails.logger.info "Found #{expired_investments.count} club investments ready for finalization"

    expired_investments.find_each do |club_investment|
      begin
        process_investment(club_investment)
      rescue => e
        Rails.logger.error "Failed to finalize club investment #{club_investment.id}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
      end
    end
  end

  private

  def process_investment(club_investment)
    Rails.logger.info "Processing club investment #{club_investment.id} with equity_investment_id: #{club_investment.equity_investment_id}"
    
    ActiveRecord::Base.transaction do
      # Finalize the club investment
      club_investment.update!(status: ClubInvestment::STATUS_SUCCESSFUL)
      
      # Update campaign totals if equity investment exists
      if club_investment.equity_investment_id.present?
        begin
          equity_investment = EquityInvestment.find_by(id: club_investment.equity_investment_id)
          
          if equity_investment
            campaign = club_investment.campaign
            net_amount = equity_investment.net_amount
            
            # UPDATE CAMPAIGN TOTALS HERE (all campaign updates happen here)
            campaign.update!(
              current_amount: campaign.current_amount + net_amount,
              total_successful_donations: campaign.total_successful_donations + net_amount,
              total_equity_invested: campaign.total_equity_invested + net_amount
            )

            campaign.update_transferred_amount(net_amount) if campaign.respond_to?(:update_transferred_amount)
            
            # Update shares issued if it's an equity campaign
            # if campaign.is_a?(EquityCampaign) && equity_investment.shares
            #   campaign.update!(
            #     shares_issued: campaign.shares_issued + equity_investment.shares
            #   )
            # end
            
            # Also update the equity investment status
            equity_investment.update!(status: EquityInvestment::STATUS_SUCCESSFUL)
            Rails.logger.info "Updated campaign #{campaign.id} and equity investment #{equity_investment.id}"
          else
            Rails.logger.warn "Equity investment #{club_investment.equity_investment_id} not found for club investment #{club_investment.id}"
          end
        rescue => e
          Rails.logger.error "Error processing equity investment for club investment #{club_investment.id}: #{e.message}"
        end
      else
        Rails.logger.warn "Club investment #{club_investment.id} has no equity_investment_id"
      end
      
      campaign_identifier = club_investment.campaign.slug || club_investment.campaign.id
      
      # Send final confirmation
      ClubEmailService.send_investment_finalized_notification(
        club_investment: club_investment,
        campaign_identifier: campaign_identifier,
        finalized: true,
        cancellation_window_ended: true
      )
      
      Rails.logger.info "Successfully finalized club investment #{club_investment.id}"
    end
    
    # Enqueue certificate job for equity investments
    if club_investment.campaign.is_a?(EquityCampaign)
      ClubInvestmentCertificateJob.perform_later(club_investment.id)
      Rails.logger.info "Enqueued certificate generation for successful club investment #{club_investment.id}"
    end
  end
end