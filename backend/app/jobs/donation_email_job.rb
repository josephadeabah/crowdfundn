class DonationEmailJob < ApplicationJob
  queue_as :mailers

  def perform(donation)
    Rails.logger.info "Starting DonationEmailJob for donation ID: #{donation.id}"
    UserMailer.donation_success_email(donation).deliver_now
    Rails.logger.info "DonationEmailJob completed for donation ID: #{donation.id}"
  end
end
