class PaystackWebhook::SubscriptionCreateHandler
    def initialize(data)
      @data = data
    end
  
    def call
      subscription_code = @data[:subscription_code]
      email = @data[:customer][:email]
      plan = @data[:plan]
      authorization = @data[:authorization]
      metadata = @data[:metadata] # Metadata should contain user_id and campaign_id
  
      user_id = metadata[:user_id]
      campaign_id = metadata[:campaign_id]
  
      unless user_id && campaign_id
        Rails.logger.error "Missing user_id or campaign_id in metadata: #{metadata}"
        raise "Invalid subscription metadata"
      end
  
      user = User.find_by(id: user_id)
      campaign = Campaign.find_by(id: campaign_id)
  
      unless user && campaign
        Rails.logger.error "User or campaign not found. User ID: #{user_id}, Campaign ID: #{campaign_id}"
        raise "User or campaign not found"
      end
  
      create_subscription_on_paystack(email, plan, authorization, subscription_code, user, campaign)
    end
  
    private
  
    def create_subscription_on_paystack(email, plan, authorization, subscription_code, user, campaign)
      paystack_service = PaystackService.new
      response = paystack_service.create_subscription(
        email: email,
        plan: plan,
        authorization: authorization
      )
  
      if response[:status] == false || response[:data].blank?
        Rails.logger.error "Failed to create subscription on Paystack. Response: #{response}"
        raise "Failed to create subscription on Paystack"
      end
  
      Subscription.create!(
        user: user,
        campaign: campaign,
        subscription_code: subscription_code,
        email_token: @data[:email_token],
        status: 'active'
      )
    end
end
  