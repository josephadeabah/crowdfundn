# app/jobs/refund_status_check_job.rb
class RefundStatusCheckJob < ApplicationJob
  queue_as :default
  
  def perform(investment_id)
    investment = EquityInvestment.find_by(id: investment_id)
    return unless investment && investment.metadata['refund_id']
    
    paystack_service = PaystackService.new
    refund_response = paystack_service.fetch_refund(investment.metadata['refund_id'])
    
    if refund_response[:status]
      investment.update!(
        metadata: investment.metadata.merge(
          'refund_status' => refund_response[:data][:status],
          'refund_processed_at' => refund_response[:data][:processed_at],
          'refund_checked_at' => Time.current.iso8601
        )
      )
      
      # If refund is still processing, check again later
      if refund_response[:data][:status] == 'processing'
        RefundStatusCheckJob.set(wait: 30.minutes).perform_later(investment.id)
      end
    end
  end
end