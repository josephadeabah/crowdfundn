class SubscriptionEmailJob < ApplicationJob
  queue_as :mailers

  def perform(subscription_id)
    subscription = Subscription.find(subscription_id)
    UserMailer.subscription_success_email(subscription).deliver_now
  end
end
