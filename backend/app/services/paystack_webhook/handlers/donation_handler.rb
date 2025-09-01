module PaystackWebhook::Handlers
  class DonationHandler
    include PaystackWebhook::JsonHelper
    
    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      Rails.logger.info "Processing donation with reference #{transaction_reference}"

      response = PaystackService.new.verify_transaction(transaction_reference)
      unless response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      transaction_status = response.dig(:data, :status)
      Rails.logger.info "Transaction status: #{transaction_status}"

      # Find or initialize donation
      donation = Donation.find_or_initialize_by(transaction_reference: transaction_reference)

      case transaction_status
      when 'success'
        handle_successful_transaction(donation, response)
      when 'failed', 'abandoned'
        handle_failed_transaction(donation, response, transaction_status)
      when 'pending'
        handle_pending_transaction(donation, response)
      else
        handle_other_status(donation, response, transaction_status)
      end

      donation.save! if donation.changed?
    end

    private

    def handle_successful_transaction(donation, response)
      return if donation.successful? # Already processed

      gross_amount = response.dig(:data, :amount).to_f / 100.0
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      user_id = metadata[:user_id]
      campaign_id = metadata[:campaign_id]

      # Only update campaign amounts if this is a new successful donation
      # or if the donation status is changing to successful
      should_update_campaign = donation.new_record? || !donation.successful?

      donation.assign_attributes(
        status: Donation::STATUS_SUCCESSFUL,
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: user_id.presence,
        campaign_id: campaign_id.presence,
        full_name: metadata[:donor_name],
        email: response.dig(:data, :customer, :email),
        phone: metadata[:phone],
        country: determine_country(response),
        ip_address: response.dig(:data, :ip_address),
        metadata: build_metadata(response, metadata),
        processed: false
      )

      if should_update_campaign && donation.campaign
        campaign = donation.campaign
        campaign.update!(
          total_successful_donations: campaign.current_amount + net_amount,
          current_amount: campaign.current_amount + net_amount
        )
        campaign.update_transferred_amount(net_amount)
      end

      # Handle rewards and pledges only for new successful donations
      if donation.new_record?
        handle_rewards_and_pledges(donation, metadata)
        send_notification_emails(donation)
        handle_user_points(donation)
      end

      Rails.logger.info "Successfully processed donation #{donation.id}"
    end

    def handle_failed_transaction(donation, response, status)
      donation_status = status == 'failed' ? Donation::STATUS_FAILED : Donation::STATUS_ABANDONED
      
      donation.assign_attributes(
        status: donation_status,
        email: response.dig(:data, :customer, :email),
        full_name: parse_metadata(response)[:donor_name],
        metadata: build_failed_metadata(response, parse_metadata(response))
      )

      Rails.logger.info "Marked donation as #{donation_status}: #{donation.transaction_reference}"
    end

    def handle_pending_transaction(donation, response)
      donation.assign_attributes(
        status: Donation::STATUS_PENDING,
        email: response.dig(:data, :customer, :email),
        full_name: parse_metadata(response)[:donor_name],
        metadata: build_pending_metadata(response, parse_metadata(response))
      )

      Rails.logger.info "Marked donation as pending: #{donation.transaction_reference}"
    end

    def handle_other_status(donation, response, status)
      Rails.logger.warn "Unhandled transaction status: #{status} for reference: #{donation.transaction_reference}"
      
      # Store the status but don't process further
      donation.assign_attributes(
        status: map_paystack_status_to_donation_status(status),
        email: response.dig(:data, :customer, :email),
        metadata: { paystack_status: status, processed_at: Time.current }
      )
    end

    def parse_metadata(response)
      raw_metadata = response.dig(:data, :metadata)
      
      if raw_metadata.is_a?(String)
        begin
          fixed_metadata = fix_malformed_json(raw_metadata)
          JSON.parse(fixed_metadata, symbolize_names: true)
        rescue JSON::ParserError => e
          Rails.logger.error "Failed to parse metadata: #{e.message}"
          {}
        end
      else
        raw_metadata || {}
      end
    end

    def determine_country(response)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)

      country_from_ip = Geocoder.search(donor_ip).first&.country || 'Unknown'
      final_country = donor_country.presence || country_from_ip
      final_country.presence || 'Unknown'
    end

    def build_metadata(response, metadata)
      subaccount_name = response.dig(:data, :subaccount, :primary_contact_name) || 'No contact name'
      subaccount_contact = response.dig(:data, :subaccount, :primary_contact_email) || 'No contact email'
      subaccount_phone = response.dig(:data, :subaccount, :primary_contact_phone) || 'No contact phone'

      campaign_metadata = {
        title: metadata[:title],
        goal_amount: metadata[:goal_amount],
        current_amount: metadata[:current_amount],
        currency: metadata[:currency],
        currency_symbol: metadata[:currency_symbol],
        fundraiser_id: metadata[:fundraiser_id],
        fundraiser_name: metadata[:fundraiser_name]
      }

      {
        anonymous_token: metadata[:anonymous_token],
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        campaign_metadata: campaign_metadata,
        redirect_url: metadata[:redirect_url],
        subaccount_contact: {
          name: subaccount_name,
          email: subaccount_contact,
          phone: subaccount_phone
        },
        processed_at: Time.current
      }
    end

    def build_failed_metadata(response, metadata)
      {
        paystack_status: response.dig(:data, :status),
        failure_reason: response.dig(:data, :gateway_response),
        donor_name: metadata[:donor_name],
        processed_at: Time.current
      }
    end

    def build_pending_metadata(response, metadata)
      {
        paystack_status: response.dig(:data, :status),
        donor_name: metadata[:donor_name],
        processed_at: Time.current
      }
    end

    def handle_rewards_and_pledges(donation, metadata)
      shipping_data = (metadata[:metadata] && metadata[:metadata][:shippingData]) || {}
      selected_rewards = (metadata[:metadata] && metadata[:metadata][:selectedRewards]) || []
      delivery_option = (metadata[:metadata] && metadata[:metadata][:deliveryOption]) || 'pickup'

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
          user_id: metadata[:fundraiser_id]
        )
      end
    end

    def send_notification_emails(donation)
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)
    rescue => e
      Rails.logger.error "Failed to send notification emails: #{e.message}"
    end

    def handle_user_points(donation)
      if donation.user.present?
        Point.add_points(donation.user, donation)
        LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
      else
        Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
      end
    rescue => e
      Rails.logger.error "Failed to handle user points: #{e.message}"
    end

    def map_paystack_status_to_donation_status(paystack_status)
      case paystack_status.downcase
      when 'success' then Donation::STATUS_SUCCESSFUL
      when 'failed' then Donation::STATUS_FAILED
      when 'abandoned' then Donation::STATUS_ABANDONED
      when 'pending' then Donation::STATUS_PENDING
      when 'canceled' then Donation::STATUS_CANCELED
      when 'refunded' then Donation::STATUS_REFUNDED
      else
        Rails.logger.warn "Unknown Paystack status: #{paystack_status}, defaulting to initialized"
        Donation::STATUS_INITIALIZED
      end
    end
  end
end