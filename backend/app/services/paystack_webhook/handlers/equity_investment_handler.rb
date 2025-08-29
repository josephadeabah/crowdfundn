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
          create_pledges_for_rewards(investment, metadata) # Updated this line
          
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

    def update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      update_attributes = {
        status: EquityInvestment::STATUS_SUCCESSFUL,
        transaction_reference: response[:data][:reference],
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
        shipping_data: metadata.dig(:metadata, :shippingData), # Add shipping data
        selected_rewards: metadata.dig(:metadata, :selectedRewards), # Add selected rewards
        delivery_option: metadata.dig(:metadata, :deliveryOption), # Add delivery option
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
        total_successful_donations: campaign.current_amount + net_amount,
      )

      campaign.update_transferred_amount(net_amount)
    end

    # Update the create_pledges_for_rewards method in EquityInvestmentHandler
    def create_pledges_for_rewards(investment, metadata)
      # Get selected rewards from metadata
      selected_rewards = metadata.dig(:metadata, :selectedRewards) || []
      
      return if selected_rewards.empty?

      selected_rewards.each do |reward_data|
        reward = Reward.find_by(id: reward_data[:id])
        
        if reward
          Pledge.create!(
            equity_investment_id: investment.id,
            reward_id: reward.id,
            amount: reward_data[:amount].to_f,
            status: 'pending',
            shipping_status: 'not_shipped',
            campaign_id: investment.campaign.id,
            user_id: investment.user_id || investment.campaign.fundraiser_id,
            campaign_type: 'EquityCampaign',
            shipping_data: extract_shipping_data(metadata), # Use shipping_data instead of shipping_details
            selected_rewards: [reward_data], # Use selected_rewards array
            delivery_option: metadata.dig(:metadata, :deliveryOption),
            metadata: {
              reward_title: reward_data[:title],
              reward_description: reward_data[:description],
              reward_image: reward_data[:image],
              entity_type: metadata.dig(:metadata, :shippingData, :entityType)
            }
          )
        else
          Rails.logger.warn "Reward not found with ID: #{reward_data[:id]} for investment #{investment.id}"
        end
      end
    end

    def extract_shipping_details(metadata)
      shipping_data = metadata.dig(:metadata, :shippingData) || {}
      {
        first_name: shipping_data[:firstName],
        last_name: shipping_data[:lastName],
        shipping_address: shipping_data[:shippingAddress],
        entity_type: shipping_data[:entityType]
      }
    end

    def send_confirmation_email(investment, response, metadata)
      recipient_email = response.dig(:data, :customer, :email) || investment.email
      recipient_name = investment.user&.full_name || investment.full_name || metadata[:investor_name] || 'Investor'
      
      signature_info = {
        investor_signature_url: investment.user&.latest_kyc&.signature_image_url,
        issuer_signature_url: investment.campaign.fundraiser&.latest_kyc&.signature_image_url
      }
      
      InvestmentConfirmationEmailService.send_confirmation_email(
        investment: investment,
        recipient_email: recipient_email,
        recipient_name: recipient_name,
        metadata: metadata.merge(signature_info)
      )
    rescue => e
      Rails.logger.error "Failed to send confirmation email: #{e.message}"
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