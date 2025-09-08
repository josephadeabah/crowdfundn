# app/services/paystack_webhook/premium_subscription_handler.rb
module PaystackWebhook
  class PremiumSubscriptionHandler
    def initialize(data)
      @data = data
      @metadata = data[:metadata] || {}
      Rails.logger.info "PremiumSubscriptionHandler initialized with data: #{@data.inspect}"
    end
    
    def call
      Rails.logger.info "PremiumSubscriptionHandler called with data keys: #{@data.keys}"
      
      # Check if this looks like a subscription creation event
      if @data[:subscription_code].present? && @data[:createdAt].present?
        Rails.logger.info "Handling subscription creation event"
        handle_subscription_creation
      elsif @data[:subscription_code].present? && @data[:status] == 'disabled'
        Rails.logger.info "Handling subscription cancellation event"
        handle_subscription_cancellation
      elsif @data[:reference].present? && @metadata[:premium_access]
        Rails.logger.info "Handling charge success event"
        handle_charge_success
      else
        Rails.logger.warn "Unknown event type or missing required data"
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
      if existing_subscription
        Rails.logger.info "Subscription already exists for reference: #{@data[:reference]}"
        return 
      end
      
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
      
      # For recurring payments, try to extract subscription code from the webhook data
      if is_recurring
        Rails.logger.info "Recurring subscription detected, extracting subscription code from webhook data"
        
        # Try to extract subscription code from the webhook data
        subscription_code = extract_subscription_code(@data)
        
        if subscription_code.present?
          subscription_attrs[:paystack_subscription_code] = subscription_code
          subscription_attrs[:auto_renew] = true
          Rails.logger.info "Found subscription code in webhook data: #{subscription_code}"
        else
          Rails.logger.info "No subscription code found in webhook data, will be updated by subscription.create webhook if it arrives"
        end
      end
      
      begin
        subscription = PremiumSubscription.create!(subscription_attrs)
        Rails.logger.info "Successfully created premium subscription: #{subscription.id}"
        
        # Update user premium status
        user.update!(
          premium_access: true,
          premium_plan_id: plan.id,
          premium_expires_at: calculate_end_date(plan),
          premium_subscription_id: subscription.id
        )
        Rails.logger.info "Successfully updated user premium status"
        
        # Send confirmation email
        PremiumSubscriptionEmailService.send_confirmation_email(user, subscription)
        Rails.logger.info "Confirmation email sent"
        
      rescue ActiveRecord::RecordInvalid => e
        Rails.logger.error "Failed to create subscription: #{e.message}"
        Rails.logger.error "Validation errors: #{e.record.errors.full_messages}"
      rescue StandardError => e
        Rails.logger.error "Unexpected error creating subscription: #{e.message}"
      end
    end
    
    def handle_subscription_creation
      # Extract subscription code
      subscription_code = @data[:subscription_code]
      Rails.logger.info "Processing subscription creation for code: #{subscription_code}"
      
      return unless subscription_code
      
      # Find user by email from customer data
      user_email = @data.dig(:customer, :email)
      unless user_email
        Rails.logger.error "No user email found in customer data"
        return
      end
      
      user = User.find_by(email: user_email)
      unless user
        Rails.logger.error "User not found with email: #{user_email}"
        return
      end
      
      # Find plan by matching the plan name pattern
      plan_name = @data.dig(:plan, :name)
      unless plan_name
        Rails.logger.error "No plan name found in plan data"
        return
      end
      
      # Extract base plan name (remove " - monthly" suffix)
      base_plan_name = plan_name.gsub(/ - (monthly|quarterly|annually)$/, '')
      plan = PremiumPlan.find_by(name: base_plan_name)
      unless plan
        Rails.logger.error "Plan not found with name: #{base_plan_name}"
        return
      end
      
      # Parse dates safely
      created_at = Time.parse(@data[:createdAt]) rescue Time.current
      next_payment_date = Time.parse(@data[:next_payment_date]) rescue nil
      
      # Check if we already have a subscription for this user
      existing_subscription = PremiumSubscription.find_by(user: user, paystack_subscription_code: subscription_code)
      
      if existing_subscription
        # Update existing subscription
        Rails.logger.info "Updating existing subscription #{existing_subscription.id}"
        
        existing_subscription.update!(
          status: 'active',
          auto_renew: true,
          next_payment_date: next_payment_date,
          expires_at: calculate_end_date(plan, created_at)
        )
        
        subscription = existing_subscription
      else
        # Check if there's a subscription without paystack_subscription_code
        existing_subscription_without_code = PremiumSubscription.find_by(user: user, paystack_subscription_code: nil)
        
        if existing_subscription_without_code
          # Update existing subscription with the subscription code
          Rails.logger.info "Updating existing subscription #{existing_subscription_without_code.id} with paystack_subscription_code: #{subscription_code}"
          
          existing_subscription_without_code.update!(
            paystack_subscription_code: subscription_code,
            auto_renew: true,
            next_payment_date: next_payment_date,
            expires_at: calculate_end_date(plan, created_at)
          )
          
          subscription = existing_subscription_without_code
        else
          # Create new subscription
          subscription_attrs = {
            user: user,
            premium_plan: plan,
            paystack_subscription_code: subscription_code,
            status: 'active',
            start_date: created_at,
            expires_at: calculate_end_date(plan, created_at),
            next_payment_date: next_payment_date,
            amount: @data[:amount].to_f / 100,
            currency: @data.dig(:plan, :currency),
            auto_renew: true,
            transaction_reference: "sub_#{subscription_code}"
          }
          
          subscription = PremiumSubscription.create!(subscription_attrs)
          Rails.logger.info "Created new subscription: #{subscription.id}"
        end
      end
      
      # Update user premium status
      user.update!(
        premium_access: true,
        premium_plan_id: plan.id,
        premium_expires_at: calculate_end_date(plan, created_at),
        premium_subscription_id: subscription.id
      )
      
      Rails.logger.info "Successfully processed subscription creation"
    end
    
    def handle_subscription_cancellation
      subscription_code = @data[:subscription_code]
      Rails.logger.info "Processing subscription cancellation for code: #{subscription_code}"
      
      return unless subscription_code
      
      subscription = PremiumSubscription.find_by(paystack_subscription_code: subscription_code)
      unless subscription
        Rails.logger.error "Subscription not found with code: #{subscription_code}"
        return
      end
      
      subscription.update!(status: 'cancelled', auto_renew: false)
      subscription.user.downgrade_from_premium
      
      # Send cancellation email
      PremiumSubscriptionEmailService.send_cancellation_email(subscription.user, subscription)
      
      Rails.logger.info "Successfully cancelled premium subscription: #{subscription_code}"
    end
    
    def extract_subscription_code(data)
      code = data[:subscription_code] ||
             data[:subscription] ||
             (data[:authorization] && data[:authorization][:subscription_code]) ||
             (data[:plan] && data[:plan][:subscription_code])
      
      Rails.logger.info "Extracted subscription code: #{code}"
      code
    end
    
    def calculate_end_date(plan, start_date = Time.current)
      end_date = case plan.interval
                 when 'monthly' then start_date + 1.month
                 when 'quarterly' then start_date + 3.months
                 when 'annually' then start_date + 1.year
                 else start_date + 1.month
                 end
      
      Rails.logger.info "Calculated end date: #{end_date} for plan interval: #{plan.interval}"
      end_date
    end
  end
end