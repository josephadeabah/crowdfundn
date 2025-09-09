module PaystackWebhook
  class PremiumSubscriptionHandler
    include JsonHelper

    def initialize(data)
      @data = data.deep_symbolize_keys
      Rails.logger.info "PremiumSubscriptionHandler initialized with data: #{@data}"
    end

    def call(event_type = :charge_success)
      case event_type
      when :charge_success
        handle_charge_success
      when :subscription_create
        handle_subscription_create
      when :subscription_disable
        handle_subscription_disable
      else
        Rails.logger.warn "Unhandled premium subscription event: #{event_type}"
      end
    end

    private

    def handle_charge_success
      metadata = @data[:metadata] || {}
      user_id  = metadata[:user_id]
      plan_id  = metadata[:premium_plan_id]
      is_recurring = ActiveModel::Type::Boolean.new.cast(metadata[:is_recurring])

      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)
      
      unless user && plan
        Rails.logger.error "User or Plan not found: user_id=#{user_id}, plan_id=#{plan_id}"
        return
      end

      # Find or create subscription
      subscription = PremiumSubscription.find_or_initialize_by(
        transaction_reference: @data[:reference]
      )

      # ✅ FIX: Check if subscription code exists in the event data
      subscription_code = @data.dig(:subscription, :subscription_code)

      subscription.assign_attributes(
        user: user,
        premium_plan: plan,
        amount: @data[:amount].to_f / 100, # Convert from kobo/pesewa
        currency: @data[:currency],
        status: 'active',
        start_date: Time.current,
        expires_at: calculate_end_date(plan, Time.current),
        auto_renew: is_recurring, # ✅ Set auto_renew based on metadata
        paystack_subscription_code: subscription_code # This might be nil initially
      )

      if subscription.save
        # ✅ CRITICAL: Update user's premium status
        update_user_premium_status(user, plan, subscription_code)
        
        Rails.logger.info "Premium subscription activated for User##{user.id}, Plan##{plan.id}"
        
        # ✅ Log if subscription code is missing for recurring subscription
        if is_recurring && subscription_code.nil?
          Rails.logger.info "Subscription code not available yet for recurring subscription. It will come in a subscription.create event."
        end
      else
        Rails.logger.error "Failed to save subscription: #{subscription.errors.full_messages}"
      end
    end

    def handle_subscription_create
      subscription_code = @data[:subscription_code]
      email_token       = @data[:email_token]
      
      # ✅ FIX: Find subscription by transaction reference or customer code
      subscription = find_subscription_for_creation(subscription_code)
      
      unless subscription
        Rails.logger.error "Subscription not found for subscription_code: #{subscription_code}"
        return
      end

      subscription.update!(
        paystack_subscription_code: subscription_code,
        paystack_email_token: email_token,
        auto_renew: true # ✅ Ensure auto_renew is set to true for recurring
      )

      # ✅ Also update the user's premium_subscription_id
      user = subscription.user
      user.update_columns(
        premium_subscription_id: subscription_code,
        updated_at: Time.current
      )

      Rails.logger.info "Premium subscription updated with Paystack codes for Subscription##{subscription.id}"
    end

    def find_subscription_for_creation(subscription_code)
      # Try to find by customer code first (if available)
      customer_code = @data.dig(:customer, :customer_code)
      if customer_code
        subscription = PremiumSubscription.find_by(user_id: User.find_by(customer_code: customer_code)&.id)
        return subscription if subscription
      end
      
      # Fallback: find by subscription code in user's premium_subscription_id
      user = User.find_by(premium_subscription_id: subscription_code)
      user&.premium_subscriptions&.last
    end

    def handle_subscription_disable
      subscription_code = @data[:subscription_code]
      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      unless subscription
        Rails.logger.error "Subscription not found for paystack_subscription_code: #{subscription_code}"
        return
      end

      subscription.update!(status: :cancelled, auto_renew: false)
      
      # ✅ Also update user's premium status
      user = subscription.user
      user.update_columns(
        premium_access: false,
        premium_plan_id: nil,
        premium_expires_at: nil,
        premium_subscription_id: nil,
        updated_at: Time.current
      )
      
      Rails.logger.info "Premium subscription disabled for Subscription##{subscription.id}"
    end

    def update_user_premium_status(user, plan, subscription_code = nil)
      user.update_columns(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan, Time.current),
        premium_subscription_id: subscription_code,
        updated_at: Time.current
      )
      Rails.logger.info "Updated premium status for User##{user.id}"
    end

    def calculate_next_payment_date(plan, paid_at)
      start_date = paid_at.is_a?(String) ? Time.parse(paid_at) : paid_at
      case plan.interval
      when "monthly"   then start_date + 1.month
      when "quarterly" then start_date + 3.months
      when "annually"  then start_date + 1.year
      else start_date + 1.month
      end
    end

    def calculate_end_date(plan, paid_at)
      calculate_next_payment_date(plan, paid_at)
    end
  end
end