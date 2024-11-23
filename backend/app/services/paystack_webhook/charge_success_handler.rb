class PaystackWebhook::ChargeSuccessHandler
    def initialize(data)
      @data = data
    end
  
    def call
      transaction_reference = @data[:reference]
      subscription_code = @data[:subscription_code]
      Rails.logger.debug "Processing charge success: #{transaction_reference} or subscription #{subscription_code}"
  
      ActiveRecord::Base.transaction do
        handle_donation_success if @data.present?
        handle_subscription_success if subscription_code.present?
      end
    rescue StandardError => e
      Rails.logger.error "Error processing charge success: #{e.message}"
      raise e
    end
  
    private
  
    def handle_donation_success
      transaction_reference = @data[:reference]
      subscription_code = @data[:subscription_code]
      email = @data.dig(:customer, :email)
      plan = @data[:plan]
      authorization = @data[:authorization]
      donation = Donation.find_by(transaction_reference: transaction_reference)
      raise "Donation not found" unless donation
  
      response = PaystackService.new.verify_transaction(transaction_reference)
      raise "Transaction verification failed" unless response[:status] == true
  
      transaction_status = response[:data][:status]
      if transaction_status == 'success'
        gross_amount = response[:data][:amount] / 100.0
        net_amount = gross_amount * 0.985
        donation.update!(status: 'successful', gross_amount: gross_amount, net_amount: net_amount, amount: net_amount)
  
        Balance.create!(
          amount: gross_amount - net_amount,
          description: "Platform fee for donation #{donation.id}",
          status: 'pending'
        )

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
  
        campaign = donation.campaign
        campaign.update!(
          current_amount: campaign.donations.where(status: 'successful').sum(:net_amount)
        )
        # Send a donation confirmation email to the donor via Brevo
        DonationConfirmationEmailService.send_confirmation_email(donation)
        # Send a subscription confirmation email to the donor via Brevo
        SubscriptionConfirmationEmailService.send_confirmation_email(subscription)
      else
        donation.update!(status: transaction_status)
        subscription.update!(status: transaction_status)
        raise "Transaction status is #{transaction_status}"
      end
    end
end
  