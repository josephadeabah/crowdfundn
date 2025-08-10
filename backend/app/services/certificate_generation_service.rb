# app/services/certificate_generation_service.rb
class CertificateGenerationService
  MAX_RETRIES = 3
  RETRY_DELAY = 10.minutes

  def self.generate_for_investment(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment&.successful?

    if investment.certificate_present?
      Rails.logger.info "Certificate already exists for investment #{investment_id}"
      return true
    end

    Rails.logger.info "Generating certificate for investment #{investment_id}"
    
    if InvestmentCertificateService.generate_certificate(investment)
      investment.reload
      if investment.certificate_present?
        send_confirmation(investment)
        true
      else
        retry_generation(investment_id, "Certificate not attached after generation")
        false
      end
    else
      retry_generation(investment_id, "Certificate generation failed")
      false
    end
  rescue => e
    Rails.logger.error "Error generating certificate for investment #{investment_id}: #{e.message}"
    retry_generation(investment_id, "Error: #{e.message}")
    false
  end

  private

  def self.send_confirmation(investment)
    InvestmentConfirmationEmailService.send_confirmation_email(
      investment: investment,
      certificate_url: investment.certificate_url,
      recipient_email: investment.email,
      recipient_name: investment.user&.full_name || 'Investor'
    )
  rescue => e
    Rails.logger.error "Failed to send confirmation email for investment #{investment.id}: #{e.message}"
  end

  def self.retry_generation(investment_id, reason)
    Rails.logger.warn "Retrying certificate generation for investment #{investment_id}: #{reason}"
    
    # You can implement your retry logic here
    # For example, using a simple delayed retry:
    CertificateGenerationJob.set(wait: RETRY_DELAY).perform_later(investment_id)
  end
end