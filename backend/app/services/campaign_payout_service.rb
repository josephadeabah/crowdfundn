class CampaignPayoutService
  def initialize(campaign, data)
    @data = data
    @campaign = campaign
    @fundraiser = campaign.fundraiser
    @paystack_service = PaystackService.new
  end

  def process_payout
    ActiveRecord::Base.transaction do
      validate_campaign_eligibility
      payout_amount = calculate_payout_amount
  
      recipient_code = find_or_create_recipient
  
      # Ensure recipient_code is valid before initiating the transfer
      unless recipient_code
        raise "Failed to create transfer recipient."
      end
  
      transfer_response = @paystack_service.initiate_transfer(
        amount: payout_amount,
        recipient: recipient_code,
        reason: "Payout for campaign: #{@campaign.title}",
        currency: @campaign.currency
      )
  
      # Log the full transfer response for better insight
      Rails.logger.debug "Paystack transfer response: #{transfer_response.inspect}"
  
      created_transfer = Transfer.create!(
        transfer_code: transfer_response['data']['transfer_code'],
        recipient_code: recipient_code,
        amount: payout_amount,
        user: @fundraiser,
        campaign: @campaign,
        status: transfer_response['data']['status'],
        otp_required: transfer_response['data']['requires_otp'],
        reference: transfer_response['data']['reference']
      )
  
      verify_transfer_status(created_transfer)
      @campaign.update!(status: 'completed')
      Rails.logger.info "Payout processed successfully for campaign #{@campaign.id}."
      transfer_response
    end
  rescue StandardError => e
    Rails.logger.error "Error processing payout for campaign #{@campaign.id}: #{e.message}"
    raise e
  end  

  private

  def validate_campaign_eligibility
    unless @campaign.completed? || @campaign.current_amount >= @campaign.goal_amount || days_left <= 0
      raise "Campaign is not eligible for payout."
    end
  end

  def days_left
    (@campaign.end_date.to_date - Date.today).to_i
  end

  def calculate_payout_amount
    total_donations = @campaign.donations.where(status: 'successful').sum(:net_amount)
    raise "No funds available for payout." if total_donations <= 0

    total_donations
  end

  def find_or_create_recipient
    Rails.logger.debug "Creating transfer recipient for fundraiser #{@fundraiser.full_name}"
    
    response = @paystack_service.create_transfer_recipient(
      type: @fundraiser.subaccount&.subaccount_type,
      name: @fundraiser.full_name,
      account_number: @fundraiser.subaccount&.account_number,
      bank_code: @fundraiser.subaccount&.settlement_bank,
      currency: @campaign.currency.upcase,
      authorization_code: @fundraiser.subaccount&.authorization_code,
      description: "Transfer recipient for campaign payouts",
      metadata: { user_id: @fundraiser.id }
    )
    
    Rails.logger.debug "Paystack recipient response: #{response.inspect}"
  
    # Check if the response is successful
    if response['status'] == true
      recipient_code = response['data']['recipient_code']
      
      unless recipient_code
        Rails.logger.error "Recipient code missing in response: #{response.inspect}"
        raise "Recipient code missing from Paystack response"
      end
  
      # Update the subaccount with the recipient code
      @fundraiser.subaccount.update!(recipient_code: recipient_code)
      return recipient_code
    else
      # Log the failure if status is not true
      Rails.logger.error "Failed to create recipient: #{response.inspect}"
      raise "Failed to create transfer recipient: #{response['message'] || 'Unknown error'}"
    end
  end  
  
  def verify_transfer_status(transfer)
    verify_result = @paystack_service.verify_transfer(transfer.reference)
    Rails.logger.debug "Verification result for transfer #{transfer.reference}: #{verify_result.inspect}"
    unless verify_result[:status] && verify_result[:data][:status] == 'success'
      Rails.logger.error "Transfer verification failed for reference #{transfer.reference}: #{verify_result.inspect}"
      raise "Transfer verification failed for reference #{transfer.reference}"
    end
  end  
end
