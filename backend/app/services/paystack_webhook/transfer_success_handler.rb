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
      amount: @data[:amount],
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

    # Update the current_amount of the associated campaign to 0
    if transfer.campaign_id
      campaign = Campaign.find_by(id: transfer.campaign_id)
      if campaign
        campaign.update!(current_amount: 0)
        Rails.logger.info "Campaign #{campaign.id} current_amount reset to 0 after successful transfer."
      else
        Rails.logger.warn "Campaign not found for transfer #{transfer_reference}."
      end
    end

    # Link transfer to subaccount
    subaccount = Subaccount.find_by(recipient_code: transfer.recipient_code)
    if subaccount
      subaccount.update!(      
        status: @data[:status], 
        completed_at: Time.current,
        recipient_code: @data.dig(:recipient, :recipient_code),
        amount: @data[:amount],
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
