class PaystackWebhook::TransferSuccessHandler
  def initialize(data)
    @data = data
    @paystack_service = PaystackService.new
  end

  def call
    transfer_reference = @data[:reference]

    transfer = Transfer.find_or_initialize_by(reference: transfer_reference)
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
    transfer.user_id = @data.dig(:recipient, :metadata, :user_id)
    transfer.campaign_id = @data.dig(:recipient, :metadata, :campaign_id)
    transfer.save!
  
    # Find the associated campaign
    campaign = Campaign.find(transfer.campaign_id)

    transfer_amount = transfer.amount

    # Ensure transfer does not exceed current amount
    if campaign.current_amount < transfer_amount
      raise "Insufficient funds for transfer"
    end
    
    # Update campaign amounts
    campaign.update!(
      transferred_amount: campaign.transferred_amount + transfer_amount,
      current_amount: campaign.current_amount - transfer_amount
    )

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
