# app/services/paystack_webhook/handlers/donation_handler.rb
module PaystackWebhook::Handlers
  class DonationHandler
    include PaystackWebhook::JsonHelper
    
    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      Rails.logger.info "Verifying donation with reference #{transaction_reference}"

      response = PaystackService.new.verify_transaction(transaction_reference)
      unless response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      transaction_status = response.dig(:data, :status)
      if transaction_status == 'success'
        process_successful_donation(response)
      else
        Rails.logger.error "Transaction failed with status #{transaction_status}"
        raise "Transaction status is #{transaction_status}"
      end
    end

    private

    def process_successful_donation(response)
      gross_amount = response.dig(:data, :amount).to_f / 100.0
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      
      # Ensure we're creating a regular donation (type = nil)
      create_donation(
        response: response,
        metadata: metadata,
        gross_amount: gross_amount,
        net_amount: net_amount,
        adjusted_platform_fee: adjusted_platform_fee
      )
    end

    def parse_metadata(response)
      if response.dig(:data, :metadata).is_a?(String)
        begin
          fixed_metadata = fix_malformed_json(response.dig(:data, :metadata))
          JSON.parse(fixed_metadata, symbolize_names: true)
        rescue JSON::ParserError => e
          Rails.logger.error "Failed to parse metadata even after fixing: #{e.message}"
          raise "Invalid metadata: #{response.dig(:data, :metadata)}"
        end
      else
        response.dig(:data, :metadata) || {}
      end
    end

    def create_donation(response:, metadata:, gross_amount:, net_amount:, adjusted_platform_fee:)
      transaction_reference = response[:data][:reference]
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      final_country = donor_country.presence || Geocoder.search(donor_ip).first&.country || 'Unknown'

      subaccount_name = response.dig(:data, :subaccount, :primary_contact_name) || 'No contact name'
      subaccount_contact = response.dig(:data, :subaccount, :primary_contact_email) || 'No contact email'
      subaccount_phone = response.dig(:data, :subaccount, :primary_contact_phone) || 'No contact phone'

      shipping_data = (metadata[:metadata] && metadata[:metadata][:shippingData]) || {}
      selected_rewards = (metadata[:metadata] && metadata[:metadata][:selectedRewards]) || []
      delivery_option = (metadata[:metadata] && metadata[:metadata][:deliveryOption]) || 'pickup'

      # Explicitly set type to nil for regular donations
      donation = Donation.new(
        type: nil, # This ensures it's a regular donation
        transaction_reference: transaction_reference,
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: metadata[:user_id].presence,
        campaign_id: metadata[:campaign_id].presence,
        full_name: metadata[:donor_name],
        email: response.dig(:data, :customer, :email),
        phone: metadata[:phone],
        country: final_country,
        ip_address: donor_ip,
        metadata: build_metadata(metadata, response, subaccount_name, subaccount_contact, subaccount_phone),
        processed: false
      )

      if donation.save
        update_campaign(donation, net_amount)
        create_pledges(donation, selected_rewards, shipping_data, delivery_option)
        send_notifications(donation)
      else
        Rails.logger.error "Failed to save donation: #{donation.errors.full_messages.join(', ')}"
        raise "Failed to save donation: #{donation.errors.full_messages.join(', ')}"
      end
    end

    def build_metadata(metadata, response, subaccount_name, subaccount_contact, subaccount_phone)
      {
        anonymous_token: metadata[:anonymous_token],
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        campaign_metadata: {
          title: metadata[:title],
          goal_amount: metadata[:goal_amount],
          current_amount: metadata[:current_amount],
          currency: metadata[:currency],
          currency_symbol: metadata[:currency_symbol],
          fundraiser_id: metadata[:fundraiser_id],
          fundraiser_name: metadata[:fundraiser_name]
        },
        redirect_url: metadata[:redirect_url],
        subaccount_contact: {
          name: subaccount_name,
          email: subaccount_contact,
          phone: subaccount_phone
        }
      }
    end

    def update_campaign(donation, net_amount)
      campaign = donation.campaign
      campaign.update!(
        total_successful_donations: campaign.current_amount + net_amount,
        current_amount: campaign.current_amount + net_amount
      )
      campaign.update_transferred_amount(net_amount)
    end

    def create_pledges(donation, selected_rewards, shipping_data, delivery_option)
      selected_rewards.each do |reward|
        next if Pledge.exists?(donation_id: donation.id, reward_id: reward[:id])

        Pledge.create!(
          donation_id: donation.id,
          reward_id: reward[:id],
          amount: reward[:amount],
          shipping_data: shipping_data,
          selected_rewards: [reward],
          delivery_option: delivery_option,
          status: 'pending',
          shipping_status: 'not_shipped',
          campaign_id: donation.campaign_id,
          user_id: donation.metadata[:fundraiser_id]
        )
      end
    end

    def send_notifications(donation)
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)

      if donation.user.present?
        Point.add_points(donation.user, donation)
        LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
      else
        Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
      end
    end
  end
end