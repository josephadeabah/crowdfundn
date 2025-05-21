# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      
      # Check for duplicate processing
      if EventProcessed.exists?(event_id: transaction_reference)
        Rails.logger.info "Premium subscription already processed: #{transaction_reference}"
        return
      end

      ActiveRecord::Base.transaction do
        # Verify transaction with Paystack
        response = PaystackService.new.verify_transaction(transaction_reference)
        unless response[:status] == true && response.dig(:data, :status) == 'success'
          raise 'Premium subscription verification failed'
        end

        metadata = parse_metadata(response)
        
        # Only process if this is a premium subscription
        if metadata[:premium_access]
          user = User.find(metadata[:user_id])
          process_premium_subscription(user, response, metadata)
        end
      end
    rescue StandardError => e
      Rails.logger.error "Error processing premium subscription: #{e.message}"
      raise e
    ensure
      EventProcessed.create(event_id: transaction_reference)
    end

    private

    def parse_metadata(response)
      if response.dig(:data, :metadata).is_a?(String)
        JSON.parse(response.dig(:data, :metadata), symbolize_names: true)
      else
        response.dig(:data, :metadata) || {}
      end
    rescue JSON::ParserError
      {}
    end

    def process_premium_subscription(user, response, metadata)
      amount = response.dig(:data, :amount).to_f / 100.0
      reference = response.dig(:data, :reference)
      
      # Create premium subscription record
      subscription = PremiumSubscription.create!(
        user: user,
        amount: amount,
        transaction_reference: reference,
        plan_name: metadata[:plan_name] || 'Premium',
        expires_at: 1.month.from_now,
        status: 'active'
      )

      # Update user's premium access
      user.update!(
        premium_access: true,
        premium_expires_at: subscription.expires_at,
        premium_plan: subscription.plan_name
      )

      # Send confirmation email
      PremiumSubscriptionMailer.confirmation(user, subscription).deliver_later
    end
  end
end