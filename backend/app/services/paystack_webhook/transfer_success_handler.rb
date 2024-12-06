# app/services/paystack_webhook/transfer_success_handler.rb
module PaystackWebhook
  class TransferSuccessHandler
    def initialize(data)
      @transfer_data = data
    end

    def call
      transfer = Transfer.find_by(reference: @transfer_data[:reference])
      return unless transfer

      transfer.update!(
        status: 'successful',
        completed_at: Time.current
      )
      Rails.logger.info "Transfer successful: #{transfer.id}"
    end
  end
end
