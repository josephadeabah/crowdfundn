class UserMailer < ApplicationMailer
    default from: 'no-reply@yourdomain.com'
  
    def charge_success_email(user, donation)
      @user = user
      @donation = donation
      mail(to: @user.email, subject: 'Your Donation Was Successful!')
    end
  
    def charge_failed_email(user, donation)
      @user = user
      @donation = donation
      mail(to: @user.email, subject: 'Your Donation Failed')
    end
  
    def subscription_created_email(user, campaign)
      @user = user
      @campaign = campaign
      mail(to: @user.email, subject: 'Subscription Created Successfully')
    end
  
    def subscription_failed_email(user)
      @user = user
      mail(to: @user.email, subject: 'Subscription Charge Failed')
    end
  
    def subscription_disabled_email(user)
      @user = user
      mail(to: @user.email, subject: 'Subscription Disabled')
    end
end
  