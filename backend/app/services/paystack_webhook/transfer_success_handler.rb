class PaystackWebhook::TransferSuccessHandler
  def initialize(data)
    @data = data
    @paystack_service = PaystackService.new
  end

  def call
    transfer_reference = @data[:reference]  # Use reference, not transfer_code
    recipient_code = @data.dig(:recipient, :recipient_code)
    amount = @data[:amount]
    status = @data[:status]

    # Find transfer by the reference
    transfer = Transfer.find_by(reference: transfer_reference)

    if transfer
      # Verify transfer status using the reference
      verify_result = @paystack_service.verify_transfer(transfer_reference)
      if verify_result[:status] == 'success' && verify_result[:data][:status] == 'success'
        transfer.update!(
          status: status,
          completed_at: Time.current,
          recipient_code: recipient_code,
          amount: amount
        )
        Rails.logger.info "Transfer #{transfer_reference} marked as successful."
      else
        Rails.logger.warn "Transfer verification failed for reference #{transfer_reference}. Data might be inconsistent."
      end
    else
      Rails.logger.warn "Transfer #{transfer_reference} not found."
    end
  end
end
