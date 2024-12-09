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
      amount: (@data[:amount]).to_f / 100, # Convert amount to cedis
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

    # Get the associated campaign
    campaign = donation.campaign

    # Calculate the new transferred amount
    new_transferred_amount = campaign.transferred_amount + (@data[:amount]).to_f / 100

    # Calculate the new current_amount (this will be recalculated after successful donations)
    # You need to calculate the net_amount for each successful donation before summing it
    new_current_amount = campaign.donations.where(status: 'successful').sum do |donation|
      # Calculate the net amount for each donation if it's not already calculated
      gross_amount = donation.gross_amount # or fetch this from the donation object
      platform_fee = gross_amount * 0.20 # Assuming a 20% platform fee
      net_amount = gross_amount - platform_fee
      net_amount
    end - new_transferred_amount

    # Use a transaction to update both `transferred_amount` and `current_amount`
    ActiveRecord::Base.transaction do
      # Update the transferred_amount and current_amount atomically
      campaign.update!(transferred_amount: new_transferred_amount)
      campaign.update!(current_amount: [new_current_amount, 0].max) # Ensures no negative current_amount
    end

    Rails.logger.info "Campaign current_amount updated to: #{campaign.current_amount}"

    # Link transfer to subaccount
    subaccount = Subaccount.find_by(recipient_code: transfer.recipient_code)
    if subaccount
      subaccount.update!(      
        status: @data[:status], 
        completed_at: Time.current,
        recipient_code: @data.dig(:recipient, :recipient_code),
        amount: @data[:amount], # Use gross amount, assuming it's the total value transferred
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
