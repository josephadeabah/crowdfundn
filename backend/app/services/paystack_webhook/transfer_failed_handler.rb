# app/services/paystack_webhook/transfer_failed_handler.rb
module PaystackWebhook
  class TransferFailedHandler
    def initialize(data)
      @transfer_data = data
    end

    def call
      transfer = Transfer.find_by(reference: @transfer_data[:reference])
      return unless transfer

      transfer.update!(
        status: 'failed',
        failed_at: Time.current,
        failure_reason: @transfer_data[:reason]
      )
      Rails.logger.error "Transfer failed: #{transfer.id} (Reason: #{@transfer_data[:reason]})"
    end
  end
end
