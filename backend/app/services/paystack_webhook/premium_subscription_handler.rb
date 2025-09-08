# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
      Rails.logger.info "PremiumSubscriptionHandler initialized with data: #{@data.inspect}"
    end

    def call
      Rails.logger.info "PremiumSubscriptionHandler called with data keys: #{@data.keys}"

      # Decide what kind of subscription event this is
      if @data[:subscription_code].present? && @data[:createdAt].present?
        Rails.logger.info "Handling subscription creation event"
        handle_subscription_creation
      elsif @data[:subscription_code].present? && @data[:status] == 'disabled'
        Rails.logger.info "Handling subscription cancellation event"
        handle_subscription_cancellation
      elsif @data[:reference].present? && @metadata[:premium_access]
        Rails.logger.info "Handling charge success event"
        handle_charge_success
      else
        Rails.logger.warn "Unknown event type or missing required data"
      end
    end

    private

    # -------------------------
    # charge.success handler
    # -------------------------
    def handle_charge_success
      transaction_reference = @data[:reference]
      Rails.logger.info "Processing charge.success for ref: #{transaction_reference}"

      user_id       = @metadata[:user_id]
      plan_id       = @metadata[:premium_plan_id]
      is_recurring  = ActiveModel::Type::Boolean.new.cast(@metadata[:is_recurring])
      plan_interval = @metadata[:plan_interval]

      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)

      unless user && plan
        Rails.logger.error "User or plan not found for charge.success"
        return
      end

      amount_paid = @data[:amount].to_f / 100
      currency    = @data[:currency]
      paid_at     = Time.parse(@data[:paid_at]) rescue Time.current
      expires_at  = calculate_end_date(plan, paid_at)

      # Create or update subscription
      subscription = PremiumSubscription.find_or_initialize_by(transaction_reference: transaction_reference)

      subscription.assign_attributes(
        user: user,
        premium_plan: plan,
        amount: amount_paid,
        currency: currency,
        status: 'active',
        start_date: paid_at,
        expires_at: expires_at,
        auto_renew: is_recurring, # ✅ set from metadata
        paystack_subscription_code: nil # will be updated later from subscription.create
      )

      subscription.save!

      # Update user premium flags
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: expires_at,
        premium_subscription_id: subscription.id
      )

      Rails.logger.info "Processed charge.success: subscription #{subscription.id}, recurring: #{subscription.auto_renew}"
    end

    # -------------------------
    # subscription.create handler
    # -------------------------
    def handle_subscription_creation
      subscription_code = @data[:subscription_code]
      Rails.logger.info "Processing subscription creation for code: #{subscription_code}"
      return unless subscription_code

      # Find user from customer email
      user_email = @data.dig(:customer, :email)
      unless user_email
        Rails.logger.error "No user email found in customer data"
        return
      end

      user = User.find_by(email: user_email)
      unless user
        Rails.logger.error "User not found with email: #{user_email}"
        return
      end

      # Find plan by name (strip suffix like " - monthly")
      plan_name = @data.dig(:plan, :name)
      unless plan_name
        Rails.logger.error "No plan name found in plan data"
        return
      end

      base_plan_name = plan_name.gsub(/ - (monthly|quarterly|annually)$/, '')
      plan = PremiumPlan.find_by(name: base_plan_name)
      unless plan
        Rails.logger.error "Plan not found with name: #{base_plan_name}"
        return
      end

      # Dates
      created_at = Time.parse(@data[:createdAt]) rescue Time.current
      next_payment_date = Time.parse(@data[:next_payment_date]) rescue nil

      # Try to find existing subscription
      subscription = PremiumSubscription.find_by(user: user, paystack_subscription_code: subscription_code)

      if subscription
        Rails.logger.info "Updating existing subscription #{subscription.id}"
        subscription.update!(
          paystack_subscription_code: subscription_code,
          paystack_email_token: @data[:email_token],
          status: 'active',
          auto_renew: true,
          next_payment_date: next_payment_date,
          expires_at: calculate_end_date(plan, created_at)
        )
      else
        # Look for charge.success-created subscription without code
        subscription = PremiumSubscription
                         .where(user: user, paystack_subscription_code: nil)
                         .order(created_at: :desc)
                         .first

        # Or try by transaction_reference
        if @data[:transaction_reference].present?
          subscription ||= PremiumSubscription.find_by(transaction_reference: @data[:transaction_reference])
        end

        if subscription
          Rails.logger.info "Updating subscription #{subscription.id} with subscription_code: #{subscription_code}"
          subscription.update!(
            paystack_subscription_code: subscription_code,
            paystack_email_token: @data[:email_token],
            auto_renew: true,
            next_payment_date: next_payment_date,
            expires_at: calculate_end_date(plan, created_at)
          )
        else
          # Otherwise create new subscription
          subscription = PremiumSubscription.create!(
            user: user,
            premium_plan: plan,
            paystack_subscription_code: subscription_code,
            paystack_email_token: @data[:email_token],
            status: 'active',
            start_date: created_at,
            expires_at: calculate_end_date(plan, created_at),
            next_payment_date: next_payment_date,
            amount: @data[:amount].to_f / 100,
            currency: @data.dig(:plan, :currency),
            auto_renew: true,
            transaction_reference: "sub_#{subscription_code}"
          )
          Rails.logger.info "Created new subscription: #{subscription.id}"
        end
      end

      # Update user premium flags
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan, created_at),
        premium_subscription_id: subscription.id
      )

      Rails.logger.info "Successfully processed subscription creation"
    end

    # -------------------------
    # subscription.cancel handler
    # -------------------------
    def handle_subscription_cancellation
      subscription_code = @data[:subscription_code]
      Rails.logger.info "Processing subscription cancellation for code: #{subscription_code}"
      return unless subscription_code

      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      unless subscription
        Rails.logger.error "Subscription not found with code: #{subscription_code}"
        return
      end

      subscription.update!(status: 'cancelled', auto_renew: false)
      subscription.user.downgrade_from_premium

      # Send cancellation email
      PremiumSubscriptionEmailService.send_cancellation_email(subscription.user, subscription)

      Rails.logger.info "Successfully cancelled premium subscription: #{subscription_code}"
    end

    # -------------------------
    # Helpers
    # -------------------------
    def extract_subscription_code(data)
      code = data[:subscription_code] ||
             data[:subscription] ||
             (data[:authorization] && data[:authorization][:subscription_code]) ||
             (data[:plan] && data[:plan][:subscription_code])

      Rails.logger.info "Extracted subscription code: #{code}"
      code
    end

    def calculate_end_date(plan, start_date)
      # Prefer Paystack metadata interval if present
      interval = @metadata[:plan_interval] || plan.interval

      case interval
      when 'one_time'
        start_date + 1.month
      when 'monthly'
        start_date + 1.month
      when 'quarterly'
        start_date + 3.months
      when 'annually'
        start_date + 1.year
      else
        start_date + 1.month
      end
    end
  end
end
