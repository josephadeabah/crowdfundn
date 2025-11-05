# app/services/paystack_webhook/handlers/club_investment_handler.rb
module PaystackWebhook::Handlers
  class ClubInvestmentHandler
    def initialize(data)
      @data = data
      @metadata = parse_metadata(data[:metadata])
    end

    def call
      return unless @metadata[:type] == 'club_investment'

      Rails.logger.info "Processing club investment webhook: #{@metadata.inspect}"

      club_investment = ClubInvestment.find_by(id: @metadata[:club_investment_id])
      unless club_investment
        Rails.logger.error "Club investment not found: #{@metadata[:club_investment_id]}"
        return
      end

      # Verify transfer using PaystackService
      paystack_service = PaystackService.new
      verification_response = paystack_service.verify_transfer(@data[:reference])
      
      unless verification_response[:status] && verification_response[:data][:status] == 'success'
        Rails.logger.error "Transfer verification failed for club investment #{club_investment.id}"
        club_investment.update!(status: 'failed')
        return
      end

      case verification_response[:data][:status]
      when 'success'
        process_successful_investment(club_investment, verification_response[:data])
      when 'failed'
        process_failed_investment(club_investment)
      else
        Rails.logger.warn "Unhandled club investment status: #{verification_response[:data][:status]}"
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

    def process_successful_investment(club_investment, transfer_data)
      Rails.logger.info "Processing successful club investment: #{club_investment.id}"

      ActiveRecord::Base.transaction do
        # Execute the investment using your existing campaign investment logic
        investment_service = ClubInvestmentService.new(club_investment)
        result = investment_service.process_investment_execution

        if result[:success]
          # Update club investment status
          club_investment.update!(
            status: 'executed',
            transaction_reference: transfer_data[:reference],
            executed_at: Time.current
          )

          # Create club transaction record
          ClubTransaction.create!(
            investment_club: club_investment.investment_club,
            club_investment: club_investment,
            amount: club_investment.investment_amount,
            transaction_type: 'investment',
            status: 'completed',
            reference: transfer_data[:reference],
            description: "Investment in #{club_investment.campaign.title}"
          )

          # Notify all club members
          send_investment_execution_notification(club_investment)
          
          Rails.logger.info "Successfully processed club investment: #{club_investment.id}"
        else
          Rails.logger.error "Failed to execute club investment: #{result[:error]}"
          club_investment.update!(status: 'failed')
          
          # TODO: Consider refund logic here if investment execution fails after transfer
        end
      end
    rescue => e
      Rails.logger.error "Error processing club investment #{club_investment.id}: #{e.message}"
      club_investment.update!(status: 'failed') if club_investment
    end

    def process_failed_investment(club_investment)
      Rails.logger.warn "Club investment failed: #{club_investment.id}"
      
      club_investment.update!(
        status: 'failed',
        transaction_reference: @data[:reference]
      )

      send_investment_failure_notification(club_investment)
    end

    def send_investment_execution_notification(club_investment)
      ClubMailer.investment_executed(club_investment).deliver_later
    rescue => e
      Rails.logger.error "Failed to send investment execution notification: #{e.message}"
    end

    def send_investment_failure_notification(club_investment)
      # Notify club admins of investment failure
      club_investment.investment_club.admin_members.each do |admin|
        ClubMailer.investment_failed(admin, club_investment).deliver_later
      end
    rescue => e
      Rails.logger.error "Failed to send investment failure notification: #{e.message}"
    end
  end
end