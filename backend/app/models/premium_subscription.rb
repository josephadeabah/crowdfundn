# app/models/premium_subscription.rb
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
  
  def cancel!
    # Cancel on Paystack first if we have a subscription code
    if paystack_subscription_code.present?
      paystack_service = PaystackService.new
      paystack_service.cancel_subscription(
        subscription_code: paystack_subscription_code,
        email_token: user.email
      )
    end
    
    # Then update local status
    update(status: 'cancelled', auto_renew: false)
  end
end