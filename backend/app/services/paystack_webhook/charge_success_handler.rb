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
    end
  rescue StandardError => e
    Rails.logger.error "Error processing charge success: #{e.message}"
    raise e
  end

  private

  def handle_donation_success
    transaction_reference = @data[:reference]
    donation = Donation.find_by(transaction_reference: transaction_reference)
    raise "Donation not found" unless donation
  
    response = PaystackService.new.verify_transaction(transaction_reference)
    raise "Transaction verification failed" unless response[:status] == true
  
    transaction_status = response.dig(:data, :status)
    if transaction_status == 'success'
      gross_amount = response.dig(:data, :amount).to_f / 100.0 # Gross amount from Paystack
      # Extract subaccount fee from the fee_split data
      subaccount_fee = response.dig(:data, :fees_split, :subaccount).to_f / 100.0
      integration_fee = response.dig(:data, :fees_split, :integration).to_f / 100.0
      # paystack_fee = response.dig(:data, :fees_split, :paystack).to_f / 100.0

  
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: subaccount_fee,
        platform_fee: integration_fee, # Store platform fee
        amount: subaccount_fee
      )
  
      donation.update!(status: 'successful', gross_amount: gross_amount, net_amount: subaccount_fee, amount: subaccount_fee)

      campaign = donation.campaign
      # Update campaign amounts
      campaign.update!(
        total_successful_donations: campaign.current_amount + subaccount_fee,
        current_amount: campaign.current_amount + subaccount_fee
      )

      # Call the method from the campaign model to update transferred_amount with the new donation's net_amount
      campaign.update_transferred_amount(subaccount_fee)

      # Send confirmation email
      DonationConfirmationEmailService.send_confirmation_email(donation)
    else
      donation.update!(status: transaction_status)
      raise "Transaction status is #{transaction_status}"
    end
  end
end
