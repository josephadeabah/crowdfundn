class InvestmentConfirmationEmailJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful? && investment.certificate.attached?

    InvestmentConfirmationEmailService.send_confirmation_email(
      investment: investment,
      certificate_url: investment.certificate_url,
      recipient_email: investment.email,
      recipient_name: investment.user&.full_name || investment.full_name || 'Investor'
    )
  rescue => e
    Rails.logger.error "Failed to send confirmation email for investment #{investment_id}: #{e.message}"
    retry_job(wait: 5.minutes) if executions < 3
  end
end