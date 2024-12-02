class PaystackWebhook::TransferFailedHandler
    def initialize(data)
        @data = data
    end
  
    def call
        transfer_code = @data[:transfer_code]
        reason = @data[:failures] || "Unknown reason"
  
        # Find the transfer in your database
        transfer = Transfer.find_by(transfer_code: transfer_code)
  
        if transfer
          transfer.update!(status: 'failed', failure_reason: reason)
          Rails.logger.info "Transfer #{transfer_code} marked as failed. Reason: #{reason}."
        else
          Rails.logger.warn "Failed transfer #{transfer_code} not found."
        end
    end
end
  