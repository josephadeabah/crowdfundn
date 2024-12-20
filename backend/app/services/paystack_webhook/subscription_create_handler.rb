class PaystackWebhook::SubscriptionCreateHandler
  def initialize(data)
    @data = data
  end

  def call
    subscription_code = @data[:subscription_code]
    Rails.logger.debug "Processing subscription creation: subscription #{subscription_code}"

    # Check if the event has already been processed (optional deduplication)
    if EventProcessed.exists?(event_id: @data[:event_id])
      Rails.logger.info "Subscription creation event already processed: #{@data[:event_id]}"
      return # Ignore duplicate events
    end

    ActiveRecord::Base.transaction do
      handle_subscription_success if @data.present?
    end
  rescue StandardError => e
    Rails.logger.error "Error processing subscription creation: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: @data[:event_id])
  end

  private

  def handle_subscription_success
    subscription_code = @data[:subscription_code]
    email = @data.dig(:customer, :email)
    subscriber_name = @data.dig(:customer, :first_name)
    plan = @data[:plan]
    authorization = @data[:authorization]

    # Find the campaign by plan ID (plan name matches campaign title)
    campaign = Campaign.find_by(title: plan[:name])
    raise "Campaign with name #{plan[:name]} not found" unless campaign

    subscription_status = @data[:status]
    if subscription_status == 'active'
      # Initialize or find the subscription by its subscription_code
      subscription = Subscription.find_or_initialize_by(subscription_code: subscription_code)
      
      # Verify the subscription before updating
      response = PaystackService.new.verify_subscription(subscription_code)
      raise "Subscription verification failed" unless response[:status] == true

      # Proceed to update the subscription record
      subscription.update!(
        user_id: campaign.fundraiser_id,
        campaign_id: campaign.id,
        subscription_code: subscription_code,
        email_token: @data[:email_token],
        email: email,
        subscriber_name: subscriber_name,
        interval: plan[:interval],
        amount: (@data[:amount] / 100).to_i,  # Convert to proper currency unit (assuming cedis)
        next_payment_date: @data[:next_payment_date],
        status: @data[:status],
        card_type: authorization[:card_type],
        last4: authorization[:last4],
        plan_code: plan[:plan_code],
        created_at: @data[:createdAt]
      )

      # Send subscription confirmation email
      SubscriptionConfirmationEmailService.send_confirmation_email(subscription)
    else
      # Update status to failed if subscription is not active
      subscription.update!(status: subscription_status)
      raise "Subscription status is #{subscription_status}"
    end
  end
end
