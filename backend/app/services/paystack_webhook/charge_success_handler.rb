class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    return if EventProcessed.exists?(event_id: transaction_reference)

    ActiveRecord::Base.transaction do
      handler = determine_handler
      handler.call
      EventProcessed.create!(event_id: transaction_reference)
    end
  rescue StandardError => e
    Rails.logger.error "Webhook processing failed: #{e.message}"
    raise e
  end

  private

  def determine_handler
    case transaction_type
    when 'equity_investment'
      PaystackWebhook::Handlers::EquityInvestmentHandler.new(@data)
    else
      PaystackWebhook::Handlers::DonationHandler.new(@data)
    end
  end

  def transaction_type
    metadata = @data[:metadata] || {}
    metadata[:type] || 'donation' # Default to donation for backward compatibility
  end
end