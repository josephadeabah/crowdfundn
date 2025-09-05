# app/jobs/donation_refund_status_check_job.rb
class DonationRefundStatusCheckJob < ApplicationJob
  queue_as :default

  def perform(donation_id)
    donation = Donation.find_by(id: donation_id)
    return unless donation && donation.refunded?

    refund_reference = donation.metadata&.[]('refund_reference')
    return unless refund_reference

    Rails.logger.info "Checking refund status for donation #{donation.id}, refund reference #{refund_reference}"

    paystack_service = PaystackService.new
    response = paystack_service.verify_transaction(refund_reference)

    if response[:status] == true
      update_refund_status(donation, response)
    else
      handle_refund_verification_failure(donation, response)
    end
  end

  private

  def update_refund_status(donation, response)
    refund_status = response.dig(:data, :status)
    refunded_amount = response.dig(:data, :amount).to_f / 100.0

    donation.update!(
      metadata: donation.metadata.merge(
        'refund_status' => refund_status,
        'refunded_amount' => refunded_amount,
        'refund_processed_at' => response.dig(:data, :processed_at),
        'last_refund_check' => Time.current.iso8601
      )
    )

    case refund_status
    when 'processed'
      handle_processed_refund(donation)
    when 'pending'
      schedule_next_refund_check(donation)
    when 'failed'
      handle_failed_refund(donation, response)
    end
  end

  def handle_processed_refund(donation)
    Rails.logger.info "Refund processed successfully for donation #{donation.id}"
    # Additional processing if needed
  end

  def handle_failed_refund(donation, response)
    Rails.logger.error "Refund failed for donation #{donation.id}: #{response.dig(:data, :message)}"
    
    donation.update!(
      metadata: donation.metadata.merge(
        'refund_failed' => true,
        'refund_failure_reason' => response.dig(:data, :message),
        'requires_manual_intervention' => true
      )
    )
  end

  def handle_refund_verification_failure(donation, response)
    attempt_count = (donation.metadata&.[]('refund_check_attempts') || 0) + 1
    
    donation.update!(
      metadata: donation.metadata.merge(
        'refund_check_attempts' => attempt_count,
        'last_refund_check_error' => response[:message]
      )
    )

    if attempt_count <= 5
      DonationRefundStatusCheckJob.set(wait: (attempt_count * 30).minutes).perform_later(donation.id)
    else
      handle_max_refund_check_attempts(donation)
    end
  end

  def schedule_next_refund_check(donation)
    attempt_count = (donation.metadata&.[]('refund_check_attempts') || 0) + 1
    
    if attempt_count <= 12 # Check for up to 24 hours (every 2 hours)
      donation.update!(
        metadata: donation.metadata.merge(
          'refund_check_attempts' => attempt_count
        )
      )
      DonationRefundStatusCheckJob.set(wait: 2.hours).perform_later(donation.id)
    else
      handle_max_refund_check_attempts(donation)
    end
  end

  def handle_max_refund_check_attempts(donation)
    donation.update!(
      metadata: donation.metadata.merge(
        'max_refund_checks_reached' => true,
        'requires_manual_intervention' => true
      )
    )
    
    Rails.logger.warn "Maximum refund status check attempts reached for donation #{donation.id}"
  end
end