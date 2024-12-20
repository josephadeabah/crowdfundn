class PaystackWebhook::SubscriptionChargeFailedHandler
  def initialize(data)
    @data = data
  end

  def call
    subscription_code = @data[:subscription_code]
    Rails.logger.debug "Processing subscription charge failed: #{subscription_code}"

    # Check if the event has already been processed (deduplication)
    if EventProcessed.exists?(event_id: subscription_code)
      Rails.logger.info "Subscription charge failed event already processed: #{subscription_code}"
      return # Ignore duplicate events
    end

    # Handle the subscription failure
    handle_subscription_failure(subscription_code)
  rescue StandardError => e
    Rails.logger.error "Error processing subscription charge failed: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: subscription_code)
  end

  private

  def handle_subscription_failure(subscription_code)
    subscription = Subscription.find_by(subscription_code: subscription_code)
    
    if subscription
      Rails.logger.info "Updating subscription status to 'failed' for code: #{subscription_code}"
      subscription.update!(status: 'failed')
    else
      Rails.logger.error "Subscription not found for code: #{subscription_code}"
      raise "Subscription not found"
    end
  end
end
