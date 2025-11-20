# app/jobs/club_investment_certificate_job.rb
class ClubInvestmentCertificateJob < ApplicationJob
  queue_as :default

  def perform(club_investment_id)
    club_investment = ClubInvestment.find(club_investment_id)
    
    Rails.logger.info "Starting certificate generation for club investment #{club_investment_id}"
    
    success = ClubInvestmentCertificateService.generate_certificate(club_investment)
    
    if success
      Rails.logger.info "Successfully generated certificate for club investment #{club_investment_id}"
    else
      Rails.logger.error "Failed to generate certificate for club investment #{club_investment_id}"
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error "ClubInvestmentCertificateJob failed: Club investment #{club_investment_id} not found - #{e.message}"
  rescue => e
    Rails.logger.error "ClubInvestmentCertificateJob unexpected error for club investment #{club_investment_id}: #{e.message}\n#{e.backtrace.join("\n")}"
  end
end