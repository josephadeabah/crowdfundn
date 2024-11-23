class PaystackWebhook::SubscriptionDisabledHandler
    def initialize(data)
      @data = data
    end
  
    def call
      subscription_code = @data[:subscription_code]
      email_token = @data[:email_token]
  
      paystack_service = PaystackService.new
      response = paystack_service.cancel_subscription(
        subscription_code: subscription_code,
        email_token: email_token
      )
  
      if response[:status]
        subscription = Subscription.find_by(subscription_code: subscription_code)
        if subscription
          subscription.update!(status: 'inactive')
        else
          Rails.logger.error "Subscription not found: #{subscription_code}"
          raise "Subscription not found"
        end
      else
        Rails.logger.error "Failed to disable subscription: #{response[:message]}"
        raise "Subscription disabling failed: #{response[:message]}"
      end
    end
end
  