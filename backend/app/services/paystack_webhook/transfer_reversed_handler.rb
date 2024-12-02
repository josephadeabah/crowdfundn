class PaystackWebhook::TransferReversedHandler
    def initialize(data)
      @data = data
    end
  
    def call
      transfer_code = @data[:transfer_code]
  
      transfer = Transfer.find_by(transfer_code: transfer_code)
  
      if transfer
        transfer.update!(status: 'reversed', reversed_at: Time.current)
        Rails.logger.info "Transfer #{transfer_code} marked as reversed."
      else
        Rails.logger.warn "Reversed transfer #{transfer_code} not found."
      end
    end
end
  