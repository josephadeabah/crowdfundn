module PaystackWebhook
  class TransferSuccessHandler
    def initialize(data)
      @data = data
    end

    def call
      # Example data from webhook payload
      transfer_code = @data[:transfer_code]
      recipient_code = @data[:recipient][:recipient_code]
      amount = @data[:amount]
      status = @data[:status]

      # Find the transfer in your database
      transfer = Transfer.find_by(transfer_code: transfer_code)

      if transfer
        transfer.update!(status: status, completed_at: Time.current)
        Rails.logger.info "Transfer #{transfer_code} marked as successful."
      else
        Rails.logger.warn "Transfer #{transfer_code} not found."
      end
    end
  end
end
