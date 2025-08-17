class InvestmentConfirmationEmailJob < ApplicationJob
  queue_as :default
  retry_on ActiveStorage::FileNotFoundError, wait: 5.seconds, attempts: 3
  retry_on RuntimeError, wait: 5.seconds, attempts: 3

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    Rails.logger.info "Sending confirmation email for investment #{investment_id}"

    unless investment.certificate.attached?
      raise ActiveStorage::FileNotFoundError, "Certificate not attached for investment #{investment_id}"
    end

    InvestmentConfirmationEmailService.send_confirmation_email(
      investment: investment,
      certificate_url: investment.certificate_url,
      recipient_email: investment.email,
      recipient_name: investment.user&.full_name || investment.full_name || 'Investor'
    )
  end
end