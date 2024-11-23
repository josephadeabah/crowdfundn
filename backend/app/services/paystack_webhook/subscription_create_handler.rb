class PaystackWebhook::SubscriptionCreateHandler
    def initialize(data)
      @data = data
    end
  
    def call
      # Extract necessary data from the webhook payload
      subscription_code = @data[:subscription_code]
      email = @data.dig(:customer, :email)
      plan = @data[:plan]
      authorization = @data[:authorization]
  
      # Find associated donation record
      transaction_reference = @data[:reference]
      donation = Donation.find_by(transaction_reference: transaction_reference)
      raise "Donation not found" unless donation
  
      # Find or create a subscription record
      subscription = Subscription.find_or_initialize_by(subscription_code: subscription_code)
      subscription.update!(
        user_id: donation.campaign.fundraiser.id,
        campaign_id: donation.campaign.id,
        email: email,
        interval: plan[:interval],
        amount: @data[:amount],
        next_payment_date: @data[:next_payment_date],
        status: @data[:status],
        card_type: authorization[:card_type],
        last4: authorization[:last4],
        plan_code: plan[:plan_code],
        created_at: @data[:createdAt]
      )
  
      # Send a confirmation email
      SubscriptionConfirmationEmailService.send_confirmation_email(subscription)
    rescue => e
      Rails.logger.error "Error handling subscription.create webhook: #{e.message}"
      raise
    end
end
  