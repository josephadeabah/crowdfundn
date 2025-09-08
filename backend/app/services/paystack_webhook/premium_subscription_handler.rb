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
      user_id     = @data.dig(:metadata, :user_id)
      plan_id     = @data.dig(:metadata, :premium_plan_id)
      subscription_code = @data[:subscription_code]
      email_token = @data[:email_token]
      next_payment_date = @data[:next_payment_date]
      created_at  = @data[:created_at]

      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)

      unless user && plan
        Rails.logger.error "User or plan not found for subscription creation: user_id=#{user_id}, plan_id=#{plan_id}"
        return
      end

      # Try finding by subscription_code first
      subscription = PremiumSubscription.find_by(
        user: user,
        paystack_subscription_code: subscription_code
      )

      # If not found, fall back to transaction_reference (from charge.success)
      subscription ||= PremiumSubscription.find_by(
        user: user,
        transaction_reference: @data[:transaction_reference]
      )

      # If still not found, grab the most recent nil subscription
      subscription ||= PremiumSubscription.where(
        user: user,
        paystack_subscription_code: nil
      ).order(created_at: :desc).first

      if subscription
        subscription.update!(
          paystack_subscription_code: subscription_code,
          paystack_email_token: email_token,
          auto_renew: true,
          is_recurring: true, # explicitly mark as recurring
          next_payment_date: next_payment_date,
          expires_at: calculate_end_date(plan, created_at)
        )
        Rails.logger.info "Updated existing PremiumSubscription #{subscription.id} with subscription_code=#{subscription_code}"
      else
        PremiumSubscription.create!(
          user: user,
          premium_plan: plan,
          paystack_subscription_code: subscription_code,
          paystack_email_token: email_token,
          auto_renew: true,
          is_recurring: true,
          next_payment_date: next_payment_date,
          expires_at: calculate_end_date(plan, created_at),
          status: :active,
          transaction_reference: @data[:transaction_reference]
        )
        Rails.logger.info "Created new PremiumSubscription for user #{user.id} with subscription_code=#{subscription_code}"
      end
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
