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
      metadata = @data[:metadata] || {}
      
      # Extract metadata (user and campaign)
      user_id = metadata[:user_id]
      campaign_id = metadata[:campaign_id]
  
      # Find associated user and campaign
      user = User.find_by(id: user_id)
      campaign = Campaign.find_by(id: campaign_id)
      raise "User or Campaign not found" unless user && campaign
  
      # Find or create a subscription record
      subscription = Subscription.find_or_initialize_by(subscription_code: subscription_code)
      subscription.update!(
        user_id: user.id,
        campaign_id: campaign.id,
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
  