class PlatformFeeService
  def self.transfer_platform_fees
    # Sum up all unprocessed successful donations and equity investments
    total_platform_fee = Donation.where(processed: false, status: Donation::STATUS_SUCCESSFUL).sum(:platform_fee)
    total_equity_platform_fee = EquityInvestment.where(processed: false, status: EquityInvestment::STATUS_SUCCESSFUL).sum(:platform_fee)
    total_platform_fee += total_equity_platform_fee

    if total_platform_fee >= 200
      paystack_service = PaystackService.new
      response = paystack_service.initiate_transfer(
        amount: total_platform_fee.round,
        currency: 'GHS',
        recipient: 'RCP_pjyf6vw02jmif6j',
        reason: 'Platform fee accumulation transfer'
      )

      if response[:status] == true
        Donation.where(processed: false, status: Donation::STATUS_SUCCESSFUL).update_all(processed: true)
        EquityInvestment.where(processed: false, status: EquityInvestment::STATUS_SUCCESSFUL).update_all(processed: true)
        Rails.logger.info "Successfully transferred #{total_platform_fee.round} to company recipient."
      else
        Rails.logger.info "Transfer failed: #{response[:message]}"
      end
    else
      Rails.logger.info "Total platform fee (#{total_platform_fee.round}) is less than 200, transfer will not happen."
    end
  end
end