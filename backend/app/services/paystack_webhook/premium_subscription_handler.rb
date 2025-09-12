module PaystackWebhook
  module Handlers
    class PremiumSubscriptionHandler
      include PaystackWebhook::JsonHelper

      def initialize(event, data)
        @event = event
        @data  = data.deep_symbolize_keys
      end

      def call
        case @event
        when "charge.success"
          handle_charge_success
        when "subscription.create"
          handle_subscription_create
        else
          Rails.logger.info "Unhandled PremiumSubscription event: #{@event}"
        end
      end

      private

      # -------------------------
      # STEP 1: charge.success
      # -------------------------
      def handle_charge_success
        customer_email = dig_value(@data, :customer, :email)
        plan_code      = dig_value(@data, :plan)
        reference      = @data[:reference]

        user = User.find_by(email: customer_email)
        return unless user

        premium_plan = PremiumPlan.find_by(paystack_plan_code: plan_code)

        subscription = user.premium_subscriptions.create!(
          premium_plan: premium_plan,
          status: "active",
          transaction_reference: reference,
          auto_renew: metadata_auto_renew?,
          is_recurring: metadata_auto_renew?, # mark recurring intent
          paystack_subscription_code: nil,    # will be filled at subscription.create
          started_at: Time.current
        )

        Rails.logger.info "Created subscription (##{subscription.id}) for user #{user.id} via charge.success"
      end

      # -------------------------
      # STEP 2: subscription.create
      # -------------------------
      def handle_subscription_create
        subscription_code = @data[:subscription_code]
        email_token       = @data[:email_token]
        customer_email    = dig_value(@data, :customer, :email)

        user = User.find_by(email: customer_email)
        return unless user

        # Find the most recent active subscription without subscription_code
        subscription = user.premium_subscriptions
                           .where(paystack_subscription_code: nil, status: "active")
                           .order(created_at: :desc)
                           .first

        # Fallback: look for recent subscription created within last 10 minutes
        if subscription.nil?
          subscription = user.premium_subscriptions
                             .where(status: "active", created_at: 10.minutes.ago..Time.current)
                             .order(created_at: :desc)
                             .first
        end

        return unless subscription

        subscription.update!(
          paystack_subscription_code: subscription_code,
          paystack_email_token: email_token,
          auto_renew: true,
          is_recurring: true
        )

        Rails.logger.info "Updated subscription (##{subscription.id}) with Paystack subscription_code #{subscription_code}"
      end

      # -------------------------
      # Helpers
      # -------------------------
      def dig_value(data, *keys)
        keys.reduce(data) { |acc, key| acc.is_a?(Hash) ? acc[key] : nil }
      end

      def metadata_auto_renew?
        meta = @data[:metadata]
        meta.is_a?(Hash) ? meta[:is_recurring].to_s == "true" : false
      end
    end
  end
end
