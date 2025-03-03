class PlatformFeeService
  def self.transfer_platform_fees
    # Sum up all unprocessed platform fees
    total_platform_fee = Donation.where(processed: false).sum(:platform_fee)

    if total_platform_fee >= 60
      # Transfer the total platform fee to the company's subaccount
      paystack_service = PaystackService.new
      response = paystack_service.initiate_transfer(
        source: 'balance',
        amount: total_platform_fee.round,
        currency: 'GHS',
        recipient: 'RCP_u42j3ol690ghw1q', # Your company's recipient account
        reason: 'Platform fee accumulation transfer'
      )

      if response[:status] == true
        # Mark the donations as processed
        Donation.where(processed: false).update_all(processed: true)
        Rails.logger.info "Successfully transferred #{total_platform_fee.round} to company recipient."
      else
        Rails.logger.info "Transfer failed: #{response[:message]}"
      end
    else
      Rails.logger.info "Total platform fee (#{total_platform_fee.round}) is less than 60, transfer will not happen."
    end
  end
end
