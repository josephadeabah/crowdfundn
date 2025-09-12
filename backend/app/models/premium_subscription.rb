class PremiumSubscription < ApplicationRecord
  belongs_to :user
  belongs_to :premium_plan, optional: true

  STATUSES = %w[active inactive cancelled expired].freeze

  validates :status, inclusion: { in: STATUSES }
  validates :transaction_reference, presence: true, uniqueness: true

  scope :active, -> { where(status: 'active').where('expires_at > ? OR expires_at IS NULL', Time.current) }
  scope :expired, -> { where('expires_at < ?', Time.current) }

  def active?
    status == 'active' && (expires_at.nil? || expires_at > Time.current)
  end

  def expired?
    expires_at.present? && expires_at < Time.current
  end

  def cancel!
    if paystack_subscription_code.present? && paystack_email_token.present?
      paystack_service = PaystackService.new
      response = paystack_service.cancel_subscription(
        code: paystack_subscription_code,
        token: paystack_email_token
      )
      unless response[:status]
        Rails.logger.error("Failed to cancel Paystack subscription: #{response[:message]}")
      end
    end
    update(status: 'cancelled', auto_renew: false)
  end
end
