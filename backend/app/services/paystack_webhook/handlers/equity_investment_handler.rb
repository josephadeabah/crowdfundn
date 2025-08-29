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
      unless response && response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      # Use safe access instead of dig
      transaction_status = response[:data] && response[:data][:status]
      if transaction_status == 'success'
        process_successful_transaction(response)
      else
        handle_failed_transaction(transaction_status)
      end
    end

    private

    def process_successful_transaction(response)
      # Use safe access instead of dig
      amount_data = response[:data] && response[:data][:amount]
      gross_amount = amount_data.to_f / 100.0
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      investment = find_investment(metadata)

      if investment && (investment.pending? || investment.initialized?)
        ActiveRecord::Base.transaction do
          update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
          update_campaign(investment, net_amount)
          create_pledges_for_rewards(investment, metadata)
          
          investment.update!(status: EquityInvestment::STATUS_SUCCESSFUL)
          
          send_confirmation_email(investment, response, metadata)
        end
      else
        log_invalid_investment(metadata)
      end
    end

    def parse_metadata(response)
      data = response[:data] || {}
      metadata = data[:metadata]
      
      if metadata.is_a?(String)
        begin
          fixed_metadata = fix_malformed_json(metadata)
          JSON.parse(fixed_metadata, symbolize_names: true)
        rescue JSON::ParserError => e
          Rails.logger.error "Failed to parse metadata: #{e.message}"
          raise "Invalid metadata: #{metadata}"
        end
      else
        metadata || {}
      end
    end

    def find_investment(metadata)
      investment_id = metadata[:investment_id] || metadata['investment_id']
      EquityInvestment.find_by(id: investment_id)
    end

    def update_investment(investment, response, metadata, gross_amount, net_amount, adjusted_platform_fee)
      data = response[:data] || {}
      authorization = data[:authorization] || {}
      customer = data[:customer] || {}
      subaccount = data[:subaccount] || {}
      
      donor_ip = data[:ip_address]
      donor_country = authorization[:country_code]
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      update_attributes = {
        status: EquityInvestment::STATUS_SUCCESSFUL,
        transaction_reference: data[:reference],
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        subaccount_code: subaccount[:subaccount_code],
        processed: false,
        country: final_country,
        ip_address: donor_ip,
        email: customer[:email] || metadata[:investor_email] || metadata['investor_email'],
        full_name: metadata[:investor_name] || metadata['investor_name'],
        phone: metadata[:phone] || metadata['phone'] || customer[:phone],
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
      data = response[:data] || {}
      authorization = data[:authorization] || {}
      subaccount = data[:subaccount] || {}
      fees_split = data[:fees_split] || {}
      
      # Get nested metadata safely
      nested_metadata = metadata[:metadata] || metadata['metadata'] || {}
      
      {
        user_id: metadata[:user_id] || metadata['user_id'],
        campaign_id: metadata[:campaign_id] || metadata['campaign_id'],
        investment_id: metadata[:investment_id] || metadata['investment_id'],
        shares: metadata[:shares] || metadata['shares'],
        percentage: metadata[:percentage] || metadata['percentage'],
        type: 'equity_investment',
        redirect_url: metadata[:redirect_url] || metadata['redirect_url'],
        title: metadata[:title] || metadata['title'],
        currency: metadata[:currency] || metadata['currency'],
        currency_symbol: metadata[:currency_symbol] || metadata['currency_symbol'],
        valuation: metadata[:valuation] || metadata['valuation'],
        equity_offered: metadata[:equity_offered] || metadata['equity_offered'],
        investor_name: metadata[:investor_name] || metadata['investor_name'],
        investor_email: metadata[:investor_email] || metadata['investor_email'],
        phone: metadata[:phone] || metadata['phone'],
        investor_signature_data: metadata[:investor_signature_data] || metadata['investor_signature_data'],
        reward: metadata[:reward] || metadata['reward'],
        processing_fee: nested_metadata[:processingFee] || nested_metadata['processingFee'],
        original_amount: nested_metadata[:originalAmount] || nested_metadata['originalAmount'],
        referrer: metadata[:referrer] || metadata['referrer'],
        shipping_data: nested_metadata[:shippingData] || nested_metadata['shippingData'],
        selected_rewards: nested_metadata[:selectedRewards] || nested_metadata['selectedRewards'],
        delivery_option: nested_metadata[:deliveryOption] || nested_metadata['deliveryOption'],
        payment_details: {
          channel: data[:channel],
          card_type: authorization[:card_type],
          bank: authorization[:bank],
          country_code: authorization[:country_code],
          brand: authorization[:brand]
        },
        subaccount_contact: {
          name: subaccount[:primary_contact_name],
          email: subaccount[:primary_contact_email],
          phone: subaccount[:primary_contact_phone]
        },
        fees: {
          paystack: fees_split[:paystack],
          integration: fees_split[:integration],
          subaccount: fees_split[:subaccount],
          params: fees_split[:params]
        },
        timestamps: {
          paid_at: data[:paid_at],
          created_at: data[:created_at]
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

    def create_pledges_for_rewards(investment, metadata)
      # Get nested metadata safely
      nested_metadata = metadata[:metadata] || metadata['metadata'] || {}
      
      # Get selected rewards safely
      selected_rewards = nested_metadata[:selectedRewards] || nested_metadata['selectedRewards'] || []
      
      return if selected_rewards.empty?

      selected_rewards.each do |reward_data|
        # Handle both symbol and string keys in reward data
        reward_data = reward_data.symbolize_keys if reward_data.is_a?(Hash)
        reward_id = reward_data[:id] || reward_data['id']
        
        if reward_id.blank?
          Rails.logger.warn "Reward data missing ID: #{reward_data.inspect}"
          next
        end

        reward = Reward.find_by(id: reward_id)
        
        if reward
          amount = (reward_data[:amount] || reward_data['amount']).to_f rescue 0.0
          
          Pledge.create!(
            equity_investment_id: investment.id,
            reward_id: reward.id,
            amount: amount,
            status: 'pending',
            shipping_status: 'not_shipped',
            campaign_id: investment.campaign.id,
            user_id: investment.user_id || investment.campaign.fundraiser_id,
            campaign_type: 'EquityCampaign',
            shipping_data: extract_shipping_details(nested_metadata),
            selected_rewards: [reward_data],
            delivery_option: nested_metadata[:deliveryOption] || nested_metadata['deliveryOption']
          )
        else
          Rails.logger.warn "Reward not found with ID: #{reward_id} for investment #{investment.id}"
        end
      end
    end

    def extract_shipping_details(nested_metadata)
      shipping_data = nested_metadata[:shippingData] || nested_metadata['shippingData'] || {}
      
      # Handle both symbol and string keys in shipping data
      shipping_data = shipping_data.symbolize_keys if shipping_data.is_a?(Hash)
      
      {
        first_name: shipping_data[:firstName] || shipping_data['firstName'],
        last_name: shipping_data[:lastName] || shipping_data['lastName'],
        shipping_address: shipping_data[:shippingAddress] || shipping_data['shippingAddress'],
        entity_type: shipping_data[:entityType] || shipping_data['entityType']
      }
    end

    def send_confirmation_email(investment, response, metadata)
      data = response[:data] || {}
      customer = data[:customer] || {}
      
      recipient_email = customer[:email] || investment.email
      recipient_name = investment.user&.full_name || investment.full_name || 
                       metadata[:investor_name] || metadata['investor_name'] || 'Investor'
      
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
      investment_id = metadata[:investment_id] || metadata['investment_id']
      Rails.logger.error "Equity investment not found or invalid state: #{investment_id}"
      raise 'Invalid investment state'
    end

    def handle_failed_transaction(status)
      Rails.logger.error "Transaction failed with status #{status}"
      raise "Transaction status is #{status}"
    end
  end
end