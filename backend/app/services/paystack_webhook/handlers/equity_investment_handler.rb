module PaystackWebhook::Handlers
  class EquityInvestmentHandler
    include PaystackWebhook::JsonHelper
    
    def initialize(data)
      @data = data
    end

    def call
      verify_transaction or return
      process_successful_transaction
    end

    private

    def verify_transaction
      @response = PaystackService.new.verify_transaction(@data[:reference])
      return true if @response[:status] == true

      Rails.logger.error "Transaction verification failed for #{@data[:reference]}"
      raise 'Transaction verification failed'
    end

    def process_successful_transaction
      transaction_status = @response.dig(:data, :status)
      if transaction_status == 'success'
        update_investment
      else
        raise "Transaction status is #{transaction_status}"
      end
    end

    def update_investment
      investment = find_investment
      return unless valid_investment?(investment)

      ActiveRecord::Base.transaction do
        update_investment_attributes(investment)
        update_campaign(investment)
        handle_certificate_generation(investment)
      end
    end

    def find_investment
      Donation.investments.find_by(id: metadata[:investment_id])
    end

    def valid_investment?(investment)
      return true if investment && %w[pending initialized].include?(investment.status)

      Rails.logger.error "Invalid investment state for #{metadata[:investment_id]}"
      raise 'Invalid investment state'
    end

    def metadata
      @metadata ||= parse_metadata(@response)
    end

    def parse_metadata(response)
      if response.dig(:data, :metadata).is_a?(String)
        JSON.parse(fix_malformed_json(response.dig(:data, :metadata)), symbolize_names: true)
      else
        response.dig(:data, :metadata) || {}
      end
    rescue JSON::ParserError => e
      Rails.logger.error "Failed to parse metadata: #{e.message}"
      {}
    end

    def gross_amount
      @response.dig(:data, :amount).to_f / 100.0
    end

    def net_amount
      gross_amount * 0.93
    end

    def adjusted_platform_fee
      (gross_amount * 0.07) - (gross_amount * 0.07 * 0.0195)
    end

    def update_investment_attributes(investment)
      investment.update!(
        type: 'EquityInvestment',
        status: 'successful',
        transaction_reference: @data[:reference],
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        subaccount_code: @response.dig(:data, :subaccount, :subaccount_code),
        processed: false,
        country: donor_country,
        ip_address: @response.dig(:data, :ip_address),
        metadata: build_metadata(investment)
      )
    end

    def donor_country
      (@response.dig(:data, :authorization, :country_code) || 
      Geocoder.search(@response.dig(:data, :ip_address)).first&.country || 
      'Unknown')
    end

    def build_metadata(investment)
      {
        user_id: investment.user_id,
        campaign_id: investment.campaign_id,
        shares: investment.shares,
        percentage: investment.percentage,
        type: 'equity_investment',
        subaccount_contact: {
          name: @response.dig(:data, :subaccount, :primary_contact_name),
          email: @response.dig(:data, :subaccount, :primary_contact_email),
          phone: @response.dig(:data, :subaccount, :primary_contact_phone)
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

    def handle_certificate_generation(investment)
      if InvestmentCertificateService.generate_certificate(investment)
        send_confirmation_email(investment)
      else
        retry_certificate_generation(investment.id)
      end
    end

    def send_confirmation_email(investment)
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        certificate_url: investment.certificate_url,
        recipient_email: @response.dig(:data, :customer, :email),
        recipient_name: investment.user&.full_name || 'Investor'
      )
    rescue => e
      Rails.logger.error "Failed to send confirmation email: #{e.message}"
    end

    def retry_certificate_generation(investment_id)
      Rails.logger.error "Certificate generation failed for investment #{investment_id}"
      CertificateGenerationJob.set(wait: 5.minutes).perform_later(investment_id)
    end
  end
end