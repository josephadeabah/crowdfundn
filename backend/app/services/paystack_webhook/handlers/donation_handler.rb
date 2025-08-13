module PaystackWebhook::Handlers
  class DonationHandler
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
        create_donation
      else
        raise "Transaction status is #{transaction_status}"
      end
    end

    def create_donation
      donation = Donation.new(
        type: nil, # Explicitly set to nil for regular donations
        transaction_reference: @data[:reference],
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: metadata[:user_id].presence,
        campaign_id: metadata[:campaign_id].presence,
        full_name: metadata[:donor_name],
        email: @response.dig(:data, :customer, :email),
        phone: metadata[:phone],
        country: donor_country,
        ip_address: @response.dig(:data, :ip_address),
        metadata: build_metadata,
        processed: false
      )

      if donation.save
        update_campaign(donation)
        send_notifications(donation)
      else
        raise "Failed to save donation: #{donation.errors.full_messages.join(', ')}"
      end
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

    def donor_country
      (@response.dig(:data, :authorization, :country_code) || 
      Geocoder.search(@response.dig(:data, :ip_address)).first&.country || 
      'Unknown')
    end

    def build_metadata
      {
        anonymous_token: metadata[:anonymous_token],
        user_id: metadata[:user_id],
        campaign_id: metadata[:campaign_id],
        redirect_url: metadata[:redirect_url],
        subaccount_contact: {
          name: @response.dig(:data, :subaccount, :primary_contact_name),
          email: @response.dig(:data, :subaccount, :primary_contact_email),
          phone: @response.dig(:data, :subaccount, :primary_contact_phone)
        }
      }
    end

    def update_campaign(donation)
      campaign = donation.campaign
      campaign.update!(
        total_successful_donations: campaign.current_amount + donation.net_amount,
        current_amount: campaign.current_amount + donation.net_amount
      )
      campaign.update_transferred_amount(donation.net_amount)
    end

    def send_notifications(donation)
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)

      if donation.user.present?
        Point.add_points(donation.user, donation)
        LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
      end
    end
  end
end