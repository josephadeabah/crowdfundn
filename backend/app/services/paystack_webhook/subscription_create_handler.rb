class PaystackWebhook::SubscriptionCreateHandler
    def initialize(data)
      @data = data
    end

    def call
        transaction_reference = @data[:reference]
        subscription_code = @data[:subscription_code]
        Rails.logger.debug "Processing charge success: #{transaction_reference} or subscription #{subscription_code}"
    
        ActiveRecord::Base.transaction do
          handle_subscription_success if @data.present?
        end
    rescue StandardError => e
        Rails.logger.error "Error processing charge success: #{e.message}"
        raise e
    end

    def handle_subscription_success
        transaction_reference = @data[:reference]
        subscription_code = @data[:subscription_code]
        email = @data.dig(:customer, :email)
        plan = @data[:plan]
        authorization = @data[:authorization]
        donation = Donation.find_by(subscription_code: subscription_code)
        raise "Donation not found" unless donation
    
        response = PaystackService.new.verify_transaction(transaction_reference)
        raise "Transaction verification failed" unless response[:status] == true
    
        transaction_status = response[:data][:status]
        if transaction_status == 'success'
            subscription = Subscription.find_or_initialize_by(subscription_code: subscription_code)
            subscription.update!(
              user_id: donation.campaign.fundraiser.id,
              campaign_id: donation.campaign.id,
              subscription_code: subscription_code,
              email_token: @data[:email_token],
              email: email,
              interval: plan[:interval],
              amount: @data[:amount],
              next_payment_date: @data[:next_payment_date],
              status: @data[:status],
              card_type: authorization[:card_type],
              last4: authorization[:last4],
              plan_code: plan[:plan_code],
              created_at: @data[:createdAt]
            )
          
            SubscriptionConfirmationEmailService.send_confirmation_email(subscription)
        else
          subscription.update!(status: transaction_status)
          raise "Transaction status is #{transaction_status}"
        end
    end
end
  