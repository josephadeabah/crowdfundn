class UserMailer < ApplicationMailer
    default from: 'no-reply@bantuhive.com'
  
    def donation_success_email(donation)
      @donation = donation
      @campaign = donation.campaign
  
      mail(
        to: @donation.email, # Correctly access email from the donation object
        subject: 'Thank you for your donation!'
      )
    end
  
    def subscription_success_email(subscription)
      @subscription = subscription
      @user = subscription.user
  
      mail(
        to: @user.email,
        subject: 'Subscription Activated'
      )
    end
end
  