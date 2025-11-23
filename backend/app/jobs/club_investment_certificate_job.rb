# app/jobs/club_investment_certificate_job.rb
class ClubInvestmentCertificateJob < ApplicationJob
  queue_as :default
  retry_on ActiveRecord::RecordNotFound, wait: 5.seconds, attempts: 3

  def perform(club_investment_id, attempt = 1)
    club_investment = ClubInvestment.find(club_investment_id)
    
    Rails.logger.info "Starting certificate generation for club investment #{club_investment_id} (attempt #{attempt})"
    
    # If investment is not yet successful, retry with backoff
    unless club_investment.successful?
      if attempt < 3
        Rails.logger.info "Club investment #{club_investment_id} not yet successful (status: #{club_investment.status}), retrying in #{5 * attempt} seconds"
        self.class.set(wait: (5 * attempt).seconds).perform_later(club_investment_id, attempt + 1)
        return
      else
        Rails.logger.error "Club investment #{club_investment_id} still not successful after #{attempt} attempts (status: #{club_investment.status})"
        return
      end
    end
    
    success = ClubInvestmentCertificateService.generate_certificate(club_investment)
    
    if success
      Rails.logger.info "Successfully generated certificate for club investment #{club_investment_id}"
    else
      Rails.logger.error "Failed to generate certificate for club investment #{club_investment_id}"
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "ClubInvestmentCertificateJob failed: Club investment #{club_investment_id} not found - #{e.message}"
    raise e # This will trigger the retry mechanism
  rescue => e
    Rails.logger.error "ClubInvestmentCertificateJob unexpected error for club investment #{club_investment_id}: #{e.message}\n#{e.backtrace.join("\n")}"
  end
end