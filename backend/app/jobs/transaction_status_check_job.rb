# app/jobs/transaction_status_check_job.rb
class TransactionStatusCheckJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :exponentially_longer, attempts: 5

  MAX_ATTEMPTS = 10
  ABANDON_AFTER = 7.days

  def perform(transaction_reference, investment_id = nil)
    @transaction_reference = transaction_reference
    @investment = investment_id ? EquityInvestment.find_by(id: investment_id) : nil
    
    Rails.logger.info "Checking status for transaction #{transaction_reference}, investment: #{@investment&.id}"

    # Verify the transaction with Paystack
    response = PaystackService.new.verify_transaction(transaction_reference)
    
    unless response[:status] == true
      handle_verification_failure(response)
      return
    end

    transaction_status = response.dig(:data, :status)
    process_transaction_status(transaction_status, response)
  end

  private

  def process_transaction_status(status, response)
    case status
    when 'success'
      handle_successful_status(response)
    when 'failed'
      handle_failed_status(response)
    when 'pending'
      handle_still_pending_status(response)
    else
      handle_unknown_status(response, status)
    end
  end

  def handle_successful_status(response)
    Rails.logger.info "Transaction #{@transaction_reference} is now successful - processing"
    
    # Use the main handler to process the successful transaction
    PaystackWebhook::Handlers::EquityInvestmentHandler.new(
      reference: @transaction_reference
    ).process_successful_transaction(response)
  end

  def handle_failed_status(response)
    Rails.logger.warn "Transaction #{@transaction_reference} failed during status check"
    
    if @investment
      failure_reason = response.dig(:data, :gateway_response) || 'payment_failed'
      
      @investment.update!(
        status: EquityInvestment::STATUS_FAILED,
        metadata: @investment.metadata.merge(
          'failure_reason' => failure_reason,
          'failure_time' => Time.current.iso8601,
          'status_check_failure' => true
        )
      )
      
      send_failure_notification(response)
    end
  end

  def handle_still_pending_status(response)
    attempt_count = (@investment&.metadata&.[]('pending_attempts') || 0) + 1
    
    if should_continue_checking?(attempt_count)
      schedule_next_check(attempt_count, response)
    else
      handle_abandoned_transaction(response, attempt_count)
    end
  end

  def handle_unknown_status(response, status)
    Rails.logger.error "Unknown status '#{status}' for transaction #{@transaction_reference}"
    
    # For unknown status, treat as pending and schedule another check
    attempt_count = (@investment&.metadata&.[]('pending_attempts') || 0) + 1
    
    if should_continue_checking?(attempt_count)
      schedule_next_check(attempt_count, response)
    else
      handle_abandoned_transaction(response, attempt_count)
    end
  end

  def handle_verification_failure(response)
    Rails.logger.error "Failed to verify transaction #{@transaction_reference}: #{response[:message]}"
    
    # Schedule another check if we can't verify (might be temporary API issue)
    attempt_count = (@investment&.metadata&.[]('pending_attempts') || 0) + 1
    
    if should_continue_checking?(attempt_count)
      schedule_next_check(attempt_count, nil)
    else
      mark_transaction_as_abandoned("verification_failed_after_#{attempt_count}_attempts")
    end
  end

  def should_continue_checking?(attempt_count)
    return false if attempt_count >= MAX_ATTEMPTS
    
    if @investment
      investment_age = Time.current - @investment.created_at
      return investment_age < ABANDON_AFTER
    end
    
    true
  end

  def schedule_next_check(attempt_count, response)
    check_time = calculate_next_check_time(attempt_count)
    
    if @investment
      @investment.update!(
        metadata: @investment.metadata.merge(
          'pending_attempts' => attempt_count,
          'last_status_check' => Time.current.iso8601,
          'next_check_time' => check_time.iso8601
        )
      )
    end

    TransactionStatusCheckJob.set(wait_until: check_time).perform_later(
      @transaction_reference,
      @investment&.id
    )
    
    Rails.logger.info "Scheduled next status check for #{@transaction_reference} at #{check_time} (attempt ##{attempt_count})"
  end

  def handle_abandoned_transaction(response, attempt_count)
    Rails.logger.warn "Abandoning transaction #{@transaction_reference} after #{attempt_count} attempts"
    
    mark_transaction_as_abandoned("abandoned_after_#{attempt_count}_attempts")
    
    if @investment
      @investment.update!(
        status: EquityInvestment::STATUS_ABANDONED,
        metadata: @investment.metadata.merge(
          'abandoned_time' => Time.current.iso8601,
          'final_attempt_count' => attempt_count,
          'final_status' => response.dig(:data, :status)
        )
      )
      
      send_abandonment_notification(response)
    end
  end

  def mark_transaction_as_abandoned(reason)
    Rails.logger.warn "Transaction #{@transaction_reference} abandoned: #{reason}"
  end

  def calculate_next_check_time(attempt_count)
    # Exponential backoff with longer intervals
    intervals = [
      5.minutes,      # 1st retry
      15.minutes,     # 2nd
      30.minutes,     # 3rd
      1.hour,         # 4th
      2.hours,        # 5th
      4.hours,        # 6th
      8.hours,        # 7th
      12.hours,       # 8th
      24.hours,       # 9th
      48.hours        # 10th
    ]
    
    interval_index = [attempt_count - 1, intervals.size - 1].min
    intervals[interval_index].from_now
  end

  def send_failure_notification(response)
    return unless @investment
    
    recipient_email = @investment.email
    recipient_name = @investment.user&.full_name || @investment.full_name || 'Investor'
    failure_reason = response.dig(:data, :gateway_response) || 'Payment failed'

    begin
      InvestmentFailureEmailService.send_failure_email(
        investment: @investment,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        failure_reason: failure_reason,
        metadata: @investment.metadata
      )
    rescue => e
      Rails.logger.error "Failed to send failure notification: #{e.message}"
    end
  end

  def send_abandonment_notification(response)
    return unless @investment
    
    recipient_email = @investment.email
    recipient_name = @investment.user&.full_name || @investment.full_name || 'Investor'

    begin
      InvestmentAbandonmentEmailService.send_abandonment_email(
        investment: @investment,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        attempt_count: @investment.metadata['pending_attempts'],
        final_status: response.dig(:data, :status)
      )
    rescue => e
      Rails.logger.error "Failed to send abandonment notification: #{e.message}"
    end
  end
end