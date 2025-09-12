# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
      Rails.logger.info "PremiumSubscriptionHandler initialized"
      Rails.logger.info "Data: #{@data.inspect}"
      Rails.logger.info "Metadata: #{@metadata.inspect}"
    end

    def call(event_type = nil)
      Rails.logger.info "PremiumSubscriptionHandler.call invoked with event_type: #{event_type}"
      return unless @metadata[:premium_access] && @metadata[:premium_plan_id]

      case event_type
      when :subscription_create
        Rails.logger.info "Handling new subscription creation"
        handle_subscription_creation
      when :subscription_charge_success
        Rails.logger.info "Handling subscription renewal payment"
        handle_subscription_renewal
      when :subscription_disable
        Rails.logger.info "Handling subscription disable/cancellation"
        handle_subscription_disable
      else
        Rails.logger.warn "Unhandled premium subscription event: #{event_type}"
      end
    rescue => e
      Rails.logger.error "Error in PremiumSubscriptionHandler: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end

    private

    def handle_subscription_creation
      user, plan = fetch_user_and_plan
      return unless user && plan

      subscription_attrs = base_subscription_attrs(user, plan)
      subscription_attrs[:start_date] = Time.current
      subscription_attrs[:expires_at] = calculate_end_date(plan)

      subscription = PremiumSubscription.find_or_initialize_by(
        transaction_reference: @data[:reference]
      )

      create_or_update_subscription(subscription, subscription_attrs, user, plan)
    end

    def handle_subscription_renewal
      user, plan = fetch_user_and_plan
      return unless user && plan

      subscription_code = @data.dig(:authorization, :subscription_code) ||
                          @metadata[:subscription_code] ||
                          @data[:subscription_code]

      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      subscription ||= PremiumSubscription.new(transaction_reference: @data[:reference])

      subscription_attrs = base_subscription_attrs(user, plan)
      subscription_attrs[:start_date] = Time.current
      subscription_attrs[:expires_at] = calculate_end_date(plan, Time.current)

      create_or_update_subscription(subscription, subscription_attrs, user, plan)
    end

    def handle_subscription_disable
      user, plan = fetch_user_and_plan
      return unless user && plan

      subscription_code = @data.dig(:authorization, :subscription_code) ||
                          @metadata[:subscription_code] ||
                          @data[:subscription_code]

      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return unless subscription

      subscription.update(status: 'inactive')
      user.update_columns(premium_access: false, premium_subscription_id: nil)
      Rails.logger.info "Subscription disabled for user #{user.email}"
    end

    def fetch_user_and_plan
      user = User.find_by(id: @metadata[:user_id].to_i)
      plan = PremiumPlan.find_by(id: @metadata[:premium_plan_id].to_i)
      unless user && plan
        Rails.logger.error "User or plan not found: user_id=#{@metadata[:user_id]}, plan_id=#{@metadata[:premium_plan_id]}"
        return nil, nil
      end
      [user, plan]
    end

    def base_subscription_attrs(user, plan)
      is_recurring = @metadata[:is_recurring] == 'true'
      attrs = {
        user: user,
        premium_plan: plan,
        status: 'active',
        amount: @data[:amount].to_f / 100,
        currency: @data[:currency],
        auto_renew: is_recurring
      }

      if is_recurring
        subscription_code = @data.dig(:authorization, :subscription_code) ||
                            @metadata[:subscription_code] ||
                            @data[:subscription_code]
        attrs[:paystack_subscription_code] = subscription_code if subscription_code.present?
      end
      attrs
    end

    def create_or_update_subscription(subscription, attrs, user, plan)
      subscription.update!(attrs)
      Rails.logger.info "Subscription created/updated successfully: #{subscription.id}"

      user.update_columns(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: attrs[:expires_at],
        premium_subscription_id: subscription.id,
        updated_at: Time.current
      )
      Rails.logger.info "User premium status updated: #{user.email}"

      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
      PremiumSubscriptionEmailService.send_payment_success_email(user, subscription, @data)
    end

    def calculate_end_date(plan, start_date = Time.current)
      case plan.interval
      when 'monthly' then start_date + 1.month
      when 'quarterly' then start_date + 3.months
      when 'annually' then start_date + 1.year
      else start_date + 1.month
      end
    end
  end
end
