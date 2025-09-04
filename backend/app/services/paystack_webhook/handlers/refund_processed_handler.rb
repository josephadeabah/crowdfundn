# app/services/paystack_webhook/handlers/refund_processed_handler.rb
module PaystackWebhook
  module Handlers
    class RefundProcessedHandler
      def initialize(investment, response = nil)
        @investment = investment
        @response   = response
      end

      # Called when we want to initiate a refund
      def initiate_refund
        Rails.logger.info "Initiating Paystack refund for investment #{@investment.id}"

        transaction_id       = @response&.dig(:data, :id)
        transaction_reference = @response&.dig(:data, :reference) || @investment.metadata['reference']
        paystack_service     = PaystackService.new

        begin
          refund_response = paystack_service.initiate_refund(
            transaction: transaction_id || transaction_reference,
            amount: @investment.amount,
            currency: @investment.campaign.currency,
            customer_note: "Refund due to equity oversubscription in #{@investment.campaign.company_name}",
            merchant_note: "Automatic refund for oversubscribed equity investment ID: #{@investment.id}"
          )

          if refund_response[:status]
            handle_successful_initiation(refund_response)
          else
            handle_failed_initiation(refund_response)
          end
        rescue => e
          handle_exception(e)
        end
      end

      # Called when Paystack webhook notifies us of refund.processed
      def handle_webhook(data)
        refund_reference = data[:reference]
        status           = data[:status]
        amount           = data[:amount].to_f / 100.0 # kobo/pesewa to base unit

        Rails.logger.info "Refund webhook received for #{@investment.id}: #{refund_reference} - #{status}"

        @investment.update!(
          status: EquityInvestment::STATUS_REFUNDED,
          metadata: @investment.metadata.merge(
            'refund_webhook_received_at' => Time.current.iso8601,
            'refund_reference' => refund_reference,
            'refund_status' => status,
            'refund_amount' => amount
          )
        )

        # Optional: send confirmation email
        send_refund_email(@investment)
      end

      private

      def handle_successful_initiation(refund_response)
        Rails.logger.info "Refund initiated successfully: #{refund_response[:data][:reference]}"

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_reference' => refund_response[:data][:reference],
            'refund_id' => refund_response[:data][:id],
            'refund_status' => refund_response[:data][:status],
            'refund_amount' => @investment.amount
          )
        )

        RefundStatusCheckJob.set(wait: 1.hour).perform_later(@investment.id)
      end

      def handle_failed_initiation(refund_response)
        Rails.logger.error "Failed to initiate refund: #{refund_response[:message]}"

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_error' => refund_response[:message],
            'refund_requires_manual_intervention' => true,
            'refund_response' => refund_response
          )
        )
      end

      def handle_exception(exception)
        Rails.logger.error "Exception during refund initiation: #{exception.message}"
        Rails.logger.error exception.backtrace.join("\n")

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_error' => "Exception: #{exception.message}",
            'refund_requires_manual_intervention' => true
          )
        )
      end

      def send_refund_email(investment)
        recipient_email = investment.email
        recipient_name  = investment.user&.full_name || investment.full_name || 'Investor'

        InvestmentRefundEmailService.send_refund_email(
          investment: investment,
          recipient_email: recipient_email,
          recipient_name: recipient_name
        )
      rescue => e
        Rails.logger.error "Failed to send refund email: #{e.message}"
      end
    end
  end
end
