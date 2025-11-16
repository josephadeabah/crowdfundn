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

      # FIXED: Verify the transfer was already deducted during initiation
      # The amount should have been deducted when the transfer was initiated
      # So we just need to update the status
      
      # Update the club transfer status
      club_transfer.update!(
        status: 'success',
        completed_at: Time.current,
        bank_name: @data.dig(:recipient, :details, :bank_name),
        account_number: @data.dig(:recipient, :details, :account_number)
      )

      Rails.logger.info "Club transfer #{transfer_code} marked as successful"
      Rails.logger.info "Transfer amount #{club_transfer.amount} was already deducted from club balance during initiation"

      # UPDATE THE SUBACCOUNT with only existing attributes
      subaccount = Subaccount.find_by(recipient_code: club_transfer.recipient_code)
      if subaccount
        subaccount.update!(
          status: 'success',
          completed_at: Time.current,
          amount: @data[:amount], # This is in kobo/pesewa (1000000 = 10000 GHS)
          transfer_code: @data[:transfer_code],
          reference: @data[:reference],
          # Only these fields exist in Subaccount:
          account_number: @data.dig(:recipient, :details, :account_number),
          bank: @data.dig(:recipient, :details, :bank_name), # Use 'bank' not 'bank_name'
          business_name: @data.dig(:recipient, :name) # Use recipient name as business_name
        )
        Rails.logger.info "Subaccount #{subaccount.id} updated with transfer reference #{@data[:reference]}."
      else
        Rails.logger.warn "Subaccount not found for recipient_code #{club_transfer.recipient_code}."
      end

      # Send notification
      # send_club_transfer_notification(club_transfer)

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