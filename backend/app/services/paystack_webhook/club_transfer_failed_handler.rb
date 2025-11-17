# app/services/paystack_webhook/club_transfer_failed_handler.rb
class PaystackWebhook::ClubTransferFailedHandler
  def initialize(data)
    @data = data
  end

  def call
    transfer_code = @data[:transfer_code]
    
    Rails.logger.info "=== CLUB TRANSFER FAILED HANDLER ==="
    Rails.logger.info "Processing failed club transfer: #{transfer_code}"

    # Check if event already processed
    if EventProcessed.exists?(event_id: transfer_code)
      Rails.logger.info "Club transfer failure event already processed: #{transfer_code}"
      return { success: true, message: 'Event already processed' }
    end

    ActiveRecord::Base.transaction do
      # FIXED: Find the club transfer with lock to prevent race conditions
      club_transfer = ClubTransfer.lock.find_by(transfer_code: transfer_code)
      
      unless club_transfer
        Rails.logger.error "ClubTransfer not found for transfer_code: #{transfer_code}"
        return { success: false, error: 'Club transfer not found' }
      end

      # FIXED: Check if already processed to prevent double processing
      if club_transfer.failed?
        Rails.logger.info "Club transfer #{transfer_code} already marked as failed"
        return { success: true, message: 'Transfer already failed' }
      end

      # FIXED: Use the model method for consistency
      failure_reason = @data[:gateway_response] || @data[:reason] || 'Transfer failed'
      club_transfer.mark_as_failed!(failure_reason)

      # FIXED: Update subaccount with proper error handling
      subaccount = Subaccount.find_by(recipient_code: club_transfer.recipient_code)
      if subaccount
        subaccount.update!(
          status: 'failed',
          failure_reason: failure_reason
        )
        Rails.logger.info "Subaccount #{subaccount.id} marked as failed"
      else
        Rails.logger.warn "Subaccount not found for recipient_code #{club_transfer.recipient_code}"
      end

      Rails.logger.info "Club transfer failure processing completed"

      # FIXED: Send failure notification
      send_club_transfer_failure_notification(club_transfer)
      
      { success: true, message: 'Transfer failure processed successfully' }
    end

  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error processing club transfer failure: #{e.message}"
    { success: false, error: "Validation failed: #{e.message}" }
  rescue StandardError => e
    Rails.logger.error "Error processing club transfer failure: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    { success: false, error: e.message }
  ensure
    # FIXED: Only mark as processed if successful
    unless EventProcessed.exists?(event_id: transfer_code)
      EventProcessed.create(event_id: transfer_code)
      Rails.logger.info "Event #{transfer_code} marked as processed"
    end
  end

  private

  def send_club_transfer_failure_notification(club_transfer)
    club = club_transfer.investment_club
    admins = club.admin_members

    admins.each do |admin|
      begin
        ClubTransferMailer.transfer_failed_notification(
          admin, 
          club_transfer
        ).deliver_later
      rescue => e
        Rails.logger.error "Failed to send failure notification to admin #{admin.id}: #{e.message}"
      end
    end

    Rails.logger.info "Sent failure notifications to #{admins.count} admin(s)"
  end
end