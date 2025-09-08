# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      # The 'data' parameter here is actually the inner data object from the webhook
      @data = data
      @metadata = data[:metadata] || {}
    end
    
    def call
      # We need to handle this differently since we don't have access to the event type here
      # The webhook controller should pass the event type separately, or we need to restructure
      
      # For now, let's assume this is always called for premium subscription events
      # and handle based on the data we have
      
      # Check if this looks like a subscription creation event
      if @data[:subscription_code].present? && @data[:createdAt].present?
        handle_subscription_creation
      elsif @data[:subscription_code].present? && @data[:status] == 'disabled'
        handle_subscription_cancellation
      elsif @data[:reference].present? && @metadata[:premium_access]
        handle_charge_success
      end
    end
    
    private
    
    def handle_charge_success
      return unless @metadata[:premium_access] && @metadata[:premium_plan_id]
      
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
      # Extract subscription code
      subscription_code = @data[:subscription_code]
      return unless subscription_code
      
      # Check if we already have this subscription
      existing_subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return if existing_subscription
      
      # Find user by email from customer data
      user_email = @data.dig(:customer, :email)
      return unless user_email
      
      user = User.find_by(email: user_email)
      return unless user
      
      # Find plan by matching the plan name pattern
      plan_name = @data.dig(:plan, :name)
      return unless plan_name
      
      # Extract base plan name (remove " - monthly" suffix)
      base_plan_name = plan_name.gsub(/ - (monthly|quarterly|annually)$/, '')
      plan = PremiumPlan.find_by(name: base_plan_name)
      return unless plan
      
      # Parse dates safely
      created_at = Time.parse(@data[:createdAt]) rescue Time.current
      next_payment_date = Time.parse(@data[:next_payment_date]) rescue nil
      
      # Create the subscription
      subscription = PremiumSubscription.create!(
        user: user,
        premium_plan: plan,
        paystack_subscription_code: subscription_code,
        status: 'active',
        start_date: created_at,
        expires_at: calculate_end_date(plan, created_at),
        next_payment_date: next_payment_date,
        amount: @data[:amount].to_f / 100, # Convert from kobo/pesewa
        currency: @data.dig(:plan, :currency),
        auto_renew: true
      )
      
      # Update user premium status
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan, created_at),
        premium_subscription_id: subscription.id
      )
      
      # Send confirmation email
      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
      
      Rails.logger.info "Successfully created premium subscription: #{subscription_code} for user: #{user_email}"
    end
    
    def handle_subscription_cancellation
      subscription_code = @data[:subscription_code]
      return unless subscription_code
      
      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      return unless subscription
      
      subscription.update!(status: 'cancelled', auto_renew: false)
      subscription.user.downgrade_from_premium
      
      # Send cancellation email
      PremiumSubscriptionEmailService.send_cancellation_email(subscription.user, subscription)
      
      Rails.logger.info "Successfully cancelled premium subscription: #{subscription_code}"
    end
    
    def extract_subscription_code(data)
      data[:subscription_code] ||
      data[:subscription] ||
      (data[:authorization] && data[:authorization][:subscription_code]) ||
      (data[:plan] && data[:plan][:subscription_code])
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