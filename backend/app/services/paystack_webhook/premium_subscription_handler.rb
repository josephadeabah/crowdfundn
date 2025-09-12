# app/services/paystack_webhook/handlers/premium_subscription_handler.rb
module PaystackWebhook
  module Handlers
    class PremiumSubscriptionHandler
      include PaystackWebhook::JsonHelper

      def initialize(data)
        @data = data.deep_symbolize_keys
      end

      def call
        event = @data[:event]
        payload = @data[:data]
        metadata = payload[:metadata]&.with_indifferent_access || {}

        case event
        when "charge.success"
          handle_one_time_payment(payload, metadata)
        when "subscription.create"
          handle_subscription_create(payload, metadata)
        when "subscription.disable"
          handle_subscription_disable(payload, metadata)
        when "invoice.payment_failed"
          handle_payment_failed(payload, metadata)
        else
          Rails.logger.info "Unhandled premium subscription event: #{event}"
        end
      end

      private

      def handle_one_time_payment(payload, metadata)
        return unless metadata[:type] == "premium_subscription"

        user = User.find_by(id: metadata[:user_id])
        plan = PremiumPlan.find_by(id: metadata[:premium_plan_id])

        return unless user && plan

        PremiumSubscription.create!(
          user: user,
          premium_plan: plan,
          transaction_reference: payload[:reference],
          status: "active",
          start_date: Time.zone.parse(payload[:paid_at]),
          expires_at: plan.expires_at_from(Time.zone.parse(payload[:paid_at])),
          auto_renew: false
        )
      end

      def handle_subscription_create(payload, metadata)
        return unless metadata[:type] == "premium_subscription"

        user = User.find_by(id: metadata[:user_id])
        plan = PremiumPlan.find_by(id: metadata[:premium_plan_id])

        return unless user && plan

        PremiumSubscription.create!(
          user: user,
          premium_plan: plan,
          transaction_reference: payload[:reference],
          status: "active",
          start_date: Time.zone.parse(payload[:createdAt]),
          expires_at: plan.expires_at_from(Time.zone.parse(payload[:createdAt])),
          auto_renew: true,
          paystack_subscription_code: payload[:subscription_code]
        )
      end

      def handle_subscription_disable(payload, metadata)
        subscription = PremiumSubscription.find_by(
          paystack_subscription_code: payload[:subscription_code]
        )

        if subscription
          subscription.update!(status: "cancelled")
        end
      end

      def handle_payment_failed(payload, metadata)
        subscription = PremiumSubscription.find_by(
          paystack_subscription_code: payload[:subscription_code]
        )

        if subscription
          subscription.update!(status: "inactive")
        end
      end
    end
  end
end
