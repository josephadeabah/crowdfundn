# app/jobs/certificate_generation_job.rb
class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment

    InvestmentCertificateService.generate_certificate(investment)
  rescue => e
    Rails.logger.error "CertificateGenerationJob failed for investment #{investment_id}: #{e.message}"
    # Retry with exponential backoff
    retry_job(wait: 5.minutes) if executions < 3
  end
end