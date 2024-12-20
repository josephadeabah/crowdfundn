class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    subscription_code = @data[:subscription_code]
    Rails.logger.debug "Processing charge success: #{transaction_reference} or subscription #{subscription_code}"

    # Check if the event has already been processed (optional deduplication)
    if EventProcessed.exists?(event_id: transaction_reference)
      Rails.logger.info "Charge success already processed: #{transaction_reference}"
      return # Ignore duplicate events
    end

    ActiveRecord::Base.transaction do
      handle_donation_success if @data.present?
    end
  rescue StandardError => e
    Rails.logger.error "Error processing charge success: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: transaction_reference)
  end

  private

  def handle_donation_success
    transaction_reference = @data[:reference]
    # Log for debug purposes
    Rails.logger.info "Verifying donation with reference #{transaction_reference}"

    donation = Donation.find_by(transaction_reference: transaction_reference)
    
    # If donation is not found, log and raise error
    unless donation
      Rails.logger.error "Donation not found for reference: #{transaction_reference}"
      raise "Donation not found"
    end
  
    # Verify transaction with Paystack
    response = PaystackService.new.verify_transaction(transaction_reference)
    unless response[:status] == true
      Rails.logger.error "Transaction verification failed for #{transaction_reference}"
      raise "Transaction verification failed"
    end
  
    # Extract transaction status
    transaction_status = response.dig(:data, :status)
    if transaction_status == 'success'
      gross_amount = response.dig(:data, :amount).to_f / 100.0 # Gross amount from Paystack
      subaccount_fee = response.dig(:data, :fees_split, :subaccount).to_f / 100.0
      integration_fee = response.dig(:data, :fees_split, :integration).to_f / 100.0

      # Log important details for debugging
      Rails.logger.debug "Donation update: gross_amount=#{gross_amount}, subaccount_fee=#{subaccount_fee}, integration_fee=#{integration_fee}"

      # Update the donation record
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: subaccount_fee,
        platform_fee: integration_fee, # Store platform fee
        amount: subaccount_fee
      )

      # Update the related campaign
      campaign = donation.campaign
      campaign.update!(
        total_successful_donations: campaign.current_amount + subaccount_fee,
        current_amount: campaign.current_amount + subaccount_fee
      )

      # Update the transferred amount for the campaign
      campaign.update_transferred_amount(subaccount_fee)

      # Send confirmation email to the donor
      DonationConfirmationEmailService.send_confirmation_email(donation)
    else
      # If the transaction status isn't 'success', update the donation and raise an error
      donation.update!(status: transaction_status)
      Rails.logger.error "Transaction failed with status #{transaction_status}"
      raise "Transaction status is #{transaction_status}"
    end
  end
end
