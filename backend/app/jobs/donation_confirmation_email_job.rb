# app/jobs/donation_confirmation_email_job.rb
class DonationConfirmationEmailJob < ApplicationJob
    queue_as :mailers
  
    def perform(donation_id)
      donation = Donation.find(donation_id)
      user = donation
  
      # Customize the email content as needed
      subject = "Thank you for your donation!"
      html_content = "<h1>Thank you, #{user.full_name}!</h1><p>Your donation of #{donation.net_amount} has been successfully processed.</p>"
      text_content = "Thank you, #{user.full_name}! Your donation of #{donation.net_amount} has been successfully processed."
  
      # Send the email
      BrevoEmailService.new(
        to: user.email,
        subject: subject,
        html_content: html_content,
        text_content: text_content
      ).send_email
    end
end