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

      # Verify transaction using PaystackService
      paystack_service = PaystackService.new
      verification_response = paystack_service.verify_transaction(@data[:reference])
      
      unless verification_response[:status] && verification_response[:data][:status] == 'success'
        Rails.logger.error "Transaction verification failed for club contribution #{contribution.id}"
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

      ActiveRecord::Base.transaction do
        # Update contribution status - NO PLATFORM FEES DEDUCTED
        contribution.update!(
          status: 'completed',
          transaction_reference: transaction_data[:reference],
          paystack_fee: 0, # No platform fees for club contributions
          amount_settled: contribution.amount # Full amount goes to club
        )

        # Update club financials
        club = contribution.investment_club
        club.update_financials

        # Update member's total contributions
        membership = club.membership_for(contribution.user)
        membership.update!(total_contributed: membership.total_contributed + contribution.amount)

        # Create club transaction record
        ClubTransaction.create!(
          investment_club: club,
          amount: contribution.amount,
          transaction_type: 'contribution',
          status: 'completed',
          reference: transaction_data[:reference],
          description: "Member contribution from #{contribution.user.full_name}"
        )

        # Send confirmation email using new service
        ClubEmailService.send_contribution_confirmation(
          user: contribution.user,
          contribution: contribution
        )
        
        Rails.logger.info "Successfully processed club contribution: #{contribution.id}"
      end
    rescue => e
      Rails.logger.error "Error processing club contribution #{contribution.id}: #{e.message}"
      contribution.update!(status: 'failed') if contribution
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