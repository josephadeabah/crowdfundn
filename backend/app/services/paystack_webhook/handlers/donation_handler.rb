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
      
      # Parse metadata first (same structure as before)
      metadata = if response.dig(:data, :metadata).is_a?(String)
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

      Rails.logger.debug { "Parsed metadata: #{metadata}" }

      # Handle all statuses but only process successful ones with the original logic
      case transaction_status
      when 'success'
        # Original successful transaction logic (unchanged)
        gross_amount = response.dig(:data, :amount).to_f / 100.0
        net_amount = gross_amount * 0.93
        platform_fee = gross_amount * 0.07
        paystack_fee = platform_fee * 0.0195
        adjusted_platform_fee = platform_fee - paystack_fee

        user_id = metadata[:user_id]
        campaign_id = metadata[:campaign_id]
        session_token = metadata[:anonymous_token]
        donor_ip = response.dig(:data, :ip_address)
        donor_country = response.dig(:data, :authorization, :country_code)

        country_from_ip = Geocoder.search(donor_ip).first&.country || 'Unknown'
        final_country = donor_country.presence || country_from_ip
        final_country = 'Unknown' if final_country.blank?

        campaign_metadata = {
          title: metadata[:title],
          goal_amount: metadata[:goal_amount],
          current_amount: metadata[:current_amount],
          currency: metadata[:currency],
          currency_symbol: metadata[:currency_symbol],
          fundraiser_id: metadata[:fundraiser_id],
          fundraiser_name: metadata[:fundraiser_name]
        }

        subaccount_name = response.dig(:data, :subaccount, :primary_contact_name) || 'No contact name'
        subaccount_contact = response.dig(:data, :subaccount, :primary_contact_email) || 'No contact email'
        subaccount_phone = response.dig(:data, :subaccount, :primary_contact_phone) || 'No contact phone'

        shipping_data = (metadata[:metadata] && metadata[:metadata][:shippingData]) || {}
        selected_rewards = (metadata[:metadata] && metadata[:metadata][:selectedRewards]) || []
        delivery_option = (metadata[:metadata] && metadata[:metadata][:deliveryOption]) || 'pickup'

        donation = Donation.create!(
          transaction_reference: transaction_reference,
          status: 'successful',
          gross_amount: gross_amount,
          net_amount: net_amount,
          platform_fee: adjusted_platform_fee,
          amount: net_amount,
          user_id: user_id.presence,
          campaign_id: campaign_id.presence,
          full_name: metadata[:donor_name],
          email: response.dig(:data, :customer, :email),
          phone: metadata[:phone],
          country: final_country,
          ip_address: donor_ip,
          metadata: {
            anonymous_token: session_token,
            user_id: user_id,
            campaign_id: campaign_id,
            campaign_metadata: campaign_metadata,
            redirect_url: metadata[:redirect_url],
            title: metadata[:title],
            goal_amount: metadata[:goal_amount],
            current_amount: metadata[:current_amount],
            currency: metadata[:currency],
            currency_symbol: metadata[:currency_symbol],
            fundraiser_id: metadata[:fundraiser_id],
            fundraiser_name: metadata[:fundraiser_name],
            subaccount_contact: {
              name: subaccount_name,
              email: subaccount_contact,
              phone: subaccount_phone
            }
          },
          processed: false
        )

        campaign = donation.campaign
        campaign.update!(
          total_successful_donations: campaign.current_amount + net_amount,
          current_amount: campaign.current_amount + net_amount
        )

        campaign.update_transferred_amount(net_amount)

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
            campaign_id: campaign_id,
            user_id: metadata[:fundraiser_id]
          )
        end

        DonationConfirmationEmailService.send_confirmation_email(donation)
        FundraiserDonationNotificationService.send_notification_email(donation)

        if donation.user.present?
          Point.add_points(donation.user, donation)
          LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
        else
          Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
        end

      when 'failed', 'abandoned', 'pending', 'canceled', 'refunded'
        # For non-successful statuses, just create a basic donation record without processing
        donation_status = case transaction_status
                         when 'failed' then Donation::STATUS_FAILED
                         when 'abandoned' then Donation::STATUS_ABANDONED
                         when 'pending' then Donation::STATUS_PENDING
                         when 'canceled' then Donation::STATUS_CANCELED
                         when 'refunded' then Donation::STATUS_REFUNDED
                         end

        Donation.create!(
          transaction_reference: transaction_reference,
          status: donation_status,
          email: response.dig(:data, :customer, :email),
          full_name: metadata[:donor_name],
          metadata: {
            paystack_status: transaction_status,
            failure_reason: response.dig(:data, :gateway_response),
            processed_at: Time.current
          }
        )

        Rails.logger.info "Created donation record with status: #{donation_status} for reference: #{transaction_reference}"

      else
        Rails.logger.error "Unhandled transaction status: #{transaction_status} for reference: #{transaction_reference}"
        raise "Unhandled transaction status: #{transaction_status}"
      end
    end
  end
end