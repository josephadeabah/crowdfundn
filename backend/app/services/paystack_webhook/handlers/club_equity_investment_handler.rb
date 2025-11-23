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
      when 'pending', 'processing', 'ongoing'
        handle_pending_club_transaction(response, transaction_status)
      when 'failed'
        handle_failed_club_transaction(response)
      when 'abandoned'
        handle_abandoned_club_transaction(response)
      when 'reversed'
        handle_reversed_club_transaction(response)
      when 'queued'
        handle_queued_club_transaction(response)
      else
        handle_unknown_club_status(response, transaction_status)
      end
    end

    def handle_insufficient_balance(club_investment, equity_investment, total_deduction)
      # Mark both investments as failed due to insufficient balance
      club_investment.update!(
        status: ClubInvestment::STATUS_FAILED
      )
      
      equity_investment.update!(
        status: EquityInvestment::STATUS_FAILED,
        metadata: equity_investment.metadata.merge(
          'failure_reason' => 'insufficient_club_balance',
          'failure_time' => Time.current.iso8601
        )
      )
      
      # Send notification about insufficient balance
      send_insufficient_balance_notification(club_investment, total_deduction)
    end

    def send_insufficient_balance_notification(club_investment, total_deduction)
      club_investment.investment_club.admin_members.each do |admin|
        ClubEmailService.send_insufficient_balance_notification(
          admin: admin,
          club_investment: club_investment,
          required_amount: total_deduction,
          available_balance: club_investment.investment_club.current_balance
        )
      end
    rescue => e
      Rails.logger.error "Failed to send insufficient balance notification: #{e.message}"
    end

    def log_invalid_investment(metadata)
      Rails.logger.error "Equity investment not found or invalid state: #{metadata[:investment_id]}"
      raise 'Invalid investment state'
    end

    private

    def process_successful_club_transaction(response)
      metadata = parse_metadata(response)

      # For club investments, amount comes as a single amount (in kobo/centavo)
      # Convert from kobo/centavo to main currency unit
      total_amount = response.dig(:data, :amount).to_f / 100.0
      
      if total_amount <= 0
        Rails.logger.error "Invalid total amount: #{total_amount}"
        raise "Invalid total amount"
      end

      # Calculate processing fee (7% of total amount)
      processing_fee = total_amount * 0.07

      # Calculate platform fee (3% of total amount)  
      platform_fee = total_amount * 0.03

      # Gross amount is the total amount paid by the club
      gross_amount = total_amount

      # Net amount that goes to campaign (total amount minus platform fee)
      net_amount = total_amount - platform_fee

      # Find the club investment and equity investment
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      unless club_investment
        Rails.logger.error "Club investment not found: #{metadata[:club_investment_id]}"
        raise 'Club investment not found'
      end

      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      unless equity_investment
        Rails.logger.error "Equity investment not found: #{metadata[:investment_id]}"
        raise 'Equity investment not found'
      end

      if equity_investment && (equity_investment.pending? || equity_investment.initialized?)
        ActiveRecord::Base.transaction do
          # Update the equity investment with proper financial data
          update_equity_investment(equity_investment, response, metadata, gross_amount, net_amount, platform_fee, processing_fee)
          
          # Set as COMMITTED instead of SUCCESSFUL to allow cancellation
          equity_investment.update!(status: EquityInvestment::STATUS_COMMITTED)
          
          # Update the club investment status and link to equity investment
          club_investment.update!(
            status: ClubInvestment::STATUS_COMMITTED, # Set to COMMITTED, not SUCCESSFUL
            equity_investment_id: equity_investment.id,
            shares: equity_investment.shares,
            percentage: equity_investment.percentage,
            investment_date: equity_investment.investment_date,
            certificate_number: equity_investment.certificate_number,
            transaction_reference: equity_investment.transaction_reference,
            current_value: equity_investment.current_value,
            committed_at: Time.current,
            cancel_window_expires_at: 1.minute.from_now # 1-minute cancellation window for testing
          )

          # Create pledges from rewards if any
          create_pledges_from_rewards(equity_investment, metadata)
          
          if equity_limits_exceeded?(equity_investment)
            result = handle_oversubscription(equity_investment, response, metadata, total_amount)
            return result
          end

          # Deduct from club balance only after successful payment
          total_deduction = gross_amount # Total amount including fees
          if club_investment.investment_club.deduct_balance(total_deduction)
            Rails.logger.info "Successfully deducted #{total_deduction} from club #{club_investment.investment_club.id} balance"
          else
            Rails.logger.error "Failed to deduct #{total_deduction} from club #{club_investment.investment_club.id} balance"
            # Handle insufficient balance scenario
            handle_insufficient_balance(club_investment, equity_investment, total_deduction)
            return
          end

          # Generate certificate for club investment using the job
          ClubInvestmentCertificateJob.perform_later(club_investment.id)
          Rails.logger.info "Enqueued certificate generation job for club investment #{club_investment.id}"

          # Notify club members
          send_club_investment_confirmation(club_investment, equity_investment, metadata)
          
          Rails.logger.info "Successfully processed club investment: #{club_investment.id}"
          Rails.logger.info "Financial breakdown - Gross: #{gross_amount}, Platform Fee: #{platform_fee}, Processing Fee: #{processing_fee}, Net to Campaign: #{net_amount}"
        end
      elsif equity_investment && equity_investment.committed?
        # Handle case where investment is already committed (duplicate webhook)
        Rails.logger.info "Investment #{equity_investment.id} is already committed, skipping processing"
      else
        log_invalid_investment(metadata)
      end
    end

    def update_equity_investment(investment, response, metadata, gross_amount, net_amount, platform_fee, processing_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      update_attributes = {
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: platform_fee,
        processing_fee: processing_fee,
        subaccount_code: response.dig(:data, :subaccount, :subaccount_code),
        processed: false,
        country: final_country,
        ip_address: donor_ip,
        email: response.dig(:data, :customer, :email) || metadata[:investor_email],
        full_name: metadata[:investor_name],
        phone: metadata[:phone] || response.dig(:data, :customer, :phone),
        metadata: build_club_metadata(metadata, response, gross_amount, platform_fee, processing_fee),
        committed_at: Time.current,                 
        cancel_window_expires_at: 1.minute.from_now # 1-minute cancellation window for testing
      }

      investment.update!(update_attributes)
    end

    def build_club_metadata(metadata, response, gross_amount, platform_fee, processing_fee)
      {
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        investment_id: metadata[:investment_id],
        club_investment_id: metadata[:club_investment_id],
        club_id: metadata[:club_id],
        shares: metadata[:shares],
        percentage: metadata[:percentage],
        type: 'club_equity_investment',
        redirect_url: metadata[:redirect_url],
        title: metadata[:title],
        currency: metadata[:currency],
        currency_symbol: metadata[:currency_symbol],
        valuation: metadata[:valuation],
        equity_offered: metadata[:equity_offered],
        investor_name: metadata[:investor_name],
        investor_email: metadata[:investor_email],
        finalized: metadata[:finalized],
        cancellation_window_ended: metadata[:cancellation_window_ended],
        metadata: {
          club_investment: metadata.dig(:metadata, :club_investment),
          club_name: metadata.dig(:metadata, :club_name),
          club_slug: metadata.dig(:metadata, :club_slug),
          created_by: metadata.dig(:metadata, :created_by),
          investor_type: metadata.dig(:metadata, :investor_type)
        },
        financial_breakdown: {
          total_amount: gross_amount,
          platform_fee: platform_fee,
          processing_fee: processing_fee,
          net_to_campaign: gross_amount - platform_fee,
          paystack_fees: response.dig(:data, :fees).to_f / 100.0
        },
        referrer: metadata[:referrer],
        payment_details: {
          channel: response.dig(:data, :channel),
          card_type: response.dig(:data, :authorization, :card_type),
          bank: response.dig(:data, :authorization, :bank),
          country_code: response.dig(:data, :authorization, :country_code),
          brand: response.dig(:data, :authorization, :brand)
        },
        timestamps: {
          paid_at: response.dig(:data, :paid_at),
          created_at: response.dig(:data, :created_at)
        }
      }
    end

    def update_campaign_totals(investment, net_amount)
      campaign = investment.campaign
      campaign.update!(
        current_amount: campaign.current_amount + net_amount,
        total_successful_donations: campaign.total_successful_donations + net_amount,
        total_equity_invested: campaign.total_equity_invested + net_amount
      )

      campaign.update_transferred_amount(net_amount)
    end

    def create_pledges_from_rewards(investment, metadata)
      selected_rewards = (metadata[:metadata] && metadata[:metadata][:selectedRewards]) || []
      shipping_data = (metadata[:metadata] && metadata[:metadata][:shippingData]) || {}
      delivery_option = (metadata[:metadata] && metadata[:metadata][:deliveryOption]) || 'pickup'

      selected_rewards.each do |reward|
        next if Pledge.exists?(equity_investment_id: investment.id, reward_id: reward[:id])

        Pledge.create!(
          equity_investment_id: investment.id,
          reward_id: reward[:id],
          amount: reward[:amount],
          shipping_data: shipping_data,
          selected_rewards: [reward],
          delivery_option: delivery_option,
          status: 'pending',
          shipping_status: 'not_shipped',
          campaign_id: investment.campaign.id,
          user_id: investment.campaign.fundraiser_id,
          campaign_type: 'EquityCampaign'
        )
      end
    end

    def equity_limits_exceeded?(investment)
      campaign = investment.campaign
      new_total_percentage = campaign.equity_investments.successful.sum(:percentage) + investment.percentage
      new_total_percentage > (campaign.equity_offered.to_f + 0.01)
    end

    def handle_oversubscription(investment, response, metadata, total_amount)
      Rails.logger.warn "Oversubscription detected for club investment #{investment.id}"

      investment.update!(
        status: EquityInvestment::STATUS_FAILED,
        metadata: investment.metadata.merge(
          'failure_reason' => 'oversubscription',
          'failure_time' => Time.current.iso8601,
          'refund_required' => true,
          'oversubscription_details' => {
            'requested_percentage' => investment.percentage,
            'available_percentage' => investment.campaign.percentage_available,
            'total_equity_offered' => investment.campaign.equity_offered
          }
        )
      )

      # Process the refund - refund the full amount since it's oversubscription
      PaystackWebhook::Handlers::RefundProcessedHandler.new(
        investment: investment,
        response: response
      ).call

      send_oversubscription_notification(investment, metadata)
      
      # Rollback campaign updates with the net amount that would have been added
      platform_fee = total_amount * 0.03
      net_amount = total_amount - platform_fee
      rollback_campaign_updates(investment, net_amount)

      Rails.logger.info "Oversubscription handled successfully for club investment #{investment.id}"
      :oversubscription_handled
    end

    def rollback_campaign_updates(investment, amount)
      campaign = investment.campaign
      campaign.with_lock do
        campaign.update!(
          current_amount: campaign.current_amount - amount,
          total_successful_donations: campaign.total_successful_donations - amount,
          total_equity_invested: campaign.total_equity_invested - amount
        )
      end
    end

    # Status handling methods similar to EquityInvestmentHandler
    def handle_pending_club_transaction(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.info "Club transaction #{transaction_reference} is #{status} - scheduling status check"
      
      if equity_investment
        equity_investment.update!(
          status: EquityInvestment::STATUS_PENDING,
          metadata: equity_investment.metadata.merge(
            'last_status_check' => Time.current.iso8601,
            'transaction_status' => status,
            'pending_reference' => transaction_reference,
            'status_attempts' => (equity_investment.metadata&.[]('status_attempts') || 0) + 1,
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      # Schedule a check with exponential backoff
      attempt_count = equity_investment&.metadata&.[]('status_attempts') || 1
      check_time = calculate_next_check_time(attempt_count, status)
      
      TransactionStatusCheckJob.set(wait_until: check_time).perform_later(
        transaction_reference,
        equity_investment&.id
      )
    end

    def handle_failed_club_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.warn "Club transaction #{transaction_reference} failed"
      
      if equity_investment
        failure_reason = response.dig(:data, :gateway_response) || 'payment_failed'
        
        equity_investment.update!(
          status: EquityInvestment::STATUS_FAILED,
          metadata: equity_investment.metadata.merge(
            'failure_reason' => failure_reason,
            'failure_time' => Time.current.iso8601,
            'failure_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'failed'
          )
        )
      end
      
      if club_investment
        # Refund the club balance
        club_investment.investment_club.refund_balance(club_investment.investment_amount)
        
        club_investment.update!(
          status: ClubInvestment::STATUS_FAILED
        )
        
        send_club_investment_failure_notification(club_investment, response, metadata)
      end
    end

    def handle_abandoned_club_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.warn "Club transaction #{transaction_reference} abandoned"
      
      if equity_investment
        equity_investment.update!(
          status: EquityInvestment::STATUS_ABANDONED,
          metadata: equity_investment.metadata.merge(
            'abandoned_time' => Time.current.iso8601,
            'abandoned_reason' => 'customer_did_not_complete',
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'abandoned'
          )
        )
      end
    end

    def handle_reversed_club_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      club_investment = ClubInvestment.find_by(id: metadata[:club_investment_id])
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.warn "Club transaction #{transaction_reference} reversed"
      
      if equity_investment
        reversal_reason = response.dig(:data, :gateway_response) || 'transaction_reversed'
        
        equity_investment.update!(
          status: EquityInvestment::STATUS_REFUNDED,
          metadata: equity_investment.metadata.merge(
            'reversal_time' => Time.current.iso8601,
            'reversal_reason' => reversal_reason,
            'reversal_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'reversed'
          )
        )
        
        # If this was a successful investment that got reversed, we need to adjust campaign totals
        if equity_investment.successful?
          rollback_campaign_updates(equity_investment, equity_investment.net_amount)
        end
      end
      
      if club_investment
        # Refund the club balance for reversed transactions
        club_investment.investment_club.refund_balance(club_investment.investment_amount)
      end
    end

    def handle_queued_club_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.info "Club transaction #{transaction_reference} queued"
      
      if equity_investment
        equity_investment.update!(
          status: EquityInvestment::STATUS_PENDING,
          metadata: equity_investment.metadata.merge(
            'queued_time' => Time.current.iso8601,
            'transaction_status' => 'queued',
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      # Schedule a check for queued transactions (longer interval)
      TransactionStatusCheckJob.set(wait: 2.hours).perform_later(
        transaction_reference,
        equity_investment&.id
      )
    end

    def handle_unknown_club_status(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      equity_investment = EquityInvestment.find_by(id: metadata[:investment_id])
      
      Rails.logger.error "Unknown club transaction status '#{status}' for reference #{transaction_reference}"
      
      if equity_investment
        equity_investment.update!(
          status: EquityInvestment::STATUS_FAILED,
          metadata: equity_investment.metadata.merge(
            'failure_reason' => 'unknown_status',
            'failure_time' => Time.current.iso8601,
            'unknown_status' => status,
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      # For unknown statuses, schedule a check to be safe
      TransactionStatusCheckJob.set(wait: 30.minutes).perform_later(
        transaction_reference,
        equity_investment&.id
      )
    end

    def calculate_next_check_time(attempt_count, status)
      # Different backoff strategies based on status
      case status
      when 'ongoing' # Customer is actively trying (OTP, etc.) - check more frequently
        intervals = [2, 5, 10, 15, 30, 60] # minutes
      when 'processing' # Direct debit - moderate checking
        intervals = [5, 15, 30, 60, 120, 240] # minutes
      else # 'pending' - standard checking
        intervals = [5, 15, 30, 60, 120, 240, 480, 720, 1440] # minutes
      end
      
      interval_index = [attempt_count - 1, intervals.size - 1].min
      interval_minutes = intervals[interval_index]
      
      interval_minutes.minutes.from_now
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

    def send_club_investment_confirmation(club_investment, equity_investment, metadata)
      # Notify all club members about successful investment
      club_investment.investment_club.active_members.each do |member|
        ClubEmailService.send_investment_confirmation(
          user: member,
          club_investment: club_investment,
          equity_investment: equity_investment
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

    def send_oversubscription_notification(investment, metadata)
      # This would notify the club about oversubscription
      club_investment = ClubInvestment.find_by(equity_investment_id: investment.id)
      return unless club_investment

      club_investment.investment_club.admin_members.each do |admin|
        ClubEmailService.send_oversubscription_notification(
          admin: admin,
          club_investment: club_investment,
          investment: investment,
          metadata: metadata
        )
      end
    rescue => e
      Rails.logger.error "Failed to send oversubscription notification: #{e.message}"
    end
  end
end