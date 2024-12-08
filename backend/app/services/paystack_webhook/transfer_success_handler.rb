class PaystackWebhook::TransferSuccessHandler
  def initialize(data)
    @data = data
    @paystack_service = PaystackService.new
  end

  def call
    transfer_reference = @data[:reference]

    # Find existing transfer or initialize a new one
    transfer = Transfer.find_or_initialize_by(reference: transfer_reference)

    # Assign attributes to the transfer
    transfer.assign_attributes(
      status: @data[:status], 
      completed_at: Time.current,
      recipient_code: @data.dig(:recipient, :recipient_code),
      currency: @data[:currency],
      amount: (@data[:amount]).to_f / 100, # Convert amount to naira
      reason: @data[:reason],
      transfer_code: @data[:transfer_code],
      reference: @data[:reference],
      account_number: @data.dig(:recipient, :details, :account_number),
      bank_name: @data.dig(:recipient, :details, :bank_name)
    )

    # Optionally assign user_id and campaign_id if needed from the metadata
    transfer.user_id = @data.dig(:recipient, :metadata, :user_id)
    transfer.campaign_id = @data.dig(:recipient, :metadata, :campaign_id)

    # Save the transfer details to the database
    transfer.save!

    Rails.logger.info "Transfer #{transfer_reference} has been #{transfer.persisted? ? 'created' : 'updated'} successfully."

    # Find the related donation by campaign_id
    donation = Donation.find_by(campaign_id: @data.dig(:recipient, :metadata, :campaign_id))

    # Calculate the donation amounts
    gross_amount = 0 # Gross amount from Paystack (in GHS)
    platform_fee = gross_amount * 0 # Platform fee (20% of the gross amount)
    net_amount = gross_amount - platform_fee # Net amount (80% of the gross amount)

    # Update the donation with the calculated values
    donation.update!(
      status: 'successful',
      gross_amount: gross_amount,
      net_amount: net_amount,
      platform_fee: platform_fee, # Store the platform fee
      amount: net_amount
    )

    # Get the associated campaign
    campaign = donation.campaign

    # Reset the current_amount to zero before adding the new successful donation amount
    campaign.update!(current_amount: 0)

    # Update the campaign with the total successful donations
    campaign.update!(
      current_amount: campaign.donations.where(status: 'successful').sum(:net_amount)
    )

    # Link transfer to subaccount
    subaccount = Subaccount.find_by(recipient_code: transfer.recipient_code)
    if subaccount
      subaccount.update!(      
        status: @data[:status], 
        completed_at: Time.current,
        recipient_code: @data.dig(:recipient, :recipient_code),
        amount: 0, # Use gross amount, assuming it's the total value transferred
        transfer_code: @data[:transfer_code],
        reference: @data[:reference],
        account_number: @data.dig(:recipient, :details, :account_number),
        business_name: @data.dig(:recipient, :details, :bank_name)
      )
      Rails.logger.info "Subaccount #{subaccount.id} updated with transfer reference #{transfer_reference}."
    else
      Rails.logger.warn "Subaccount not found for transfer #{transfer_reference}."
    end
  end
end
