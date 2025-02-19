module PaystackWebhook
  class TransferFailedHandler
    def initialize(data)
      @data = data
      @paystack_service = PaystackService.new
    end

    def call
      transfer_reference = @data[:reference] # Use reference, not transfer_code

      # Check if the event has already been processed (deduplication)
      if EventProcessed.exists?(event_id: transfer_reference)
        Rails.logger.info "Transfer failed event already processed: #{transfer_reference}"
        return # Ignore duplicate events
      end

      # Verify transfer status using the reference
      verify_result = @paystack_service.verify_transfer(transfer_reference)

      if verify_result[:status] == true
        # Begin transaction to ensure atomicity
        ActiveRecord::Base.transaction do
          # Find existing transfer or initialize a new one
          transfer = Transfer.find_or_initialize_by(reference: transfer_reference)

          transfer.assign_attributes(
            status: @data[:status],
            failure_reason: @data[:reason],
            recipient_code: @data.dig(:recipient, :recipient_code),
            amount: (@data[:amount]).to_f / 100, # Convert amount to cedis
            transfer_code: @data[:transfer_code],
            reference: @data[:reference],
            account_number: @data.dig(:recipient, :details, :account_number),
            bank_name: @data.dig(:recipient, :details, :bank_name),
            completed_at: nil # Ensure completed_at is nil for failed transfers
          )

          # Only set additional data for new transfers
          if transfer.new_record?
            transfer.user_id = verify_result.dig(:data, :recipient, :metadata, :user_id)
            transfer.campaign_id = verify_result.dig(:data, :recipient, :metadata, :campaign_id)
            transfer.email = @data.dig(:recipient, :metadata, :email)
            transfer.user_name = @data.dig(:recipient, :metadata, :user_name)
          end

          transfer.save!
          TransferNotificationEmailService.send_notification_email(transfer)

          # Link transfer to subaccount
          subaccount = Subaccount.find_by(recipient_code: transfer.recipient_code)
          if subaccount
            subaccount.update!(
              status: @data[:status],
              completed_at: Time.current,
              recipient_code: @data.dig(:recipient, :recipient_code),
              amount: @data[:amount], # Use gross amount
              transfer_code: @data[:transfer_code],
              reference: @data[:reference],
              account_number: @data.dig(:recipient, :details, :account_number),
              business_name: @data.dig(:recipient, :details, :bank_name)
            )
            Rails.logger.info "Subaccount #{subaccount.id} updated with transfer reference #{transfer_reference}."
          else
            Rails.logger.warn "Subaccount not found for transfer reference #{transfer_reference}."
          end

          Rails.logger.info "Transfer #{transfer_reference} has been #{transfer.persisted? ? 'created' : 'updated'} with failure status."
        end
      else
        Rails.logger.warn "Transfer verification failed for reference #{transfer_reference}. Data might be inconsistent."
      end
    rescue StandardError => e
      Rails.logger.error "Error processing transfer failure for reference #{transfer_reference}: #{e.message}"
      raise e
    ensure
      # Mark the event as processed (deduplication logic)
      EventProcessed.create(event_id: transfer_reference)
    end
  end
end
