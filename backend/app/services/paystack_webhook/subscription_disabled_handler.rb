class PaystackWebhook::SubscriptionDisabledHandler
  def initialize(data)
    @data = data
  end

  def call
    subscription_code = @data[:subscription_code]
    event_id = @data[:event_id] # Assuming the event ID is passed in the payload

    Rails.logger.debug { "Processing subscription disabled: #{subscription_code}" }

    # Check if the event has already been processed (optional deduplication)
    if EventProcessed.exists?(event_id: event_id)
      Rails.logger.info "Subscription disabled event already processed: #{event_id}"
      return # Ignore duplicate events
    end

    paystack_service = PaystackService.new
    response = paystack_service.cancel_subscription(
      subscription_code: subscription_code,
      email_token: @data[:email_token]
    )

    if response[:status]
      subscription = Subscription.find_by(subscription_code: subscription_code)
      if subscription
        subscription.update!(status: 'inactive')
      else
        Rails.logger.error "Subscription not found: #{subscription_code}"
        raise 'Subscription not found'
      end
    else
      Rails.logger.error "Failed to disable subscription: #{response[:message]}"
      raise "Subscription disabling failed: #{response[:message]}"
    end
  rescue StandardError => e
    Rails.logger.error "Error processing subscription disable: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: event_id)
  end
end
