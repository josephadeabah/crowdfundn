# app/jobs/certificate_generation_job.rb
class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.success?

    return if investment.certificate_present?

    certificate = InvestmentCertificateService.generate_certificate(investment)
    return if certificate

    retry_job(wait: 10.minutes) if executions < 3
  end
end
