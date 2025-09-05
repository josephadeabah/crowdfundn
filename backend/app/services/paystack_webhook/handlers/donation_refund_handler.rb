# app/services/paystack_webhook/handlers/donation_refund_handler.rb
module PaystackWebhook::Handlers
  class DonationRefundHandler
    def initialize(donation: nil, transaction_reference: nil, reason: nil, error_details: nil)
      @donation = donation
      @transaction_reference = transaction_reference
      @reason = reason
      @error_details = error_details
    end

    def call
      donation = find_donation
      return unless donation

      Rails.logger.info "Initiating Paystack refund for donation #{donation.id}"

      paystack_service = PaystackService.new

      begin
        refund_response = paystack_service.initiate_refund(
          transaction: donation.transaction_reference,
          amount: (donation.gross_amount.to_f).to_i,
          currency: donation.campaign&.currency || 'GHS',
          customer_note: "Refund due to: #{@reason}",
          merchant_note: "Automatic refund for donation ID: #{donation.id}. Error: #{@error_details}"
        )

        if refund_response[:status]
          handle_successful_initiation(donation, refund_response)
        else
          handle_failed_initiation(donation, refund_response)
        end
      rescue => e
        handle_exception(donation, e)
      end
    end

    private

    def find_donation
      return @donation if @donation
      return Donation.find_by(transaction_reference: @transaction_reference) if @transaction_reference
      nil
    end

    def handle_successful_initiation(donation, refund_response)
      Rails.logger.info "Refund initiated successfully: #{refund_response.dig(:data, :reference)}"

      donation.update!(
        status: Donation::STATUS_REFUNDED,
        metadata: donation.metadata.merge(
          'refund_initiated_at' => Time.current.iso8601,
          'refund_reference' => refund_response.dig(:data, :reference),
          'refund_id' => refund_response.dig(:data, :id),
          'refund_status' => refund_response.dig(:data, :status),
          'refund_amount' => donation.gross_amount.to_f,
          'refund_reason' => @reason,
          'refund_error_details' => @error_details
        )
      )

      # Update campaign amounts if donation was previously successful
      if donation.successful?
        rollback_campaign_updates(donation)
      end

      send_refund_email(donation)
      DonationRefundStatusCheckJob.set(wait: 1.hour).perform_later(donation.id)
    end

    def handle_failed_initiation(donation, refund_response)
      message = refund_response[:message] || refund_response.dig(:data, :message) || 'Unknown error'
      Rails.logger.error "Failed to initiate refund: #{message}"

      donation.update!(
        metadata: donation.metadata.merge(
          'refund_initiated_at' => Time.current.iso8601,
          'refund_error' => message,
          'refund_requires_manual_intervention' => true,
          'refund_response' => refund_response,
          'refund_reason' => @reason,
          'refund_error_details' => @error_details
        )
      )
    end

    def handle_exception(donation, exception)
      Rails.logger.error "Exception during refund initiation: #{exception.message}"

      donation.update!(
        metadata: donation.metadata.merge(
          'refund_initiated_at' => Time.current.iso8601,
          'refund_error' => "Exception: #{exception.message}",
          'refund_requires_manual_intervention' => true,
          'refund_reason' => @reason,
          'refund_error_details' => @error_details
        )
      )
    end

    def rollback_campaign_updates(donation)
      return unless donation.campaign

      campaign = donation.campaign
      campaign.update!(
        current_amount: campaign.current_amount - donation.net_amount,
        total_successful_donations: campaign.total_successful_donations - donation.net_amount
      )
    end

    def send_refund_email(donation)
      recipient_email = donation.email
      recipient_name = donation.full_name || 'Donor'

      DonationRefundEmailService.send_refund_email(
        donation: donation,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        reason: @reason
      )
    rescue => e
      Rails.logger.error "Failed to send refund email: #{e.message}"
    end
  end
end