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
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      investment = find_investment(metadata)

      if investment && (investment.pending? || investment.initialized?)
        update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
        update_campaign(investment)
        create_pledge_if_needed(investment)
        handle_certificate_generation(investment, response)
        InvestmentUpdateJob.perform_later(investment.id)
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

    def update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      investment.update!(
        status: EquityInvestment::STATUS_SUCCESSFUL,
        transaction_reference: response[:data][:reference],
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        subaccount_code: response.dig(:data, :subaccount, :subaccount_code),
        processed: false,
        country: final_country,
        ip_address: donor_ip,
        metadata: build_metadata(metadata, response)
      )
    end

    def build_metadata(metadata, response)
      {
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        shares: metadata[:shares],
        percentage: metadata[:percentage],
        type: 'equity_investment',
        subaccount_contact: {
          name: response.dig(:data, :subaccount, :primary_contact_name),
          email: response.dig(:data, :subaccount, :primary_contact_email),
          phone: response.dig(:data, :subaccount, :primary_contact_phone)
        }
      }
    end

    def update_campaign(investment)
      campaign = investment.campaign
      campaign.update!(
        total_equity_invested: campaign.total_equity_invested + investment.net_amount,
        shares_issued: campaign.shares_issued + investment.shares
      )
    end

    def create_pledge_if_needed(investment)
      if investment.reward
        Pledge.create!(
          equity_investment_id: investment.id,
          reward_id: investment.reward.id,
          amount: investment.amount,
          status: 'pending',
          shipping_status: 'not_shipped',
          campaign_id: investment.campaign.id,
          user_id: investment.campaign.fundraiser_id
        )
      end
    end

    def handle_certificate_generation(investment, response)
      if InvestmentCertificateService.generate_certificate(investment)
        investment.reload
        if investment.certificate_present?
          send_confirmation_email(investment, response)
        else
          retry_certificate_generation(investment.id)
        end
      else
        retry_certificate_generation(investment.id)
      end
    end

    def send_confirmation_email(investment, response)
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        certificate_url: investment.certificate_url,
        recipient_email: response.dig(:data, :customer, :email),
        recipient_name: investment.user&.full_name || 'Investor'
      )
    rescue => e
      Rails.logger.error "Failed to send confirmation email: #{e.message}"
    end

    def retry_certificate_generation(investment_id)
      Rails.logger.error "Certificate generation failed for investment #{investment_id}"
      CertificateGenerationJob.set(wait: 5.minutes).perform_later(investment_id)
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