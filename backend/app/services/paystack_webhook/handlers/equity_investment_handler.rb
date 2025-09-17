# app/services/paystack_webhook/handlers/equity_investment_handler.rb
module PaystackWebhook::Handlers
  class EquityInvestmentHandler
    include PaystackWebhook::JsonHelper

    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      Rails.logger.info "Verifying equity investment with reference #{transaction_reference}"

      response = PaystackService.new.verify_transaction(transaction_reference)
      unless response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      transaction_status = response.dig(:data, :status)
      
      case transaction_status
      when 'success'
        process_successful_transaction(response)
      when 'pending', 'processing', 'ongoing'
        handle_pending_transaction(response, transaction_status)
      when 'failed'
        handle_failed_transaction(response)
      when 'abandoned'
        handle_abandoned_transaction(response)
      when 'reversed'
        handle_reversed_transaction(response)
      when 'queued'
        handle_queued_transaction(response)
      else
        handle_unknown_status(response, transaction_status)
      end
    end

    private

    def process_successful_transaction(response)
      metadata = parse_metadata(response)

      # Fetch the nested metadata amounts
      original_amount = metadata.dig(:metadata, :originalAmount).to_f
      processing_fee  = metadata.dig(:metadata, :processingFee).to_f

      if original_amount <= 0
        Rails.logger.error "Invalid original amount from metadata: #{original_amount}"
        raise "Invalid original amount"
      end

      # Use originalAmount as gross amount
      gross_amount = original_amount

      # Deduct 3% platform fee (campaign pays this)
      base_platform_fee = gross_amount * 0.03

      # Add the processing fee (platform keeps it too)
      platform_fee = base_platform_fee + processing_fee

      # Net amount that goes to campaign (ignores processing fee completely)
      net_amount = gross_amount - base_platform_fee

      investment = find_investment(metadata)

      if investment && (investment.pending? || investment.initialized?)
        ActiveRecord::Base.transaction do
          update_investment(investment, response, metadata, gross_amount, net_amount, platform_fee, processing_fee)
          update_campaign(investment, net_amount)  # ✅ only net, no processing_fee
          create_pledges_from_rewards(investment, metadata)

          if equity_limits_exceeded?(investment)
            result = handle_oversubscription(investment, response, metadata)
            return result
          end

          investment.update!(status: EquityInvestment::STATUS_SUCCESSFUL)
          send_confirmation_email(investment, response, metadata)
        end
      else
        log_invalid_investment(metadata)
      end
    end

    def handle_pending_transaction(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.info "Transaction #{transaction_reference} for investment #{investment&.id} is #{status} - scheduling status check"
      
      if investment
        # Update investment status to reflect pending state
        investment.update!(
          status: EquityInvestment::STATUS_PENDING,
          metadata: investment.metadata.merge(
            'last_status_check' => Time.current.iso8601,
            'transaction_status' => status,
            'pending_reference' => transaction_reference,
            'status_attempts' => (investment.metadata&.[]('status_attempts') || 0) + 1,
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      # Schedule a check with exponential backoff
      attempt_count = investment&.metadata&.[]('status_attempts') || 1
      check_time = calculate_next_check_time(attempt_count, status)
      
      TransactionStatusCheckJob.set(wait_until: check_time).perform_later(
        transaction_reference,
        investment&.id
      )
      
      Rails.logger.info "Scheduled status check for #{transaction_reference} at #{check_time} (attempt ##{attempt_count}, status: #{status})"
    end

    def handle_failed_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} failed for investment #{investment&.id}"
      
      if investment
        failure_reason = response.dig(:data, :gateway_response) || 'payment_failed'
        
        investment.update!(
          status: EquityInvestment::STATUS_FAILED,
          metadata: investment.metadata.merge(
            'failure_reason' => failure_reason,
            'failure_time' => Time.current.iso8601,
            'failure_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'failed'
          )
        )
        
        send_failure_notification(investment, response, metadata)
      end
      
      Rails.logger.error "Transaction failed with reference #{transaction_reference}: #{response.dig(:data, :message)}"
    end

    def handle_abandoned_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} abandoned for investment #{investment&.id}"
      
      if investment
        investment.update!(
          status: EquityInvestment::STATUS_ABANDONED,
          metadata: investment.metadata.merge(
            'abandoned_time' => Time.current.iso8601,
            'abandoned_reason' => 'customer_did_not_complete',
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'abandoned'
          )
        )
        
        send_abandonment_notification(investment, response, metadata)
      end
    end

    def handle_reversed_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} reversed for investment #{investment&.id}"
      
      if investment
        reversal_reason = response.dig(:data, :gateway_response) || 'transaction_reversed'
        
        investment.update!(
          status: EquityInvestment::STATUS_REFUNDED,
          metadata: investment.metadata.merge(
            'reversal_time' => Time.current.iso8601,
            'reversal_reason' => reversal_reason,
            'reversal_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'reversed'
          )
        )
        
        # If this was a successful investment that got reversed, we need to adjust campaign totals
        if investment.successful?
          rollback_campaign_updates(investment, investment.net_amount)
        end
        
        send_reversal_notification(investment, response, metadata)
      end
    end

    def handle_queued_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.info "Transaction #{transaction_reference} queued for investment #{investment&.id}"
      
      if investment
        investment.update!(
          status: EquityInvestment::STATUS_PENDING,
          metadata: investment.metadata.merge(
            'queued_time' => Time.current.iso8601,
            'transaction_status' => 'queued',
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      # Schedule a check for queued transactions (longer interval)
      TransactionStatusCheckJob.set(wait: 2.hours).perform_later(
        transaction_reference,
        investment&.id
      )
    end

    def handle_unknown_status(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      investment = find_investment(metadata)
      
      Rails.logger.error "Unknown transaction status '#{status}' for reference #{transaction_reference}"
      
      if investment
        investment.update!(
          status: EquityInvestment::STATUS_FAILED,
          metadata: investment.metadata.merge(
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
        investment&.id
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

    def send_failure_notification(investment, response, metadata)
      recipient_email = investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'
      failure_reason = response.dig(:data, :gateway_response) || 'Payment failed'

      begin
        InvestmentFailureEmailService.send_failure_email(
          investment: investment,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          failure_reason: failure_reason,
          metadata: metadata
        )
      rescue => e
        Rails.logger.error "Failed to send failure notification: #{e.message}"
      end
    end

    def send_abandonment_notification(investment, response, metadata)
      recipient_email = investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'

      begin
        InvestmentAbandonmentEmailService.send_abandonment_email(
          investment: investment,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          attempt_count: investment.metadata&.[]('status_attempts') || 1,
          gateway_response: response.dig(:data, :gateway_response)
        )
      rescue => e
        Rails.logger.error "Failed to send abandonment notification: #{e.message}"
      end
    end

    def send_reversal_notification(investment, response, metadata)
      recipient_email = investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'
      reversal_reason = response.dig(:data, :gateway_response) || 'Transaction reversed'

      begin
        InvestmentReversalEmailService.send_reversal_email(
          investment: investment,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          reversal_reason: reversal_reason,
          metadata: metadata
        )
      rescue => e
        Rails.logger.error "Failed to send reversal notification: #{e.message}"
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

    def find_investment(metadata)
      EquityInvestment.find_by(id: metadata[:investment_id])
    end

    def equity_limits_exceeded?(investment)
      campaign = investment.campaign
      new_total_percentage = campaign.equity_investments.successful.sum(:percentage) + investment.percentage
      new_total_percentage > (campaign.equity_offered.to_f + 0.01)
    end

    def handle_oversubscription(investment, response, metadata)
      Rails.logger.warn "Oversubscription detected for investment #{investment.id}"

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

      # Process the refund
      PaystackWebhook::Handlers::RefundProcessedHandler.new(
        investment: investment,
        response: response
      ).call

      send_oversubscription_notification(investment, metadata)
      rollback_campaign_updates(investment, (response.dig(:data, :amount).to_f / 100.0) * 0.93)

      # DON'T raise an exception - this is a successfully handled business case
      Rails.logger.info "Oversubscription handled successfully for investment #{investment.id}"
      
      # Return a status indicator instead
      :oversubscription_handled
    end

    def rollback_campaign_updates(investment)
      campaign = investment.campaign

      campaign.with_lock do
        campaign.update!(
          current_amount: campaign.current_amount - investment.net_amount,
          total_successful_donations: campaign.total_successful_donations - investment.net_amount,
          total_equity_invested: campaign.total_equity_invested - investment.net_amount
        )
      end
    end


    def update_investment(investment, response, metadata, gross_amount, net_amount, platform_fee, processing_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      update_attributes = {
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: platform_fee,
        processing_fee: processing_fee,   # ✅ new column saved here
        subaccount_code: response.dig(:data, :subaccount, :subaccount_code),
        processed: false,
        country: final_country,
        ip_address: donor_ip,
        email: response.dig(:data, :customer, :email) || metadata[:investor_email],
        full_name: metadata[:investor_name],
        phone: metadata[:phone] || response.dig(:data, :customer, :phone),
        metadata: build_metadata(metadata, response)
      }

      investment.update!(update_attributes)
      begin
        InvestmentCertificateJob.perform_later(investment.id) if investment.successful?
      rescue => e
        Rails.logger.info "Failed to enqueue certificate job: #{e.message}"
      end
    end

    def build_metadata(metadata, response)
      {
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        investment_id: metadata[:investment_id],
        shares: metadata[:shares],
        percentage: metadata[:percentage],
        type: 'equity_investment',
        redirect_url: metadata[:redirect_url],
        title: metadata[:title],
        currency: metadata[:currency],
        currency_symbol: metadata[:currency_symbol],
        valuation: metadata[:valuation],
        equity_offered: metadata[:equity_offered],
        investor_name: metadata[:investor_name],
        investor_email: metadata[:investor_email],
        phone: metadata[:phone],
        investor_signature_data: metadata[:investor_signature_data],
        reward: metadata[:reward],
        processing_fee: metadata.dig(:metadata, :processingFee),   # ✅ saved for reference
        original_amount: metadata.dig(:metadata, :originalAmount),
        referrer: metadata[:referrer],
        payment_details: {
          channel: response.dig(:data, :channel),
          card_type: response.dig(:data, :authorization, :card_type),
          bank: response.dig(:data, :authorization, :bank),
          country_code: response.dig(:data, :authorization, :country_code),
          brand: response.dig(:data, :authorization, :brand)
        },
        subaccount_contact: {
          name: response.dig(:data, :subaccount, :primary_contact_name),
          email: response.dig(:data, :subaccount, :primary_contact_email),
          phone: response.dig(:data, :subaccount, :primary_contact_phone)
        },
        fees: {
          paystack: response.dig(:data, :fees_split, :paystack),
          integration: response.dig(:data, :fees_split, :integration),
          subaccount: response.dig(:data, :fees_split, :subaccount),
          params: response.dig(:data, :fees_split, :params)
        },
        timestamps: {
          paid_at: response.dig(:data, :paid_at),
          created_at: response.dig(:data, :created_at)
        }
      }
    end

    def update_campaign(investment, net_amount)
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

    def send_confirmation_email(investment, response, metadata)
      recipient_email = response.dig(:data, :customer, :email) || investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'

      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        metadata: metadata
      )
    rescue => e
      Rails.logger.error "Failed to send confirmation email: #{e.message}"
    end

    def send_oversubscription_notification(investment, metadata)
      recipient_email = investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'

      InvestmentOversubscriptionEmailService.send_oversubscription_email(
        investment: investment,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        metadata: metadata
      )
    rescue => e
      Rails.logger.error "Failed to send oversubscription notification: #{e.message}"
    end

    def log_invalid_investment(metadata)
      Rails.logger.error "Equity investment not found or invalid state: #{metadata[:investment_id]}"
      raise 'Invalid investment state'
    end
  end
end