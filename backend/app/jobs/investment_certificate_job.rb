# In InvestmentCertificateJob
class InvestmentCertificateJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find(investment_id)
    
    Rails.logger.info "Starting certificate generation for investment #{investment_id}"
    
    success = InvestmentCertificateService.generate_certificate(investment)
    
    if success
      Rails.logger.info "Successfully generated certificate for investment #{investment_id}"
    else
      Rails.logger.error "Failed to generate certificate for investment #{investment_id}"
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "InvestmentCertificateJob failed: #{e.message}"
  rescue => e
    Rails.logger.error "InvestmentCertificateJob unexpected error: #{e.message}\n#{e.backtrace.join("\n")}"
  end
end