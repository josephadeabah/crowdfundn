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

      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)
      return unless user && plan

      subscription = PremiumSubscription.find_or_initialize_by(
        user: user,
        premium_plan: plan
      )

      subscription.update!(
        status: :active,
        auto_renew: ActiveModel::Type::Boolean.new.cast(metadata[:is_recurring]),
        next_payment_date: calculate_next_payment_date(plan, @data[:paid_at]),
        expires_at: calculate_end_date(plan, @data[:paid_at]),
      )

      Rails.logger.info "Premium subscription activated for User##{user.id}, Plan##{plan.id}"
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

      Rails.logger.info "Premium subscription updated with Paystack codes for Subscription##{subscription.id}"
    end

    def handle_subscription_disable
      subscription_code = @data[:subscription_code]
      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return unless subscription

      subscription.update!(status: :cancelled, auto_renew: false)
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
