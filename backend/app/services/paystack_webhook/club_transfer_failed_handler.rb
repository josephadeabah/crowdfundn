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
      return
    end

    ActiveRecord::Base.transaction do
      # Find the club transfer
      club_transfer = ClubTransfer.find_by(transfer_code: transfer_code)
      
      unless club_transfer
        Rails.logger.error "ClubTransfer not found for transfer_code: #{transfer_code}"
        return
      end

      # Update the club transfer status
      club_transfer.update!(
        status: 'failed',
        failure_reason: @data[:gateway_response] || 'Transfer failed'
      )

      # UPDATE THE SUBACCOUNT with only existing attributes
      subaccount = Subaccount.find_by(recipient_code: club_transfer.recipient_code)
      if subaccount
        subaccount.update!(
          status: 'failed',
          failure_reason: @data[:gateway_response] || 'Transfer failed'
        )
        Rails.logger.info "Subaccount #{subaccount.id} marked as failed."
      else
        Rails.logger.warn "Subaccount not found for recipient_code #{club_transfer.recipient_code}."
      end

      # REFUND THE CLUB BALANCE
      refund_amount = club_transfer.amount
      club = club_transfer.investment_club
      new_balance = club.current_balance + refund_amount
      club.update!(current_balance: new_balance)

      Rails.logger.info "Club transfer #{transfer_code} failed. Refunded #{refund_amount} to club #{club.name}. New balance: #{new_balance}"

      # Send failure notification
      # send_club_transfer_failure_notification(club_transfer)

      Rails.logger.info "Club transfer failure processing completed"
    end

  rescue StandardError => e
    Rails.logger.error "Error processing club transfer failure: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e
  ensure
    EventProcessed.create(event_id: transfer_code) unless EventProcessed.exists?(event_id: transfer_code)
  end

  private

  def send_club_transfer_failure_notification(club_transfer)
    club = club_transfer.investment_club
    admins = club.admin_members

    admins.each do |admin|
      ClubTransferMailer.transfer_failed_notification(
        admin, 
        club_transfer
      ).deliver_later
    end

    Rails.logger.info "Sent failure notifications to #{admins.count} admin(s)"
  end
end