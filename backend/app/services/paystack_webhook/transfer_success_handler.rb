class PaystackWebhook::TransferSuccessHandler
  def initialize(data)
    @data = data
    @paystack_service = PaystackService.new
  end

  def call
    transfer_reference = @data[:reference]

    # Verify transfer status using the reference
    verify_result = @paystack_service.verify_transfer(transfer_reference)

    if verify_result[:status] == true
      # Find existing transfer or initialize a new one
      transfer = Transfer.find_or_initialize_by(reference: transfer_reference)

      transfer.assign_attributes(
        status: verify_result[:data][:status],
        completed_at: Time.current,
        recipient_code: verify_result[:data][:recipient_code],
        amount: verify_result[:data][:amount],
        transfer_code: verify_result[:data][:transfer_code],
        reference: verify_result[:data][:reference],
        account_number: verify_result.dig(:data, :recipient, :details, :account_number),
        bank_name: verify_result.dig(:data, :recipient, :details, :bank_name)
      )

      if transfer.new_record?
        transfer.user_id = verify_result.dig(:data, :recipient, :metadata, :user_id)  # Example of setting user_id
        transfer.campaign_id = verify_result.dig(:data, :recipient, :metadata, :campaign_id)    # Set campaign_id if applicable
      end

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
    else
      Rails.logger.warn "Transfer verification failed for reference #{transfer_reference}. Data might be inconsistent."
    end
  end
end
