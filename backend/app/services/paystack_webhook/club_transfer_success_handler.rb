# app/services/paystack_webhook/club_transfer_success_handler.rb
class PaystackWebhook::ClubTransferSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transfer_code = @data[:transfer_code]
    
    Rails.logger.info "=== CLUB TRANSFER SUCCESS HANDLER ==="
    Rails.logger.info "Processing club transfer: #{transfer_code}"

    # Check if event already processed
    if EventProcessed.exists?(event_id: transfer_code)
      Rails.logger.info "Club transfer event already processed: #{transfer_code}"
      return
    end

    ActiveRecord::Base.transaction do
      # Find the club transfer by transfer_code
      club_transfer = ClubTransfer.find_by(transfer_code: transfer_code)
      
      unless club_transfer
        Rails.logger.error "ClubTransfer not found for transfer_code: #{transfer_code}"
        return
      end

      # Update the club transfer status
      club_transfer.update!(
        status: 'success',
        completed_at: Time.current,
        bank_name: @data.dig(:recipient, :details, :bank_name),
        account_number: @data.dig(:recipient, :details, :account_number)
      )

      Rails.logger.info "Club transfer #{transfer_code} marked as successful"

      # Send notification (no need to update balance - it was already deducted)
      send_club_transfer_notification(club_transfer)

      Rails.logger.info "Club transfer processing completed for club: #{club_transfer.investment_club.name}"
    end

  rescue StandardError => e
    Rails.logger.error "Error processing club transfer success: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e
  ensure
    EventProcessed.create(event_id: transfer_code) unless EventProcessed.exists?(event_id: transfer_code)
  end

  private

  def send_club_transfer_notification(club_transfer)
    club = club_transfer.investment_club
    admins = club.admin_members

    admins.each do |admin|
      ClubTransferMailer.transfer_success_notification(
        admin, 
        club_transfer
      ).deliver_later
    end

    Rails.logger.info "Sent success notifications to #{admins.count} admin(s)"
  end
end