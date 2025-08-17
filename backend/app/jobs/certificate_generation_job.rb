class CertificateGenerationJob < ApplicationJob
  queue_as :default
  retry_on ActiveStorage::FileNotFoundError, wait: 5.seconds, attempts: 3
  retry_on RuntimeError, wait: 5.seconds, attempts: 3

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    Rails.logger.info "Generating certificate for investment #{investment_id}"

    if InvestmentCertificateService.generate_certificate(investment)
      # Wait to ensure S3 attachment is fully available
      sleep 2 if Rails.env.production?
      InvestmentConfirmationEmailJob.perform_later(investment_id)
    else
      raise "Failed to generate certificate for investment #{investment_id}"
    end
  end
end