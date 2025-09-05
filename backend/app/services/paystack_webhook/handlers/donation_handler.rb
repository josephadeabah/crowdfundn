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
      gross_amount = response.dig(:data, :amount).to_f / 100.0
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee

      metadata = parse_metadata(response)
      
      begin
        ActiveRecord::Base.transaction do
          donation = create_or_update_donation(response, metadata, gross_amount, net_amount, adjusted_platform_fee)
          
          if donation.persisted?
            update_campaign(donation, net_amount)
            create_pledges_from_rewards(donation, metadata)
            
            send_confirmation_emails(donation, response, metadata)
            
            if donation.user.present?
              Point.add_points(donation.user, donation)
              LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
            end
          else
            handle_donation_creation_failure(response, metadata, donation.errors)
          end
        end
      rescue => e
        Rails.logger.error "Failed to process successful donation: #{e.message}"
        handle_processing_failure(response, metadata, e)
      end
    end

    def handle_pending_transaction(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.info "Transaction #{transaction_reference} for donation #{donation&.id} is #{status}"
      
      if donation
        donation.update!(
          status: Donation::STATUS_PENDING,
          metadata: donation.metadata.merge(
            'last_status_check' => Time.current.iso8601,
            'transaction_status' => status,
            'pending_reference' => transaction_reference,
            'status_attempts' => (donation.metadata&.[]('status_attempts') || 0) + 1,
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      attempt_count = donation&.metadata&.[]('status_attempts') || 1
      check_time = calculate_next_check_time(attempt_count, status)
      
      DonationStatusCheckJob.set(wait_until: check_time).perform_later(
        transaction_reference,
        donation&.id
      )
    end

    def handle_failed_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} failed for donation #{donation&.id}"
      
      if donation
        failure_reason = response.dig(:data, :gateway_response) || 'payment_failed'
        
        donation.update!(
          status: Donation::STATUS_FAILED,
          metadata: donation.metadata.merge(
            'failure_reason' => failure_reason,
            'failure_time' => Time.current.iso8601,
            'failure_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'failed'
          )
        )
        
        send_failure_notification(donation, response, metadata)
        
        # Check if refund is needed for failed transaction
        donation.initiate_refund('payment_failure') if donation.requires_refund?
      end
    end

    def handle_abandoned_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} abandoned for donation #{donation&.id}"
      
      if donation
        donation.update!(
          status: Donation::STATUS_ABANDONED,
          metadata: donation.metadata.merge(
            'abandoned_time' => Time.current.iso8601,
            'abandoned_reason' => 'customer_did_not_complete',
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'abandoned'
          )
        )
        
        send_abandonment_notification(donation, response, metadata)
      end
    end

    def handle_reversed_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.warn "Transaction #{transaction_reference} reversed for donation #{donation&.id}"
      
      if donation
        reversal_reason = response.dig(:data, :gateway_response) || 'transaction_reversed'
        
        donation.update!(
          status: Donation::STATUS_REFUNDED,
          metadata: donation.metadata.merge(
            'reversal_time' => Time.current.iso8601,
            'reversal_reason' => reversal_reason,
            'reversal_details' => response.dig(:data, :message),
            'gateway_response' => response.dig(:data, :gateway_response),
            'transaction_status' => 'reversed'
          )
        )
        
        send_reversal_notification(donation, response, metadata)
      end
    end

    def handle_queued_transaction(response)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.info "Transaction #{transaction_reference} queued for donation #{donation&.id}"
      
      if donation
        donation.update!(
          status: Donation::STATUS_PENDING,
          metadata: donation.metadata.merge(
            'queued_time' => Time.current.iso8601,
            'transaction_status' => 'queued',
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      DonationStatusCheckJob.set(wait: 2.hours).perform_later(
        transaction_reference,
        donation&.id
      )
    end

    def handle_unknown_status(response, status)
      transaction_reference = response.dig(:data, :reference)
      metadata = parse_metadata(response)
      donation = find_donation(metadata)
      
      Rails.logger.error "Unknown transaction status '#{status}' for reference #{transaction_reference}"
      
      if donation
        donation.update!(
          status: Donation::STATUS_FAILED,
          metadata: donation.metadata.merge(
            'failure_reason' => 'unknown_status',
            'failure_time' => Time.current.iso8601,
            'unknown_status' => status,
            'gateway_response' => response.dig(:data, :gateway_response)
          )
        )
      end
      
      DonationStatusCheckJob.set(wait: 30.minutes).perform_later(
        transaction_reference,
        donation&.id
      )
    end

    def calculate_next_check_time(attempt_count, status)
      intervals = case status
                  when 'ongoing' then [2, 5, 10, 15, 30, 60]
                  when 'processing' then [5, 15, 30, 60, 120, 240]
                  else [5, 15, 30, 60, 120, 240, 480, 720, 1440]
                  end
      
      interval_index = [attempt_count - 1, intervals.size - 1].min
      interval_minutes = intervals[interval_index]
      
      interval_minutes.minutes.from_now
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

    def find_donation(metadata)
      Donation.find_by(transaction_reference: metadata[:reference]) ||
      Donation.find_by(id: metadata[:donation_id])
    end

    def create_or_update_donation(response, metadata, gross_amount, net_amount, adjusted_platform_fee)
      donor_ip = response.dig(:data, :ip_address)
      donor_country = response.dig(:data, :authorization, :country_code)
      country_from_ip = Geocoder.search(donor_ip).first&.country || 'Unknown'
      final_country = donor_country.presence || country_from_ip
      final_country = 'Unknown' if final_country.blank?

      campaign_metadata = {
        title: metadata[:title].presence || "Untitled Campaign",
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

      # FIX: Ensure proper handling of rewards data
      shipping_data = metadata[:shippingData] || {}
      selected_rewards = Array(metadata[:selectedRewards]).map { |r| r.is_a?(Hash) ? r.deep_symbolize_keys : r }
      delivery_option = metadata[:deliveryOption].presence || 'pickup'

      donation_attributes = {
        transaction_reference: response.dig(:data, :reference),
        status: Donation::STATUS_SUCCESSFUL,
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: metadata[:user_id].presence,
        campaign_id: metadata[:campaign_id].presence,
        full_name: metadata[:donor_name].presence || "Anonymous Donor",
        email: response.dig(:data, :customer, :email),
        phone: metadata[:phone],
        country: final_country,
        ip_address: donor_ip,
        metadata: {
          anonymous_token: metadata[:anonymous_token],
          user_id: metadata[:user_id],
          campaign_id: metadata[:campaign_id],
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
          },
          shipping_data: shipping_data,
          selected_rewards: selected_rewards,
          delivery_option: delivery_option
        },
        processed: true
      }

      # Try to find existing donation or create new one
      donation = Donation.find_or_initialize_by(transaction_reference: response.dig(:data, :reference))
      donation.assign_attributes(donation_attributes)
      donation.save!
      donation
    end

    def update_campaign(donation, net_amount)
      return unless donation.campaign

      donation.campaign.update!(
        total_successful_donations: donation.campaign.total_successful_donations + net_amount,
        current_amount: donation.campaign.current_amount + net_amount
      )

      donation.campaign.update_transferred_amount(net_amount)
    end

    def create_pledges_from_rewards(donation, metadata)
      # Get shipping data and delivery option from metadata or donation metadata
      shipping_data = metadata[:shippingData] || donation.metadata&.[]('shipping_data') || {}
      delivery_option = metadata[:deliveryOption] || donation.metadata&.[]('delivery_option') || 'pickup'
      
      # Get selected rewards from metadata or donation metadata
      selected_rewards = if metadata[:selectedRewards].present?
                          Array(metadata[:selectedRewards]).map { |r| r.is_a?(Hash) ? r.deep_symbolize_keys : r }
                        else
                          donation.metadata&.[]('selected_rewards') || []
                        end

      selected_rewards.each do |reward|
        # Handle both symbol and string keys, and different reward structures
        reward_id = if reward.is_a?(Hash)
                      reward[:id] || reward['id'] || reward[:reward_id] || reward['reward_id']
                    else
                      reward.to_i
                    end
        
        reward_amount = if reward.is_a?(Hash)
                          reward[:amount] || reward['amount'] || 0
                        else
                          0
                        end

        next if reward_id.blank?
        
        rid = reward_id.to_i
        next if Pledge.exists?(donation_id: donation.id, reward_id: rid)

        Pledge.create!(
          donation_id: donation.id,
          reward_id: rid,
          amount: reward_amount.to_f,
          shipping_data: shipping_data,
          selected_rewards: [reward],
          delivery_option: delivery_option,
          status: 'pending',
          shipping_status: 'not_shipped',
          campaign_id: donation.campaign_id,
          user_id: metadata[:fundraiser_id] || donation.campaign&.fundraiser_id
        )
      end
    end

    def send_confirmation_emails(donation, response, metadata)
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)
    rescue => e
      Rails.logger.error "Failed to send confirmation emails: #{e.message}"
    end

    def handle_donation_creation_failure(response, metadata, errors)
      Rails.logger.error "Failed to create donation: #{errors.full_messages.join(', ')}"
      
      # Store the failed attempt for manual review
      FailedDonationAttempt.create!(
        transaction_reference: response.dig(:data, :reference),
        payload: response,
        metadata: metadata,
        error_messages: errors.full_messages,
        status: 'creation_failed'
      )
      
      # Optionally initiate refund if payment was taken but donation creation failed
      if response.dig(:data, :status) == 'success'
        handle_processing_failure(response, metadata, StandardError.new('Donation creation failed'))
      end
    end

    def handle_processing_failure(response, metadata, error)
      Rails.logger.error "Processing failure for donation: #{error.message}"
      
      # Store processing failure
      FailedDonationAttempt.create!(
        transaction_reference: response.dig(:data, :reference),
        payload: response,
        metadata: metadata,
        error_messages: [error.message],
        status: 'processing_failed'
      )
      
      # Initiate refund for successful payments that failed processing
      if response.dig(:data, :status) == 'success'
        donation_refund_handler = DonationRefundHandler.new(
          transaction_reference: response.dig(:data, :reference),
          reason: 'processing_failure',
          error_details: error.message
        )
        donation_refund_handler.call
      end
    end

    def send_failure_notification(donation, response, metadata)
      recipient_email = donation.email
      recipient_name = donation.full_name || metadata[:donor_name] || 'Donor'
      failure_reason = response.dig(:data, :gateway_response) || 'Payment failed'

      begin
        DonationFailureEmailService.send_failure_email(
          donation: donation,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          failure_reason: failure_reason,
          metadata: metadata
        )
      rescue => e
        Rails.logger.error "Failed to send failure notification: #{e.message}"
      end
    end

    def send_abandonment_notification(donation, response, metadata)
      recipient_email = donation.email
      recipient_name = donation.full_name || metadata[:donor_name] || 'Donor'

      begin
        DonationAbandonmentEmailService.send_abandonment_email(
          donation: donation,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          attempt_count: donation.metadata&.[]('status_attempts') || 1,
          gateway_response: response.dig(:data, :gateway_response)
        )
      rescue => e
        Rails.logger.error "Failed to send abandonment notification: #{e.message}"
      end
    end

    def send_reversal_notification(donation, response, metadata)
      recipient_email = donation.email
      recipient_name = donation.full_name || metadata[:donor_name] || 'Donor'
      reversal_reason = response.dig(:data, :gateway_response) || 'Transaction reversed'

      begin
        DonationReversalEmailService.send_reversal_email(
          donation: donation,
          recipient_email: recipient_email,
          recipient_name: recipient_name,
          reversal_reason: reversal_reason,
          metadata: metadata
        )
      rescue => e
        Rails.logger.error "Failed to send reversal notification: #{e.message}"
      end
    end
  end
end