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
      return unless user && plan

      # Find or create subscription
      subscription = PremiumSubscription.find_or_initialize_by(
        transaction_reference: @data[:reference]
      )

      subscription.assign_attributes(
        user: user,
        premium_plan: plan,
        amount: @data[:amount].to_f / 100, # Convert from kobo/pesewa
        currency: @data[:currency],
        status: 'active',
        start_date: Time.current,
        expires_at: calculate_end_date(plan, Time.current),
        auto_renew: is_recurring,
        paystack_subscription_code: @data.dig(:subscription, :subscription_code),
        customer_code: @data.dig(:customer, :customer_code)
      )

      if subscription.save
        # ✅ CRITICAL FIX: Update user's premium status for both recurring and one-time
        user.update_columns(
          premium_access: true,
          premium_plan_id: plan.id,
          premium_expires_at: calculate_end_date(plan, Time.current),
          premium_subscription_id: @data.dig(:subscription, :subscription_code),
          updated_at: Time.current
        )
        
        Rails.logger.info "Premium subscription activated for User##{user.id}, Plan##{plan.id}"
      else
        Rails.logger.error "Failed to save subscription: #{subscription.errors.full_messages}"
      end
    end

    def handle_subscription_create
      subscription_code = @data[:subscription_code]
      email_token       = @data[:email_token]
      customer_code     = @data.dig(:customer, :customer_code)

      subscription = PremiumSubscription.find_by(customer_code: customer_code)
      return unless subscription

      subscription.update!(
        paystack_subscription_code: subscription_code,
        paystack_email_token: email_token,
        auto_renew: true
      )

      # ✅ Also update the user's premium_subscription_id
      user = subscription.user
      user.update_columns(
        premium_subscription_id: subscription_code,
        updated_at: Time.current
      )

      Rails.logger.info "Premium subscription updated with Paystack codes for Subscription##{subscription.id}"
    end

    def handle_subscription_disable
      subscription_code = @data[:subscription_code]
      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return unless subscription

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