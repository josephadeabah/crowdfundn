# app/jobs/certificate_generation_job.rb
class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    if InvestmentCertificateService.generate_certificate(investment)
      metadata = investment.metadata || {}
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        certificate_url: investment.certificate_url,
        recipient_email: investment.email,
        recipient_name: investment.user&.full_name || investment.full_name || 'Investor',
        metadata: metadata
      )
    else
      retry_job(wait: 5.minutes) if executions < 3
    end
  end
end