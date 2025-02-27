class PaystackWebhook::ChargeSuccessHandler
  def initialize(data)
    @data = data
  end

  def call
    transaction_reference = @data[:reference]
    subscription_code = @data[:subscription_code]
    Rails.logger.debug { "Processing charge success: #{transaction_reference} or subscription #{subscription_code}" }

    # Check if the event has already been processed (optional deduplication)
    if EventProcessed.exists?(event_id: transaction_reference)
      Rails.logger.info "Charge success already processed: #{transaction_reference}"
      return # Ignore duplicate events
    end

    begin
      ActiveRecord::Base.transaction do
        handle_donation_success if @data.present?
        EventProcessed.create(event_id: transaction_reference) # Mark as processed only if successful
      end
    rescue StandardError => e
      Rails.logger.error "Error processing charge success: #{e.message}"
      raise e
    end
  end

  private

  def handle_donation_success
    transaction_reference = @data[:reference]
    Rails.logger.info "Verifying donation with reference #{transaction_reference}"
  
    donation = Donation.find_by(transaction_reference: transaction_reference)
    unless donation
      Rails.logger.error "Donation not found for reference: #{transaction_reference}"
      raise 'Donation not found'
    end
  
    # Verify transaction with Paystack
    response = PaystackService.new.verify_transaction(transaction_reference)
    unless response[:status] == true
      Rails.logger.error "Transaction verification failed for #{transaction_reference}"
      raise 'Transaction verification failed'
    end
  
    transaction_status = response.dig(:data, :status)
    if transaction_status == 'success'
      gross_amount = response.dig(:data, :amount).to_f / 100.0
      fees = calculate_fees(gross_amount)
      net_amount = fees[:net_amount]
      adjusted_platform_fee = fees[:adjusted_platform_fee]
  
      # Parse metadata (handle malformed JSON gracefully)
      metadata = {}
      begin
        metadata = JSON.parse(@data[:metadata]) if @data[:metadata].is_a?(String)
      rescue JSON::ParserError => e
        Rails.logger.error "Failed to parse metadata: #{e.message}"
        metadata = {} # Fallback to an empty hash
      end
  
      user_id = metadata.dig('user_id')
      campaign_id = metadata.dig('campaign_id')
      session_token = metadata.dig('anonymous_token')
      campaign_metadata = metadata.dig('campaign_metadata') || {}
  
      # Update donation record
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: user_id.presence,
        campaign_id: campaign_id.presence,
        full_name: metadata.dig('donor_name'),
        email: response.dig(:data, :customer, :email),
        phone: metadata.dig('phone'),
        metadata: {
          anonymous_token: session_token,
          user_id: user_id,
          campaign_id: campaign_id,
          campaign_metadata: campaign_metadata,
          subaccount_contact: {
            name: response.dig(:data, :subaccount, :primary_contact_name) || 'No contact name',
            email: response.dig(:data, :subaccount, :primary_contact_email) || 'No contact email',
            phone: response.dig(:data, :subaccount, :primary_contact_phone) || 'No contact phone'
          }
        },
        processed: false
      )
  
      # Update campaign
      update_campaign(donation, net_amount)
  
      # Send emails
      send_email_notifications(donation)
  
      # Update points and leaderboard
      update_points_and_leaderboard(donation)
    else
      donation.update!(status: transaction_status)
      Rails.logger.error "Transaction failed with status #{transaction_status}"
      raise "Transaction status is #{transaction_status}"
    end
  end

  # Calculate fees and net amount
  def calculate_fees(gross_amount)
    net_amount = gross_amount * 0.93
    platform_fee = gross_amount * 0.07
    paystack_fee = platform_fee * 0.0195
    adjusted_platform_fee = platform_fee - paystack_fee

    { net_amount: net_amount, adjusted_platform_fee: adjusted_platform_fee }
  end

  # Update campaign with new donation amount
  def update_campaign(donation, net_amount)
    campaign = donation.campaign
    campaign.update!(
      total_successful_donations: campaign.current_amount + net_amount,
      current_amount: campaign.current_amount + net_amount
    )
    campaign.update_transferred_amount(net_amount)
  end

  # Send email notifications
  def send_email_notifications(donation)
    begin
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)
    rescue => e
      Rails.logger.error "Failed to send email notifications: #{e.message}"
    end
  end

  # Update points and leaderboard for the donor
  def update_points_and_leaderboard(donation)
    if donation.user.present?
      Point.add_points(donation.user, donation)
      LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
    else
      Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
    end
  end
end