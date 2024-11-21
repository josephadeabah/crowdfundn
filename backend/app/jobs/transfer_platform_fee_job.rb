# app/jobs/transfer_platform_fee_job.rb
class TransferPlatformFeeJob < ApplicationJob
  queue_as :mailers

  def perform
    # Calculate total balance pending for transfer
    total_balance = Balance.where(status: "pending").sum(:amount)
    return if total_balance.zero?

    # Call Paystack Transfer API
    paystack_service = PaystackService.new
    response = paystack_service.initiate_transfer(total_balance)

    if response[:status] == true
      # Mark all balances as transferred
      Balance.where(status: "pending").update_all(status: "transferred")
    else
      Rails.logger.error("Paystack transfer failed: #{response[:message]}")
    end
  end
end
