# app/jobs/donation_status_check_job.rb
class DonationStatusCheckJob < ApplicationJob
  queue_as :default

  def perform(transaction_reference, donation_id = nil)
    donation = donation_id ? Donation.find_by(id: donation_id) : Donation.find_by(transaction_reference: transaction_reference)
    
    unless donation
      Rails.logger.error "DonationStatusCheckJob: Could not find donation with reference #{transaction_reference} or ID #{donation_id}"
      return
    end

    Rails.logger.info "Checking status for donation #{donation.id}, reference #{transaction_reference}"

    paystack_service = PaystackService.new
    response = paystack_service.verify_transaction(transaction_reference)

    unless response[:status] == true
      Rails.logger.error "Transaction verification failed for #{transaction_reference}"
      handle_verification_failure(donation, response)
      return
    end

    transaction_status = response.dig(:data, :status)
    
    case transaction_status
    when 'success'
      handle_successful_transaction(donation, response)
    when 'failed', 'abandoned', 'reversed'
      handle_final_status(donation, response, transaction_status)
    when 'pending', 'processing', 'ongoing', 'queued'
      handle_pending_status(donation, response, transaction_status)
    else
      handle_unknown_status(donation, response, transaction_status)
    end
  end

  private

  def handle_successful_transaction(donation, response)
    if donation.pending? || donation.initialized?
      # Process as new successful transaction
      handler = PaystackWebhook::Handlers::DonationHandler.new(response[:data])
      handler.send(:process_successful_transaction, response)
    else
      Rails.logger.info "Donation #{donation.id} already processed with status: #{donation.status}"
    end
  end

  def handle_final_status(donation, response, status)
    donation.update!(
      status: map_status(status),
      metadata: donation.metadata.merge(
        'last_status_check' => Time.current.iso8601,
        'transaction_status' => status,
        'gateway_response' => response.dig(:data, :gateway_response)
      )
    )

    # Initiate refund if needed for failed transactions
    if status == 'failed' && donation.requires_refund?
      donation.initiate_refund('payment_failure')
    end
  end

  def handle_pending_status(donation, response, status)
    attempt_count = (donation.metadata&.[]('status_attempts') || 0) + 1
    
    donation.update!(
      status: Donation::STATUS_PENDING,
      metadata: donation.metadata.merge(
        'last_status_check' => Time.current.iso8601,
        'transaction_status' => status,
        'status_attempts' => attempt_count,
        'gateway_response' => response.dig(:data, :gateway_response)
      )
    )

    # Schedule next check with exponential backoff
    if attempt_count <= 10 # Maximum 10 attempts
      check_time = calculate_next_check_time(attempt_count, status)
      DonationStatusCheckJob.set(wait_until: check_time).perform_later(
        donation.transaction_reference,
        donation.id
      )
    else
      handle_max_attempts_reached(donation)
    end
  end

  def handle_unknown_status(donation, response, status)
    Rails.logger.warn "Unknown status #{status} for donation #{donation.id}"
    
    donation.update!(
      metadata: donation.metadata.merge(
        'last_status_check' => Time.current.iso8601,
        'unknown_status' => status,
        'gateway_response' => response.dig(:data, :gateway_response)
      )
    )
  end

  def handle_verification_failure(donation, response)
    attempt_count = (donation.metadata&.[]('verification_attempts') || 0) + 1
    
    donation.update!(
      metadata: donation.metadata.merge(
        'verification_attempts' => attempt_count,
        'last_verification_error' => response[:message],
        'last_verification_attempt' => Time.current.iso8601
      )
    )

    if attempt_count <= 3
      DonationStatusCheckJob.set(wait: (attempt_count * 5).minutes).perform_later(
        donation.transaction_reference,
        donation.id
      )
    else
      handle_max_verification_attempts(donation)
    end
  end

  def handle_max_attempts_reached(donation)
    donation.update!(
      status: Donation::STATUS_FAILED,
      metadata: donation.metadata.merge(
        'max_status_checks_reached' => true,
        'final_status_check' => Time.current.iso8601
      )
    )
    
    Rails.logger.warn "Maximum status check attempts reached for donation #{donation.id}"
  end

  def handle_max_verification_attempts(donation)
    donation.update!(
      status: Donation::STATUS_FAILED,
      metadata: donation.metadata.merge(
        'max_verification_attempts' => true,
        'final_verification_attempt' => Time.current.iso8601
      )
    )
    
    Rails.logger.error "Maximum verification attempts reached for donation #{donation.id}"
  end

  def map_status(paystack_status)
    case paystack_status
    when 'success' then Donation::STATUS_SUCCESSFUL
    when 'failed' then Donation::STATUS_FAILED
    when 'abandoned' then Donation::STATUS_ABANDONED
    when 'reversed' then Donation::STATUS_REFUNDED
    else Donation::STATUS_PENDING
    end
  end

  def calculate_next_check_time(attempt_count, status)
    intervals = case status
                when 'ongoing' then [2, 5, 10, 15, 30, 60]
                when 'processing' then [5, 15, 30, 60, 120, 240]
                else [5, 15, 30, 60, 120, 240, 480, 720, 1440]
                end
    
    interval_index = [attempt_count - 1, intervals.size - 1].min
    interval_minutes = intervals[interval_index]
    
    interval_minutes.minutes.from_now
  end
end