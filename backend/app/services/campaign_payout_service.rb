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

      recipient_code = find_or_create_recipient(payout_amount)
      initiate_transfer(payout_amount, recipient_code)
      finalize_campaign
    end
  rescue StandardError => e
    Rails.logger.error "Error processing payout for campaign #{@campaign.id}: #{e.message}"
    raise e
  end

  private

  def validate_campaign_eligibility
    if !@campaign.completed? && @campaign.current_amount < @campaign.goal_amount && days_left > 0
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

  def find_or_create_recipient(payout_amount)
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
  
    raise "Invalid recipient creation response" if response.dig('data', 'recipient_code').nil?
  
    recipient_code = response['data']['recipient_code']
    @fundraiser.subaccount.update!(recipient_code: recipient_code) unless @fundraiser.subaccount&.recipient_code == recipient_code
  
    recipient_code
  end
  
  def initiate_transfer(payout_amount, recipient_code)
    transfer_response = @paystack_service.initiate_transfer(
      amount: payout_amount,
      recipient: recipient_code,
      reason: "Payout for campaign: #{@campaign.title}",
      currency: @campaign.currency
    )
  
    Rails.logger.debug "Paystack transfer response: #{transfer_response.inspect}"
  
    raise "Invalid transfer initiation response" if transfer_response.dig('data', 'transfer_code').nil?
  
    Transfer.create!(
      transfer_code: transfer_response['data']['transfer_code'],
      recipient_code: recipient_code,
      amount: payout_amount,
      user: @fundraiser,
      campaign: @campaign,
      status: transfer_response['data']['status'],
      otp_required: transfer_response['data']['requires_otp'],
      reference: transfer_response['data']['reference']
    )
  end  

  def finalize_campaign
    @campaign.update!(status: 'completed')
    Rails.logger.info "Payout processed successfully for campaign #{@campaign.id}."
  end
end
