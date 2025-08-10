# app/services/investment_update_service.rb
class InvestmentUpdateService
  def self.update_investment(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment

    Rails.logger.info "Updating investment #{investment_id}"
    
    # Update investment values
    investment.touch # Forces updated_at to change

    # Send email notification if significant changes occurred
    send_value_change_email(investment) if significant_change?(investment)
  end

  def self.significant_change?(investment)
    investment.saved_change_to_percentage? || investment.campaign.saved_change_to_valuation?
  end

  def self.send_value_change_email(investment)
    InvestmentValueChangeMailer.send_notification_email(investment) # Direct service call
  rescue => e
    Rails.logger.error "Failed to send value change email for investment #{investment.id}: #{e.message}"
  end
end