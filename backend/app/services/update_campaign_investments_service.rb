# app/services/update_campaign_investments_service.rb
class UpdateCampaignInvestmentsService
  def self.update_for_campaign(campaign_id)
    campaign = EquityCampaign.find_by(id: campaign_id)
    return unless campaign

    Rails.logger.info "Updating investments for campaign #{campaign_id}"
    
    campaign.equity_investments.successful.find_each do |investment|
      begin
        InvestmentUpdateService.update_investment(investment.id)
      rescue => e
        Rails.logger.error "Failed to update investment #{investment.id}: #{e.message}"
      end
    end
  end
end