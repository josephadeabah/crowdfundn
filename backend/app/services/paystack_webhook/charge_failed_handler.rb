class PaystackWebhook::ChargeFailedHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    subscription_code = @data[:subscription_code]
    Rails.logger.debug "Processing charge failed: #{transaction_reference} or subscription #{subscription_code}"

    # Check if the event has already been processed (deduplication)
    if EventProcessed.exists?(event_id: transaction_reference)
      Rails.logger.info "Charge failed event already processed: #{transaction_reference}"
      return # Ignore duplicate events
    end

    # Handle donation failure
    if transaction_reference.present?
      handle_donation_failure
    end

    # Handle subscription failure
    if subscription_code.present?
      handle_subscription_failure
    end
  rescue StandardError => e
    Rails.logger.error "Error processing charge failed: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: transaction_reference)
  end

  private

  def handle_donation_failure
    donation = Donation.find_by(transaction_reference: @data[:reference])
    
    if donation
      Rails.logger.info "Updating donation status to 'failed' for reference: #{@data[:reference]}"
      donation.update!(status: 'failed')
    else
      Rails.logger.error "Donation not found for transaction: #{@data[:reference]}"
    end
  end

  def handle_subscription_failure
    subscription = Subscription.find_by(subscription_code: @data[:subscription_code])
    
    if subscription
      Rails.logger.info "Updating subscription status to 'failed' for code: #{@data[:subscription_code]}"
      subscription.update!(status: 'failed')
    else
      Rails.logger.error "Subscription not found: #{@data[:subscription_code]}"
    end
  end
end
