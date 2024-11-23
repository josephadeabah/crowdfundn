class PaystackWebhook::ChargeFailedHandler
    def initialize(data)
      @data = data
    end
  
    def call
      transaction_reference = @data[:reference]
      subscription_code = @data[:subscription_code]
      Rails.logger.debug "Processing charge failed: #{transaction_reference} or subscription #{subscription_code}"
  
      handle_donation_failure if transaction_reference.present?
      handle_subscription_failure if subscription_code.present?
    end
  
    private
  
    def handle_donation_failure
      donation = Donation.find_by(transaction_reference: @data[:reference])
      if donation
        donation.update!(status: 'failed')
      else
        Rails.logger.error "Donation not found for transaction: #{@data[:reference]}"
      end
    end
  
    def handle_subscription_failure
      subscription = Subscription.find_by(subscription_code: @data[:subscription_code])
      if subscription
        subscription.update!(status: 'failed')
      else
        Rails.logger.error "Subscription not found: #{@data[:subscription_code]}"
      end
    end
end
  