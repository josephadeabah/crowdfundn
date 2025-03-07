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
    # Log for debug purposes
    Rails.logger.info "Verifying donation with reference #{transaction_reference}"

    donation = Donation.find_by(transaction_reference: transaction_reference)

    # If donation is not found, log and raise error
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

    # Extract transaction status
    transaction_status = response[:data] && response[:data][:status]
    if transaction_status == 'success'
      gross_amount = (response[:data] && response[:data][:amount]).to_f / 100.0 # Gross amount from Paystack

      # Step 1: Calculate the net amount (93% of the gross amount)
      net_amount = gross_amount * 0.93

      # Step 2: Calculate the platform fee (7% of the gross amount)
      platform_fee = gross_amount * 0.07

      # Step 3: Adjust the platform fee after Paystack's 1.95% deduction
      paystack_fee = platform_fee * 0.0195

      # Step 4: Subtract Paystack's fee from the platform fee
      adjusted_platform_fee = platform_fee - paystack_fee

      # Parse metadata if it's a string
      metadata = if response[:data] && response[:data][:metadata].is_a?(String)
                  JSON.parse(response[:data][:metadata], symbolize_names: true)
                else
                  response[:data] && response[:data][:metadata] || {}
                end

      # Step 5: Extract metadata values (user_id, campaign_id, session_token)
      user_id = metadata[:user_id]
      campaign_id = metadata[:campaign_id]
      session_token = metadata[:anonymous_token]
      donor_ip = response[:data] && response[:data][:ip_address] # Extract the IP address
      donor_country = response[:data] && response[:data][:authorization] && response[:data][:authorization][:country_code] # Country from Paystack

      # Map IP address to country
      country_from_ip = Geocoder.search(donor_ip).first&.country || 'Unknown'
      final_country = donor_country.presence || country_from_ip
      final_country = 'Unknown' if final_country.blank?

      # Extract campaign metadata (title, description, etc.)
      campaign_metadata = {
        title: metadata[:title],
        goal_amount: metadata[:goal_amount],
        current_amount: metadata[:current_amount],
        currency: metadata[:currency],
        currency_symbol: metadata[:currency_symbol],
        fundraiser_id: metadata[:fundraiser_id],
        fundraiser_name: metadata[:fundraiser_name]
      }

      # Extract subaccount contact details
      subaccount_name = response[:data] && response[:data][:subaccount] && response[:data][:subaccount][:primary_contact_name] || 'No contact name'
      subaccount_contact = response[:data] && response[:data][:subaccount] && response[:data][:subaccount][:primary_contact_email] || 'No contact email'
      subaccount_phone = response[:data] && response[:data][:subaccount] && response[:data][:subaccount][:primary_contact_phone] || 'No contact phone'

      # Step 6: Extract shipping data, selected rewards, and delivery option
      shipping_data = metadata[:metadata] && metadata[:metadata][:shippingData] || {}
      selected_rewards = metadata[:metadata] && metadata[:metadata][:selectedRewards] || []
      delivery_option = metadata[:metadata] && metadata[:metadata][:deliveryOption] || 'pickup'

      # Step 7: Update the donation record with extracted metadata and transaction details
      donation.update!(
        status: 'successful',
        gross_amount: gross_amount,
        net_amount: net_amount,
        platform_fee: adjusted_platform_fee,
        amount: net_amount,
        user_id: user_id.presence, # Update user_id only if provided
        campaign_id: campaign_id.presence, # Update campaign_id only if provided
        full_name: metadata[:donor_name], # Update full_name with donor's name
        email: response[:data] && response[:data][:customer] && response[:data][:customer][:email],
        phone: metadata[:phone],
        country: final_country,  # Store the most reliable country info
        ip_address: donor_ip, # Store the IP address
        metadata: {
          anonymous_token: session_token,
          user_id: user_id, # Add user_id to metadata
          campaign_id: campaign_id, # Add campaign_id to metadata
          campaign_metadata: campaign_metadata, # Add campaign metadata to donation
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
        }, # Replacing the existing metadata entirely
        processed: false # New donations will have `processed` set to `false`
      )

      # Step 8: Update the related campaign
      campaign = donation.campaign
      campaign.update!(
        total_successful_donations: campaign.current_amount + net_amount,
        current_amount: campaign.current_amount + net_amount
      )

      # Update the transferred amount for the campaign
      campaign.update_transferred_amount(net_amount)

      # Step 9: Create or update pledges with shipping data, selected rewards, and delivery option
      selected_rewards.each do |reward|
        unless Pledge.exists?(donation_id: donation.id, reward_id: reward[:id])
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
      end

      # Send confirmation email to the donor
      DonationConfirmationEmailService.send_confirmation_email(donation)
      FundraiserDonationNotificationService.send_notification_email(donation)

      # ✅ Fixed points & leaderboard updates
      if donation.user.present?
        Point.add_points(donation.user, donation)
        LeaderboardEntry.update_leaderboard(donation.user, donation.user.total_points)
      else
        Rails.logger.info "Skipping points & leaderboard update for anonymous donation: #{donation.id}"
      end
    else
      # If the transaction status isn't 'success', update the donation and raise an error
      donation.update!(status: transaction_status)
      Rails.logger.error "Transaction failed with status #{transaction_status}"
      raise "Transaction status is #{transaction_status}"
    end
  end
end