# app/jobs/certificate_generation_job.rb (kept as job for compatibility)
class CertificateGenerationJob < ApplicationJob
  queue_as :default

  def perform(investment_id)
    CertificateGenerationService.generate_for_investment(investment_id)
  end
end