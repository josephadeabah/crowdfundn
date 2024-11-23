class PaystackWebhook::SubscriptionChargeFailedHandler
    def initialize(data)
      @data = data
    end
  
    def call
      subscription_code = @data[:subscription_code]
      Rails.logger.debug "Processing subscription charge failed: #{subscription_code}"
  
      subscription = Subscription.find_by(subscription_code: subscription_code)
      if subscription
        subscription.update!(status: 'failed')
      else
        Rails.logger.error "Subscription not found: #{subscription_code}"
        raise "Subscription not found"
      end
    end
end
  