class PaystackWebhook::TransferSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transfer_code = @data[:transfer_code]
    recipient_code = @data.dig(:recipient, :recipient_code)
    amount = @data[:amount]
    status = @data[:status]

    transfer = Transfer.find_by(transfer_code: transfer_code)

    if transfer
      # Update only the fields that can change (status, completed_at, recipient_code, amount)
      transfer.update!(
        status: status,
        completed_at: Time.current,
        recipient_code: recipient_code,
        amount: amount
      )
      Rails.logger.info "Transfer #{transfer_code} marked as successful."
    else
      Rails.logger.warn "Transfer #{transfer_code} not found."
    end
  end
end
