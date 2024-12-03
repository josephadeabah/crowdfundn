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

    transaction_status = response[:data][:status]
    if transaction_status == 'success'
      gross_amount = response[:data][:amount] / 100.0  # Gross amount from Paystack
      platform_fee = response[:data][:split][0][:amount] / 100.0 # Platform fee from the split
      net_amount = response[:data][:split][1][:amount] / 100.0  # Amount for the campaign
  
      # Update the donation with the gross amount, platform fee, and net amount
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: platform_fee,  # Store the platform fee
        amount: net_amount
      )

      campaign = donation.campaign
      campaign.update!(
        current_amount: campaign.donations.where(status: 'successful').sum(:net_amount)
      )
      # Send a confirmation email to the donor via Brevo
      DonationConfirmationEmailService.send_confirmation_email(donation)
    else
      donation.update!(status: transaction_status)
      raise "Transaction status is #{transaction_status}"
    end
  end
end
