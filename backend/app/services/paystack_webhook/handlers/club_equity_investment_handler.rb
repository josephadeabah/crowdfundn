module PaystackWebhook::Handlers
  class ClubEquityInvestmentHandler
    include PaystackWebhook::JsonHelper

    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      Rails.logger.info "Verifying club equity investment with reference #{transaction_reference}"

      response = PaystackService.new.verify_transaction(transaction_reference)
      unless response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      transaction_status = response.dig(:data, :status)
      
      case transaction_status
      when 'success'
        process_successful_club_transaction(response)
      when 'failed'
        handle_failed_club_transaction(response)
      else
        handle_other_club_status(response, transaction_status)
      end
    end

    private

    def process_successful_club_transaction(response)
      metadata = parse_metadata(response)

      # Find the club investment
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      unless club_investment
        Rails.logger.error "Club investment not found: #{metadata[:club_investment_id]}"
        raise 'Club investment not found'
      end

      # Find the underlying equity investment
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      unless equity_investment
        Rails.logger.error "Equity investment not found: #{metadata[:investment_id]}"
        raise 'Equity investment not found'
      end

      ActiveRecord::Base.transaction do
        # Update the equity investment status to SUCCESSFUL
        equity_investment.update!(
          status: EquityInvestment::STATUS_SUCCESSFUL,
          processed: true
        )

        # Update the club investment status to SUCCESSFUL
        club_investment.update!(
          status: ClubInvestment::STATUS_SUCCESSFUL,
          equity_investment_id: equity_investment.id,
          shares: equity_investment.shares,
          percentage: equity_investment.percentage,
          investment_date: equity_investment.investment_date,
          certificate_number: equity_investment.certificate_number,
          transaction_reference: equity_investment.transaction_reference
        )

        # Generate certificate for club investment
        if ClubInvestmentCertificateService.generate_certificate(club_investment)
          Rails.logger.info "Certificate generated successfully for club investment #{club_investment.id}"
        else
          Rails.logger.error "Failed to generate certificate for club investment #{club_investment.id}"
        end

        # Notify club members
        send_club_investment_confirmation(club_investment, metadata)
        
        Rails.logger.info "Successfully processed club investment: #{club_investment.id}"
      end
    end

    def handle_failed_club_transaction(response)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      
      if club_investment
        # Refund the club balance
        club_investment.investment_club.refund_balance(club_investment.investment_amount)
        
        club_investment.update!(
          status: ClubInvestment::STATUS_FAILED
        )
        
        send_club_investment_failure_notification(club_investment, response, metadata)
      end
    end

    def handle_other_club_status(response, status)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      
      Rails.logger.warn "Unhandled club investment status '#{status}' for reference #{response.dig(:data, :reference)}"
      
      if club_investment
        club_investment.update!(
          status: ClubInvestment::STATUS_FAILED,
          metadata: club_investment.metadata.merge(
            'failure_reason' => "unhandled_status_#{status}",
            'failure_time' => Time.current.iso8601
          )
        )
      end
    end

    def parse_metadata(response)
      if response.dig(:data, :metadata).is_a?(String)
        begin
          fixed_metadata = fix_malformed_json(response.dig(:data, :metadata))
          JSON.parse(fixed_metadata, symbolize_names: true)
        rescue JSON::ParserError => e
          Rails.logger.error "Failed to parse metadata: #{e.message}"
          raise "Invalid metadata: #{response.dig(:data, :metadata)}"
        end
      else
        response.dig(:data, :metadata) || {}
      end
    end

    def send_club_investment_confirmation(club_investment, metadata)
      # Notify all club members about successful investment
      club_investment.investment_club.active_members.each do |member|
        ClubEmailService.send_investment_confirmation(
          user: member,
          club_investment: club_investment
        )
      end
    rescue => e
      Rails.logger.error "Failed to send club investment confirmation: #{e.message}"
    end

    def send_club_investment_failure_notification(club_investment, response, metadata)
      # Notify club admins about failed investment
      club_investment.investment_club.admin_members.each do |admin|
        ClubEmailService.send_investment_failure(
          admin: admin,
          club_investment: club_investment,
          error: response.dig(:data, :message) || 'Payment failed',
          metadata: metadata
        )
      end
    rescue => e
      Rails.logger.error "Failed to send club investment failure notification: #{e.message}"
    end
  end
end