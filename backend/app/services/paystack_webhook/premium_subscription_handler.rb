# app/services/paystack_webhook/handlers/premium_subscription_handler.rb
module PaystackWebhook
  module Handlers
    class PremiumSubscriptionHandler
      include PaystackWebhook::JsonHelper

      def initialize(data, event_type)
        @data = data.deep_symbolize_keys
        @event_type = event_type
      end

      def call
        metadata = @data[:metadata]&.with_indifferent_access || {}

        case @event_type
        when "charge.success"
          handle_charge_success(metadata)
        when "subscription.create"
          handle_subscription_create(metadata)
        when "subscription.disable", "subscription.not_renew"
          handle_subscription_disable(metadata)
        when "subscription.charge.failed"
          handle_subscription_charge_failed(metadata)
        else
          Rails.logger.info "Unhandled PremiumSubscription event: #{@event_type}"
        end
      end

      private

      # -------------------------
      # charge.success
      # -------------------------
      def handle_charge_success(metadata)
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
          auto_renew: metadata_auto_renew?(metadata),
          is_recurring: metadata_auto_renew?(metadata),
          paystack_subscription_code: nil, # set on subscription.create
          start_date: Time.current,
          expires_at: calculate_expiry(premium_plan)
        )

        Rails.logger.info "Created premium subscription ##{subscription.id} for user #{user.id}"
      end

      # -------------------------
      # subscription.create
      # -------------------------
      def handle_subscription_create(_metadata)
        subscription_code = @data[:subscription_code]
        email_token       = @data[:email_token]
        customer_email    = dig_value(@data, :customer, :email)

        user = User.find_by(email: customer_email)
        return unless user

        subscription = user.premium_subscriptions
                           .where(paystack_subscription_code: nil, status: "active")
                           .order(created_at: :desc)
                           .first

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

        Rails.logger.info "Linked subscription_code #{subscription_code} to subscription ##{subscription.id}"
      end

      # -------------------------
      # subscription.disable / not_renew
      # -------------------------
      def handle_subscription_disable(_metadata)
        subscription_code = @data[:subscription_code]
        subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
        return unless subscription

        subscription.update!(status: "cancelled", auto_renew: false)
        Rails.logger.info "Cancelled premium subscription ##{subscription.id} via webhook"
      end

      # -------------------------
      # subscription.charge.failed
      # -------------------------
      def handle_subscription_charge_failed(_metadata)
        subscription_code = @data[:subscription_code]
        subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
        return unless subscription

        subscription.update!(status: "inactive")
        Rails.logger.info "Marked subscription ##{subscription.id} as inactive due to failed charge"
      end

      # -------------------------
      # Helpers
      # -------------------------
      def dig_value(data, *keys)
        keys.reduce(data) { |acc, key| acc.is_a?(Hash) ? acc[key] : nil }
      end

      def metadata_auto_renew?(metadata)
        metadata.is_a?(Hash) ? metadata[:is_recurring].to_s == "true" : false
      end

      def calculate_expiry(plan)
        return nil unless plan

        case plan.interval
        when "monthly"
          1.month.from_now
        when "quarterly"
          3.months.from_now
        when "annually"
          1.year.from_now
        when "one_time"
          nil
        else
          1.month.from_now
        end
      end
    end
  end
end
