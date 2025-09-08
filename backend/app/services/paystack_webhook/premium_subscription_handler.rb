# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
    end
    
    def call
      return unless @metadata[:premium_access] && @metadata[:premium_plan_id]
      
      case @data[:event]
      when 'charge.success'
        handle_successful_payment
      when 'subscription.create'
        handle_subscription_creation
      when 'subscription.disable'
        handle_subscription_cancellation
      when 'subscription.not_renew'
        handle_non_renewal
      end
    end
    
    private
    
    def handle_successful_payment
      user = User.find(@metadata[:user_id].to_i)
      plan = PremiumPlan.find(@metadata[:premium_plan_id].to_i)
      is_recurring = @metadata[:is_recurring] == 'true'
      
      # Prevent duplicate processing
      existing_subscription = PremiumSubscription.find_by(transaction_reference: @data[:reference])
      return if existing_subscription
      
      subscription_attrs = {
        user: user,
        premium_plan: plan,
        transaction_reference: @data[:reference],
        status: 'active',
        start_date: Time.current,
        expires_at: calculate_end_date(plan),
        amount: @data[:amount].to_f / 100,
        currency: @data[:currency],
        auto_renew: is_recurring
      }
      
      # Extract subscription code for recurring payments
      if is_recurring
        subscription_code = extract_subscription_code(@data)
        if subscription_code.present?
          subscription_attrs[:paystack_subscription_code] = subscription_code
          subscription_attrs[:auto_renew] = true
        end
      end
      
      subscription = PremiumSubscription.create!(subscription_attrs)
      
      # Update user premium status
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan),
        premium_subscription_id: subscription.id
      )
      
      # Send confirmation email
      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
    end
    
    def handle_subscription_creation
      # This handles when Paystack creates a new subscription instance
      subscription_code = @data[:subscription_code]
      return unless subscription_code
      
      # Check if we already have this subscription
      existing_subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return if existing_subscription
      
      user = User.find(@metadata[:user_id])
      plan = PremiumPlan.find(@metadata[:premium_plan_id])
      
      subscription = PremiumSubscription.create!(
        user: user,
        premium_plan: plan,
        paystack_subscription_code: subscription_code,
        status: 'active',
        start_date: Time.at(@data[:created_at]),
        expires_at: calculate_end_date(plan, Time.at(@data[:created_at])),
        next_payment_date: Time.at(@data[:next_payment_date]),
        amount: plan.price,
        currency: plan.currency,
        auto_renew: true
      )
      
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan, Time.at(@data[:created_at])),
        premium_subscription_id: subscription.id
      )
    end
    
    def extract_subscription_code(data)
      data[:subscription_code] ||
      data[:subscription] ||
      (data[:authorization] && data[:authorization][:subscription_code]) ||
      (data[:plan] && data[:plan][:subscription_code])
    end
    
    def handle_subscription_cancellation
      subscription = PremiumSubscription.find_by(
        paystack_subscription_code: @data[:subscription_code]
      )
      
      if subscription
        subscription.update!(status: 'cancelled', auto_renew: false)
        subscription.user.downgrade_from_premium
        
        # Send cancellation email
        PremiumSubscriptionEmailService.send_cancellation_email(subscription.user, subscription)
      end
    end
    
    def handle_non_renewal
      subscription = PremiumSubscription.find_by(
        paystack_subscription_code: @data[:subscription_code]
      )
      
      if subscription
        subscription.update!(status: 'expired', auto_renew: false)
        subscription.user.downgrade_from_premium
        
        # Send cancellation email
        PremiumSubscriptionEmailService.send_cancellation_email(subscription.user, subscription)
      end
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