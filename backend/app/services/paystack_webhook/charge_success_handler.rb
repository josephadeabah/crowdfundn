class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    Rails.logger.info "Processing charge success: #{transaction_reference}"

    # Parse metadata to determine type
    metadata = parse_metadata(@data[:metadata])
    donation_type = metadata[:type] == 'equity_investment' ? 'EquityInvestment' : nil

    # Find existing record with type consideration
    existing = Donation.find_by(
      transaction_reference: transaction_reference,
      type: donation_type
    )

    if existing
      handle_existing_donation(existing)
    else
      handle_new_donation(metadata)
    end

    { status: :ok }
  rescue StandardError => e
    Rails.logger.error "Webhook processing failed: #{e.message}"
    { status: :error, message: e.message }
  end

  private

  def parse_metadata(metadata)
    if metadata.is_a?(String)
      JSON.parse(metadata, symbolize_names: true) rescue {}
    else
      metadata || {}
    end
  end

  def handle_existing_donation(donation)
    if donation.status == 'successful'
      Rails.logger.info "Donation #{donation.id} already processed"
    else
      donation.update!(status: 'successful')
      Rails.logger.info "Updated donation #{donation.id} to successful"
    end
  end

  def handle_new_donation(metadata)
    if metadata[:type] == 'equity_investment'
      PaystackWebhook::Handlers::EquityInvestmentHandler.new(@data).call
    else
      PaystackWebhook::Handlers::DonationHandler.new(@data).call
    end
  end
end