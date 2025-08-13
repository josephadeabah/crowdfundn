# app/services/paystack_webhook/charge_success_handler.rb
class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    Rails.logger.info { "Processing charge success: #{transaction_reference}" }

    # Check if the event has already been processed (deduplication)
    return if EventProcessed.exists?(event_id: transaction_reference)

    ActiveRecord::Base.transaction do
      if equity_investment?(@data)
        handle_equity_investment
      else
        handle_donation
      end

      EventProcessed.create!(event_id: transaction_reference)
    end
  rescue StandardError => e
    Rails.logger.error "Webhook processing failed: #{e.message}"
    raise e
  end

  private

  def equity_investment?(data)
    metadata = data[:metadata] || {}
    metadata[:type] == 'equity_investment' || data.dig(:metadata, :type) == 'equity_investment'
  end

  def handle_equity_investment
    handler = PaystackWebhook::Handlers::EquityInvestmentHandler.new(@data)
    handler.call
  rescue ActiveRecord::RecordInvalid => e
    # If the equity investment fails, try processing as a regular donation
    # This handles cases where the metadata might have been misclassified
    Rails.logger.warn "Equity investment processing failed, trying as donation: #{e.message}"
    handle_donation
  end

  def handle_donation
    handler = PaystackWebhook::Handlers::DonationHandler.new(@data)
    handler.call
  end
end