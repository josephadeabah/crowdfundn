module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
      Rails.logger.info "PremiumSubscriptionHandler initialized"
      Rails.logger.info "Data: #{@data.inspect}"
      Rails.logger.info "Metadata: #{@metadata.inspect}"
    end
    
    def call(event_type = nil)
      Rails.logger.info "PremiumSubscriptionHandler.call invoked with event_type: #{event_type}"
      Rails.logger.info "Checking premium_access: #{@metadata[:premium_access]}, premium_plan_id: #{@metadata[:premium_plan_id]}"
      
      return unless @metadata[:premium_access] && @metadata[:premium_plan_id]
      
      handle_successful_payment
    rescue => e
      Rails.logger.error "Error in PremiumSubscriptionHandler: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end
    
    private
    
    def handle_successful_payment
      Rails.logger.info "handle_successful_payment started"
      
      user_id = @metadata[:user_id].to_i
      plan_id = @metadata[:premium_plan_id].to_i
      
      Rails.logger.info "Looking for user #{user_id} and plan #{plan_id}"
      
      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)
      
      unless user && plan
        Rails.logger.error "User or plan not found: user_id=#{user_id}, plan_id=#{plan_id}"
        return
      end
      
      Rails.logger.info "Found user: #{user.email}, plan: #{plan.name}"
      
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
        auto_renew: false
      }
      
      Rails.logger.info "Creating/updating subscription with attributes: #{subscription_attrs}"
      
      if subscription.update!(subscription_attrs)
        Rails.logger.info "Subscription created/updated successfully: #{subscription.id}"
      else
        Rails.logger.error "Failed to create/update subscription: #{subscription.errors.full_messages}"
        return
      end
      
      # Update user premium status
      user.update_columns(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan),
        premium_subscription_id: subscription.id,
        updated_at: Time.current
      )
      
      Rails.logger.info "User premium status updated: #{user.email}"
      
      # Send confirmation emails
      PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
      PremiumSubscriptionEmailService.send_payment_success_email(user, subscription, @data)
      
      Rails.logger.info "Confirmation emails sent successfully"
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