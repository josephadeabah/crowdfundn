class UserMailer < ApplicationMailer
    default from: 'help@bantuhive.com'
  
    def donation_success_email(donation)
      @donation = donation  
      mail(
        to: @donation.customer.email, # Correctly access email from the donation object
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
  