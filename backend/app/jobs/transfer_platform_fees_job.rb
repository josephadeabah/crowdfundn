# app/jobs/transfer_platform_fees_job.rb
class TransferPlatformFeesJob < ApplicationJob
  queue_as :financial

  def perform
    PlatformFeeService.transfer_platform_fees
  rescue => e
    Rails.logger.error "[TransferPlatformFeesJob] Error: #{e.message}"
  end
end
