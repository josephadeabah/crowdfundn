# app/jobs/investment_certificate_job.rb
class InvestmentCertificateJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find(investment_id)
    InvestmentCertificateService.generate_certificate(investment)
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "InvestmentCertificateJob failed: #{e.message}"
  end
end