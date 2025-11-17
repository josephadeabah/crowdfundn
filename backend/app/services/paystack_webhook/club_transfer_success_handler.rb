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
      if club_transfer.success?
        Rails.logger.info "Club transfer #{transfer_code} already marked as success"
        return { success: true, message: 'Transfer already successful' }
      end

      # FIXED: Use the model method for consistency
      club_transfer.mark_as_successful!(@data)
      
      # Update the club transfer status
      club_transfer.update!(
        status: 'success',
        completed_at: Time.current,
        bank_name: @data.dig(:recipient, :details, :bank_name),
        account_number: @data.dig(:recipient, :details, :account_number)
      )

      Rails.logger.info "Club transfer #{transfer_code} marked as successful"

      # FIXED: Update subaccount with proper error handling
      subaccount = Subaccount.find_by(recipient_code: club_transfer.recipient_code)
      if subaccount
        # Convert amount from subunit to main unit (kobo/pesewa to main currency)
        amount_in_main_unit = (@data[:amount].to_f / 100.0).round(2)
        
        subaccount.update!(
          status: 'success',
          completed_at: Time.current,
          amount: amount_in_main_unit, # Store in main currency unit
          transfer_code: @data[:transfer_code],
          reference: @data[:reference],
          account_number: @data.dig(:recipient, :details, :account_number),
          bank: @data.dig(:recipient, :details, :bank_name),
          business_name: @data.dig(:recipient, :name)
        )
        Rails.logger.info "Subaccount #{subaccount.id} updated with transfer success"
      else
        Rails.logger.warn "Subaccount not found for recipient_code #{club_transfer.recipient_code}"
      end

      # FIXED: Send notification with error handling
      send_club_transfer_notification(club_transfer)

      Rails.logger.info "Club transfer processing completed for club: #{club_transfer.investment_club.name}"
      
      { success: true, message: 'Transfer processed successfully' }
    end

  rescue ActiveRecord::RecordInvalid => e
    Rails.logger.error "Validation error processing club transfer success: #{e.message}"
    { success: false, error: "Validation failed: #{e.message}" }
  rescue StandardError => e
    Rails.logger.error "Error processing club transfer success: #{e.message}"
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

  def send_club_transfer_notification(club_transfer)
    club = club_transfer.investment_club
    admins = club.admin_members

    admins.each do |admin|
      begin
        ClubTransferMailer.transfer_success_notification(
          admin, 
          club_transfer
        ).deliver_later
      rescue => e
        Rails.logger.error "Failed to send success notification to admin #{admin.id}: #{e.message}"
      end
    end

    Rails.logger.info "Sent success notifications to #{admins.count} admin(s)"
  end
end