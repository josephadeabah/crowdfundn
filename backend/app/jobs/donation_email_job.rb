class DonationEmailJob < ApplicationJob
  queue_as :mailers

  def perform(donation_id)
    donation = Donation.find(donation_id)
    UserMailer.donation_success_email(donation).deliver_now
  end
end
