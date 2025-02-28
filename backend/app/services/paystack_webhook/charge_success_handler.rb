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

    ActiveRecord::Base.transaction do
      handle_donation_success if @data.present?
    end
  rescue StandardError => e
    Rails.logger.error "Error processing charge success: #{e.message}"
    raise e
  ensure
    # Mark the event as processed (deduplication logic)
    EventProcessed.create(event_id: transaction_reference)
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
  
    # Log the response for debugging
    Rails.logger.info { "Paystack response: #{response.inspect}" }
  
    # Ensure response is a hash
    response = JSON.parse(response, symbolize_names: true) if response.is_a?(String)
  
    unless response[:status] == true
      Rails.logger.error "Transaction verification failed for #{transaction_reference}"
      raise 'Transaction verification failed'
    end
  
    # Parse the metadata field if it's a string
    metadata = response[:data][:metadata]
    metadata = JSON.parse(metadata, symbolize_names: true) if metadata.is_a?(String)
  
    # Extract transaction status
    transaction_status = response[:data][:status] || 'unknown'
    if transaction_status == 'success'
      gross_amount = (response[:data][:amount] || 0).to_f / 100.0 # Gross amount from Paystack
  
      # Calculate net amount and platform fee
      net_amount = gross_amount * 0.93
      platform_fee = gross_amount * 0.07
      paystack_fee = platform_fee * 0.0195
      adjusted_platform_fee = platform_fee - paystack_fee
  
      # Extract metadata values
      user_id = metadata[:user_id]
      campaign_id = metadata[:campaign_id]
      session_token = metadata[:anonymous_token]
  
      # Extract campaign metadata
      campaign_metadata = metadata[:campaign_metadata] || {}
  
      # Extract subaccount contact details
      subaccount_name = response[:data][:subaccount][:primary_contact_name] || 'No contact name'
      subaccount_contact = response[:data][:subaccount][:primary_contact_email] || 'No contact email'
      subaccount_phone = response[:data][:subaccount][:primary_contact_phone] || 'No contact phone'
  
      # Update the donation record
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: user_id.presence,
        campaign_id: campaign_id.presence,
        full_name: metadata[:donor_name],
        email: response[:data][:customer][:email],
        phone: metadata[:phone],
        metadata: {
          anonymous_token: session_token,
          user_id: user_id,
          campaign_id: campaign_id,
          campaign_metadata: campaign_metadata,
          subaccount_contact: {
            name: subaccount_name,
            email: subaccount_contact,
            phone: subaccount_phone
          }
        },
        processed: false
      )
  
      # Update the related campaign
      campaign = donation.campaign
      campaign.update!(
        total_successful_donations: campaign.current_amount + net_amount,
        current_amount: campaign.current_amount + net_amount
      )
  
      # Update the transferred amount for the campaign
      campaign.update_transferred_amount(net_amount)
  
      # Send confirmation email to the donor
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)
  
      # Update points & leaderboard for the donor
      if donation.user.present?
        Point.add_points(donation.user, donation)
        LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
      else
        Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
      end
    else
      donation.update!(status: transaction_status)
      Rails.logger.error "Transaction failed with status #{transaction_status}"
      raise "Transaction status is #{transaction_status}"
    end
  end
end
