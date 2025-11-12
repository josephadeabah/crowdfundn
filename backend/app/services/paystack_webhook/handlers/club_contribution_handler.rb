# app/services/paystack_webhook/handlers/club_contribution_handler.rb
module PaystackWebhook::Handlers
  class ClubContributionHandler
    def initialize(data)
      @data = data
      @metadata = parse_metadata(data[:metadata])
    end

    def call
      return unless @metadata[:type] == 'club_contribution'

      Rails.logger.info "Processing club contribution webhook: #{@metadata.inspect}"

      contribution = InvestmentClubContribution.find_by(id: @metadata[:contribution_id])
      unless contribution
        Rails.logger.error "Club contribution not found: #{@metadata[:contribution_id]}"
        return
      end

      # CRITICAL: Skip if already completed to prevent double processing
      if contribution.completed?
        Rails.logger.info "Club contribution #{contribution.id} already completed, skipping webhook processing"
        return
      end

      # Verify transaction using PaystackService - ALWAYS verify with Paystack
      paystack_service = PaystackService.new
      verification_response = paystack_service.verify_transaction(@data[:reference])
      
      unless verification_response[:status] && verification_response[:data][:status] == 'success'
        Rails.logger.error "Transaction verification failed for club contribution #{contribution.id}: #{verification_response[:message]}"
        contribution.update!(status: 'failed')
        return
      end

      case verification_response[:data][:status]
      when 'success'
        process_successful_contribution(contribution, verification_response[:data])
      when 'failed'
        process_failed_contribution(contribution)
      else
        Rails.logger.warn "Unhandled club contribution status: #{verification_response[:data][:status]}"
      end
    end

    private

    def parse_metadata(metadata)
      if metadata.is_a?(String)
        begin
          JSON.parse(metadata, symbolize_names: true)
        rescue JSON::ParserError
          {}
        end
      else
        metadata || {}
      end
    end

    def process_successful_contribution(contribution, transaction_data)
      Rails.logger.info "Processing successful club contribution: #{contribution.id}"
      
      # CRITICAL: Use processed_at to prevent ANY double processing
      if contribution.processed_at.present?
        Rails.logger.info "Club contribution #{contribution.id} already processed at #{contribution.processed_at}, skipping"
        return
      end

      ActiveRecord::Base.transaction do
        # Get currency from webhook data
        transaction_currency = transaction_data[:currency]
        
        # Update club currency if it's different
        club = contribution.investment_club
        if club.currency != transaction_currency
          club.update!(currency: transaction_currency)
          Rails.logger.info "Updated club #{club.id} currency to #{transaction_currency}"
        end

        # Update contribution status
        contribution.update!(
          status: 'completed',
          transaction_reference: transaction_data[:reference],
          paystack_fee: 0,
          amount_settled: contribution.amount,
          currency: transaction_currency
        )

        # Process the completion - this will set processed_at
        contribution.process_completion!

        # Send confirmation email
        ClubEmailService.send_contribution_confirmation(
          user: contribution.user,
          contribution: contribution
        )
        
        Rails.logger.info "Successfully processed club contribution: #{contribution.id}"
      end
    rescue => e
      Rails.logger.error "Error processing club contribution #{contribution.id}: #{e.message}"
      Rails.logger.error e.backtrace.join("\n")
      # Don't mark as failed if we can't process - let frontend handle it
    end

    def process_failed_contribution(contribution)
      Rails.logger.warn "Club contribution failed: #{contribution.id}"
      
      contribution.update!(
        status: 'failed',
        transaction_reference: @data[:reference]
      )

      # Send failure notification using new service
      ClubEmailService.send_contribution_failed(
        user: contribution.user,
        contribution: contribution
      )
    end
  end
end