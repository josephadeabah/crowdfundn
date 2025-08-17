class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    if InvestmentCertificateService.generate_certificate(investment)
      InvestmentConfirmationEmailJob.perform_later(investment_id)
    else
      retry_job(wait: 5.minutes) if executions < 3
    end
  end
end