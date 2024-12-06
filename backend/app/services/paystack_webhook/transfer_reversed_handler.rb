# app/services/paystack_webhook/transfer_reversed_handler.rb
module PaystackWebhook
  class TransferReversedHandler
    def initialize(data)
      @transfer_data = data
    end

    def call
      transfer = Transfer.find_by(reference: @transfer_data[:reference])
      return unless transfer

      transfer.update!(
        status: 'reversed',
        reversed_at: Time.current
      )
      Rails.logger.warn "Transfer reversed: #{transfer.id}"
    end
  end
end
