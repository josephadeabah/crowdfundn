module PaystackWebhook
  class TransferFailedHandler
    def initialize(data)
      @data = data
      @paystack_service = PaystackService.new
    end

    def call
      transfer_reference = @data[:reference]  # Use reference, not transfer_code

      # Verify transfer status using the reference
      verify_result = @paystack_service.verify_transfer(transfer_reference)

      if verify_result[:status] == true
        # Find existing transfer or initialize a new one
        transfer = Transfer.find_or_initialize_by(reference: transfer_reference)

        transfer.assign_attributes(
          status: @data[:status],
          failure_reason: @data[:reason],
          recipient_code: @data.dig(:recipient, :recipient_code),
          amount: @data[:amount],
          transfer_code: verify_result[:data][:transfer_code],
          account_number: verify_result.dig(:data, :recipient, :details, :account_number),
          bank_name: verify_result.dig(:data, :recipient, :details, :bank_name),
          completed_at: nil # Ensure completed_at is nil for failed transfers
        )

        if transfer.new_record?
          transfer.user_id = verify_result.dig(:data, :recipient, :metadata, :user_id)  # Example: Set user_id if available
          transfer.campaign_id = verify_result.dig(:data, :recipient, :metadata, :campaign_id)                 # Set campaign_id if applicable
        end

        transfer.save!

        Rails.logger.info "Transfer #{transfer_reference} has been #{transfer.persisted? ? 'created' : 'updated'} with failure status."
      else
        Rails.logger.warn "Transfer verification failed for reference #{transfer_reference}. Data might be inconsistent."
      end
    end
  end
end
