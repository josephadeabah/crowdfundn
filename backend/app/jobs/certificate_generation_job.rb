class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id, recipient_email:, recipient_name:, metadata: {})
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    if InvestmentCertificateService.generate_certificate(investment)
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        certificate_url: investment.certificate_url,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        metadata: metadata
      )
    else
      retry_job(wait: 5.minutes) if executions < 3
    end
  end
end