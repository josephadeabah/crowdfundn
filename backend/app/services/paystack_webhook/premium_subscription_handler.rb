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
      Rails.logger.info "=== PAYSTACK WEBHOOK DATA ==="
      Rails.logger.info "Event type: #{event_type}"
      Rails.logger.info "Full data: #{@data.inspect}"
      Rails.logger.info "Metadata: #{@metadata.inspect}"
      Rails.logger.info "============================"
      
      # Handle both events - subscription.create may not have metadata
      case event_type
      when :charge_success
        Rails.logger.info "Processing premium subscription payment"
        handle_charge_success
      when :subscription_create
        Rails.logger.info "Processing subscription creation"
        handle_subscription_create
      when :subscription_disable
        Rails.logger.info "Processing premium subscription disable"
        handle_subscription_disable
      else
        Rails.logger.info "Processing premium subscription (default)"
        handle_charge_success
      end
    rescue => e
      Rails.logger.error "Error in PremiumSubscriptionHandler: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      raise e
    end
    
    private
    
    def handle_subscription_create
      # This event contains the subscription code and email token
      # Store it directly in the PremiumSubscription table
      subscription_code = @data[:subscription_code]
      email_token = @data[:email_token]
      
      if subscription_code.blank? || email_token.blank?
        Rails.logger.error "Missing subscription code or email token in subscription.create event"
        return
      end
      
      # Try to find the user from customer email (since metadata is empty)
      customer_email = @data.dig(:customer, :email)
      if customer_email.blank?
        Rails.logger.error "No customer email found in subscription.create event"
        return
      end
      
      user = User.find_by(email: customer_email)
      unless user
        Rails.logger.error "User not found for email: #{customer_email}"
        return
      end
      
      # Find or create a subscription with this code
      subscription = PremiumSubscription.find_or_initialize_by(
        paystack_subscription_code: subscription_code
      )
      
      # Update with the subscription data
      subscription_attrs = {
        user: user,
        paystack_email_token: email_token,
        status: 'active',
        auto_renew: true,
        start_date: Time.current,
        expires_at: 1.month.from_now # Default, will be updated by charge.success
      }
      
      # Try to get plan from subscription data
      plan_code = @data.dig(:plan, :plan_code)
      if plan_code.present?
        plan = PremiumPlan.find_by(paystack_plan_code: plan_code)
        subscription_attrs[:premium_plan] = plan if plan
      end
      
      if subscription.update(subscription_attrs)
        Rails.logger.info "Subscription created/updated from subscription.create: #{subscription_code}"
      else
        Rails.logger.error "Failed to create/update subscription: #{subscription.errors.full_messages}"
      end
    end
    
    def handle_charge_success
      Rails.logger.info "handle_charge_success started"
      
      # Check if we have the required metadata
      unless @metadata[:premium_access] && @metadata[:premium_plan_id] && @metadata[:user_id]
        Rails.logger.error "Missing required metadata for charge.success: premium_access=#{@metadata[:premium_access]}, premium_plan_id=#{@metadata[:premium_plan_id]}, user_id=#{@metadata[:user_id]}"
        return
      end
      
      user_id = @metadata[:user_id].to_i
      plan_id = @metadata[:premium_plan_id].to_i
      is_recurring = ActiveModel::Type::Boolean.new.cast(@metadata[:is_recurring])
      
      Rails.logger.info "Looking for user #{user_id} and plan #{plan_id}, recurring: #{is_recurring}"

      user = User.find_by(id: user_id)
      plan = PremiumPlan.find_by(id: plan_id)
      
      unless user && plan
        Rails.logger.error "User or plan not found: user_id=#{user_id}, plan_id=#{plan_id}"
        return
      end
      
      Rails.logger.info "Found user: #{user.email}, plan: #{plan.name}"
      
      # For recurring subscriptions, try to find by subscription code first
      subscription = nil
      if is_recurring
        # Look for existing subscription by customer email (from charge.success data)
        customer_email = @data.dig(:customer, :email)
        if customer_email.present?
          subscription = PremiumSubscription.joins(:user)
                                           .where(users: { email: customer_email })
                                           .where(auto_renew: true)
                                           .order(created_at: :desc)
                                           .first
        end
        
        # If not found, try to find by reference
        subscription ||= PremiumSubscription.find_or_initialize_by(
          transaction_reference: @data[:reference]
        )
      else
        # For one-time payments, use transaction reference
        subscription = PremiumSubscription.find_or_initialize_by(
          transaction_reference: @data[:reference]
        )
      end
      
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
      
      # For recurring subscriptions, try to find subscription code from existing record
      if is_recurring && subscription.persisted?
        if subscription.paystack_subscription_code.present?
          subscription_attrs[:paystack_subscription_code] = subscription.paystack_subscription_code
          Rails.logger.info "Using existing subscription code: #{subscription.paystack_subscription_code}"
        end
        
        if subscription.paystack_email_token.present?
          subscription_attrs[:paystack_email_token] = subscription.paystack_email_token
          Rails.logger.info "Using existing email token: #{subscription.paystack_email_token}"
        end
      end
      
      Rails.logger.info "Creating/updating subscription with attributes: #{subscription_attrs.except(:user, :premium_plan)}"
      
      if subscription.update(subscription_attrs)
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
    
    def handle_subscription_disable
      # Handle subscription cancellation/disable
      subscription_code = @data[:subscription_code]
      
      if subscription_code.present?
        subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
        
        if subscription
          subscription.update(
            status: 'cancelled',
            auto_renew: false,
            expires_at: [subscription.expires_at, Time.current].compact.max
          )
          
          # Downgrade user if this was their active subscription
          user = subscription.user
          if user.premium_subscription_id == subscription.id
            user.update_columns(
              premium_access: false,
              premium_plan_id: nil,
              premium_expires_at: nil,
              premium_subscription_id: nil,
              updated_at: Time.current
            )
          end
          
          Rails.logger.info "Subscription #{subscription_code} disabled successfully"
        else
          Rails.logger.warn "Subscription not found for code: #{subscription_code}"
        end
      else
        Rails.logger.warn "No subscription code provided for disable event"
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