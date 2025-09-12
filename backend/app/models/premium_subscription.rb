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
    # Cancel on Paystack first if we have a subscription code and email token
    if paystack_subscription_code.present? && paystack_email_token.present?
      paystack_service = PaystackService.new
      response = paystack_service.cancel_subscription(
        code: paystack_subscription_code,
        token: paystack_email_token 
      )
      
      # Check if Paystack cancellation was successful
      unless response[:status]
        Rails.logger.error("Failed to cancel Paystack subscription: #{response[:message]}")
        # Continue with local cancellation even if Paystack fails
      end
    elsif paystack_subscription_code.present?
      Rails.logger.warn("Cannot cancel Paystack subscription: missing email token")
    end
    
    # Always update local status
    update(status: 'cancelled', auto_renew: false)
  end

  def self.update_with_subscription_data(subscription_code, email_token, plan_code = nil)
    subscription = find_by(paystack_subscription_code: subscription_code)
    return unless subscription
    
    updates = {
      paystack_email_token: email_token,
      status: 'active',
      auto_renew: true
    }
    
    if plan_code.present?
      plan = PremiumPlan.find_by(paystack_plan_code: plan_code)
      updates[:premium_plan] = plan if plan
    end
    
    subscription.update(updates)
  end

  def self.find_by_authorization(authorization_code, user_id)
    # This is a placeholder - you might need to store authorization codes
    # For now, we'll just find the most recent subscription for the user
    where(user_id: user_id)
      .where('created_at >= ?', 5.minutes.ago)
      .order(created_at: :desc)
      .first
  end

  def self.update_subscription_code(subscription_id, subscription_code, email_token)
    subscription = find_by(id: subscription_id)
    return unless subscription
    
    subscription.update(
      paystack_subscription_code: subscription_code,
      paystack_email_token: email_token
    )
  end
end