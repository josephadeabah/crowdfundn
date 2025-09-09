# app/models/premium_subscription.rb
class PremiumSubscription < ApplicationRecord
  belongs_to :user
  belongs_to :premium_plan, optional: true

  STATUSES = %w[active inactive cancelled expired].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :transaction_reference, presence: true

  scope :active, -> { where(status: 'active').where('expires_at > ? OR expires_at IS NULL', Time.current) }
  scope :expired, -> { where('expires_at < ?', Time.current) }

  def active?
    status == 'active' && (expires_at.nil? || expires_at > Time.current)
  end

  def cancel!
    if paystack_subscription_code.present?
      paystack_service = PaystackService.new
      
      # ✅ Use the email token from the premium_subscriptions table
      unless paystack_email_token
        Rails.logger.error("Email token missing for Paystack subscription cancellation: #{paystack_subscription_code}")
        # Fallback: just update local status without Paystack cancellation
        update(status: 'cancelled', auto_renew: false)
        return false
      end

      response = paystack_service.cancel_subscription(
        code: paystack_subscription_code,
        token: paystack_email_token # ✅ Use the email token from the subscription
      )

      unless response[:status]
        Rails.logger.error("Failed to cancel Paystack subscription: #{response[:message]}")
        # Even if Paystack cancellation fails, update local status
        update(status: 'cancelled', auto_renew: false)
        return false
      end
    end

    update(status: 'cancelled', auto_renew: false)
  end
end