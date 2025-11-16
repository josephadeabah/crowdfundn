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
      # Find the club transfer by transfer_code (this is the most reliable)
      club_transfer = ClubTransfer.find_by(transfer_code: transfer_code)
      
      unless club_transfer
        Rails.logger.error "ClubTransfer not found for transfer_code: #{transfer_code}"
        return
      end

      club = club_transfer.investment_club
      
      # Verify the transfer amount was already deducted during initiation
      # If not, deduct it now (safety check)
      expected_balance = club.total_contributions - club.total_invested - club_transfer.amount
      if (club.current_balance - expected_balance).abs > 0.01
        Rails.logger.warn "Balance mismatch detected. Correcting balance..."
        club.update_columns(
          current_balance: expected_balance,
          total_contributions: expected_balance,
          updated_at: Time.current
        )
      end

      # Update the club transfer status
      club_transfer.update!(
        status: 'success',
        completed_at: Time.current,
        bank_name: @data.dig(:recipient, :details, :bank_name),
        account_number: @data.dig(:recipient, :details, :account_number)
      )

      Rails.logger.info "Club transfer #{transfer_code} marked as successful"
      Rails.logger.info "Final club balance: #{club.reload.current_balance}"
    end

  rescue StandardError => e
    Rails.logger.error "Error processing club transfer success: #{e.message}"
    Rails.logger.error e.backtrace.join("\n")
    raise e
  ensure
    EventProcessed.create(event_id: transfer_code) unless EventProcessed.exists?(event_id: transfer_code)
  end
end