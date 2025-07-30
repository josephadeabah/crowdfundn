class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    Rails.logger.info { "Processing charge success: #{transaction_reference}" }

    # Check if the event has already been processed (deduplication)
    if EventProcessed.exists?(event_id: transaction_reference)
      return
    end

    ActiveRecord::Base.transaction do
      if equity_investment?(@data)
        PaystackWebhook::Handlers::EquityInvestmentHandler.new(@data).call
      else
        PaystackWebhook::Handlers::DonationHandler.new(@data).call
      end
      
      EventProcessed.create!(event_id: transaction_reference)
    end
  rescue => e
    Rails.logger.error "Webhook processing failed: #{e.message}"
    raise e
  end

  private

  def equity_investment?(data)
    metadata = data[:metadata] || {}
    metadata[:type] == 'equity_investment'
  end
end