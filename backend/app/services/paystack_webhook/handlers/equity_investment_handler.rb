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
      if transaction_status == 'success'
        process_successful_transaction(response)
      else
        handle_failed_transaction(transaction_status)
      end
    end

    private

    def process_successful_transaction(response)
      gross_amount = response.dig(:data, :amount).to_f / 100.0
      net_amount = gross_amount * 0.93 # 7% platform fee
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195 # Paystack's 1.95% fee
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      investment = find_investment(metadata)

      if investment && (investment.pending? || investment.initialized?)
        ActiveRecord::Base.transaction do
          update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
          update_campaign(investment, net_amount)
          create_pledges_from_rewards(investment, metadata)

          # CRITICAL: Check equity limits before marking as successful
          if equity_limits_exceeded?(investment)
            handle_oversubscription(investment, response, metadata)
            return # Exit early since investment failed
          end

          investment.update!(status: EquityInvestment::STATUS_SUCCESSFUL)
          send_confirmation_email(investment, response, metadata)
        end
      else
        log_invalid_investment(metadata)
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

      # Delegate refund processing to RefundProcessedHandler
      PaystackWebhook::Handlers::RefundProcessedHandler.new(
        investment: investment,
        response: response
      ).call

      send_oversubscription_notification(investment, metadata)

      rollback_campaign_updates(investment, response.dig(:data, :amount).to_f / 100.0 * 0.93)

      raise "Investment #{investment.id} failed due to oversubscription"
    end

    def rollback_campaign_updates(investment, net_amount)
      campaign = investment.campaign
      campaign.update!(
        current_amount: campaign.current_amount - net_amount,
        total_successful_donations: campaign.total_successful_donations - net_amount,
        total_equity_invested: campaign.total_equity_invested - net_amount
      )
    end

    def update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      update_attributes = {
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
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
        processing_fee: metadata.dig(:metadata, :processingFee),
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

    def handle_failed_transaction(status)
      Rails.logger.error "Transaction failed with status #{status}"
      raise "Transaction status is #{status}"
    end
  end
end
