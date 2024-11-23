class PaystackWebhook::SubscriptionCreateHandler
    def initialize(data)
      @data = data
    end
  
    def call
        subscription_code = @data[:subscription_code]
        email = @data.dig(:customer, :email)
        plan = @data[:plan]
        authorization = @data[:authorization]
      
        # Use campaign_id or user email for association instead of transaction_reference
        campaign_id = @data.dig(:metadata, :campaign_id)
        donation = Donation.find_by(email: email, campaign_id: campaign_id)
      
        raise "Donation not found" unless donation
      
        subscription = Subscription.find_or_initialize_by(subscription_code: subscription_code)
        subscription.update!(
          user_id: donation.campaign.fundraiser.id,
          campaign_id: donation.campaign.id,
          subscription_code: subscription_code,
          email_token: @data[:email_token],
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
      
        SubscriptionConfirmationEmailService.send_confirmation_email(subscription)
    rescue => e
        Rails.logger.error "Error handling subscription.create webhook: #{e.message}"
        raise
    end
end
  