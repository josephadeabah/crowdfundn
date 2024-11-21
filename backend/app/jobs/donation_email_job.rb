class DonationEmailJob < ApplicationJob
  queue_as :mailers
  # default to: -> { Admin.pluck(:email) }, from: 'help@bantuhive.com'

  def perform(donation)
    Rails.logger.info "Starting DonationEmailJob for donation ID: #{donation.id}"
    UserMailer.donation_success_email(donation).deliver_now
    Rails.logger.info "DonationEmailJob completed for donation ID: #{donation.id}"
  end
end
