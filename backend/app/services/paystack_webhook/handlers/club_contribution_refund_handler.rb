# app/services/paystack_webhook/handlers/club_contribution_refund_handler.rb
module PaystackWebhook::Handlers
  class ClubContributionRefundHandler
    def initialize(data)
      @data = data
      @metadata = parse_metadata(data[:metadata])
    end

    def call
      return unless @metadata[:type] == 'club_contribution'

      Rails.logger.info "Processing club contribution refund: #{@metadata.inspect}"

      contribution = InvestmentClubContribution.find_by(id: @metadata[:contribution_id])
      unless contribution
        Rails.logger.error "Club contribution not found for refund: #{@metadata[:contribution_id]}"
        return
      end

      process_refund(contribution)
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

    def process_refund(contribution)
      Rails.logger.info "Processing refund for club contribution: #{contribution.id}"

      ActiveRecord::Base.transaction do
        # Update contribution status
        contribution.update!(
          status: 'refunded',
          refund_reference: @data[:reference],
          refunded_at: Time.current
        )

        # Update club financials (reverse the contribution)
        club = contribution.investment_club
        club.update_financials

        # Update member's total contributions (reverse)
        membership = club.membership_for(contribution.user)
        membership.update!(total_contributed: membership.total_contributed - contribution.amount)

        # Create refund transaction record
        ClubTransaction.create!(
          investment_club: club,
          amount: -contribution.amount, # Negative amount for refund
          transaction_type: 'refund',
          status: 'completed',
          reference: @data[:reference],
          description: "Refund for contribution from #{contribution.user.full_name}"
        )

        # Send refund notification using new service
        ClubEmailService.send_contribution_refunded(
          user: contribution.user,
          contribution: contribution
        )
        
        Rails.logger.info "Successfully processed club contribution refund: #{contribution.id}"
      end
    rescue => e
      Rails.logger.error "Error processing club contribution refund #{contribution.id}: #{e.message}"
    end
  end
end