class CampaignPayoutService
  def initialize(campaign, data)
    @data = data.deep_symbolize_keys # Ensure all keys are symbols for consistency
    @campaign = campaign
    @fundraiser = campaign.fundraiser
    @paystack_service = PaystackService.new
  end

  def process_payout
    ActiveRecord::Base.transaction do
      validate_campaign_eligibility
      payout_amount = calculate_payout_amount
  
      recipient_code = find_or_create_recipient
  
      transfer = @paystack_service.initiate_transfer(
        amount: payout_amount,
        recipient: recipient_code,
        reason: "Payout for campaign: #{@campaign.title}",
        user: @fundraiser,
        campaign: @campaign,
        currency: @campaign.currency
      )
  
      unless transfer.is_a?(Hash) && transfer[:status]
        raise "Unexpected transfer response: #{transfer.inspect}"
      end
  
      created_transfer = Transfer.create!(
        transfer_code: transfer.dig(:data, :transfer_code),
        recipient_code: recipient_code,
        amount: payout_amount,
        user: @fundraiser,
        campaign: @campaign,
        status: transfer[:status],
        otp_required: transfer.dig(:data, :otp),
        reference: transfer.dig(:data, :reference)
      )
  
      verify_transfer_status(created_transfer)
      @campaign.update!(status: 'completed')
      Rails.logger.info "Payout processed successfully for campaign #{@campaign.id}."
      transfer
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
    recipient = @paystack_service.fetch_transfer_recipient(@fundraiser.subaccount&.recipient_code)

    if recipient && recipient[:status]
      recipient.dig(:data, :recipient_code)
    else
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

      if response[:status]
        recipient_code = response.dig(:data, :recipient_code)
        @fundraiser.subaccount.update!(recipient_code: recipient_code)
        recipient_code
      else
        raise "Failed to create transfer recipient."
      end
    end
  end

  def verify_transfer_status(transfer)
    verify_result = @paystack_service.verify_transfer(transfer.reference)
    Rails.logger.debug "Verification result for transfer #{transfer.reference}: #{verify_result.inspect}"
    unless verify_result[:status] && verify_result.dig(:data, :status) == 'success'
      raise "Transfer verification failed for reference #{transfer.reference}"
    end
  end
end
