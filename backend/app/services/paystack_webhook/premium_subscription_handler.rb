module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
      Rails.logger.info "PremiumSubscriptionHandler initialized"
      Rails.logger.info "Data: #{@data.inspect}"
      Rails.logger.info "Metadata: #{@metadata.inspect}"
    end
    
    def call
      Rails.logger.info "PremiumSubscriptionHandler.call invoked"
      Rails.logger.info "Checking premium_access: #{@metadata[:premium_access]}, premium_plan_id: #{@metadata[:premium_plan_id]}"
      
      return unless @metadata[:premium_access] && @metadata[:premium_plan_id]
      
      Rails.logger.info "Processing event: #{@data[:event]}"
      
      case @data[:event]
      when 'charge.success'
        handle_successful_payment
      when 'subscription.create'
        handle_subscription_creation
      when 'subscription.disable'
        handle_subscription_cancellation
      when 'subscription.not_renew'
        handle_non_renewal
      else
        Rails.logger.warn "Unhandled event type in PremiumSubscriptionHandler: #{@data[:event]}"
      end
    rescue => e
      Rails.logger.error "Error in PremiumSubscriptionHandler: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end
    
    private
    
    def handle_successful_payment
      Rails.logger.info "handle_successful_payment started"
      
      user = User.find(@metadata[:user_id].to_i)
      plan = PremiumPlan.find(@metadata[:premium_plan_id].to_i)
      is_recurring = @metadata[:is_recurring] == 'true'
      
      subscription = PremiumSubscription.find_or_initialize_by(
        transaction_reference: @data[:reference]
      )
      
      subscription_attrs = {
        user: user,
        premium_plan: plan,
        status: 'active',
        start_date: Time.current,
        expires_at: calculate_end_date(plan),
        amount: @data[:amount].to_f / 100,
        currency: @data[:currency],
        auto_renew: is_recurring
      }
      
      if is_recurring && @data[:subscription_code].present?
        subscription_attrs[:paystack_subscription_code] = @data[:subscription_code]
      end
      
      subscription.update!(subscription_attrs)
      
      # Update user premium status
      user.update_columns(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan),
        premium_subscription_id: @data[:subscription_code],
        updated_at: Time.current
      )
      
      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
      PremiumSubscriptionEmailService.send_payment_success_email(user, subscription, @data)
    end
    
    def handle_subscription_creation
      user = User.find(@metadata[:user_id])
      plan = PremiumPlan.find(@metadata[:premium_plan_id])
      
      subscription = PremiumSubscription.find_or_initialize_by(
        paystack_subscription_code: @data[:subscription_code]
      )
      
      subscription.update!(
        user: user,
        premium_plan: plan,
        status: 'active',
        start_date: Time.at(@data[:created_at]),
        expires_at: calculate_end_date(plan, Time.at(@data[:created_at])),
        next_payment_date: Time.at(@data[:next_payment_date]),
        amount: plan.price,
        currency: plan.currency,
        auto_renew: true
      )
      
      user.upgrade_to_premium(plan, @data[:subscription_code])
      
      # Send confirmation email
      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
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