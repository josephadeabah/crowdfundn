module PaystackWebhook
  module Handlers
    class RefundProcessedHandler
      # Accepts keyword args so the same handler can be used to:
      #  - initiate an on-demand refund (investment + response)
      #  - process a Paystack refund webhook (data)
      #
      # Examples:
      #   RefundProcessedHandler.new(investment: investment, response: response).call
      #   RefundProcessedHandler.new(data: webhook_data).call
      def initialize(investment: nil, response: nil, data: nil)
        @investment = investment
        @response   = response
        @data       = data
      end

      # Public entrypoint used by controller and other services
      def call
        if @data.present?
          process_webhook(@data)
        elsif @investment.present?
          initiate_refund
        else
          Rails.logger.error "RefundProcessedHandler called without investment or data"
          raise ArgumentError, 'RefundProcessedHandler requires either :investment or :data'
        end
      end

      # Called when we want to initiate a refund (e.g. oversubscription)
      def initiate_refund
        raise ArgumentError, 'Investment is required to initiate refund' if @investment.nil?

        Rails.logger.info "Initiating Paystack refund for investment #{@investment.id}"

        # Prefer explicit transaction id when available (from response), else fallback to stored metadata reference
        transaction_id       = @response&.dig(:data, :id)
        transaction_reference = @response&.dig(:data, :reference) || @investment.metadata['reference'] || @investment.metadata[:reference]

        paystack_service = PaystackService.new

        begin
          refund_response = paystack_service.initiate_refund(
            transaction: transaction_id || transaction_reference,
            amount: (@investment.amount.to_f * 100).to_i, # send amount in kobo/pesewa if Paystack expects integer
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
        process_webhook(data)
      end

      private

      # Shared webhook processor
      def process_webhook(data)
        # Data is expected to be symbolized keys from controller
        refund_reference = data[:reference] || data.dig(:data, :reference)
        status           = (data[:status] || data.dig(:data, :status)).to_s
        amount_raw       = data[:amount] || data.dig(:data, :amount)
        amount           = (amount_raw.to_f / 100.0) if amount_raw.present?

        Rails.logger.info "Refund webhook received: reference=#{refund_reference}, status=#{status}, amount=#{amount}"

        investment = find_investment_from_webhook(data, refund_reference)

        unless investment
          Rails.logger.error "Refund webhook: could not find investment for refund reference #{refund_reference}. Storing webhook payload in EventLog."
          EventLog.create!(source: 'paystack_refund_webhook', payload: data)
          return
        end

        begin
          investment.update!(
            status: EquityInvestment::STATUS_REFUNDED,
            metadata: investment.metadata.merge(
              'refund_webhook_received_at' => Time.current.iso8601,
              'refund_reference' => refund_reference,
              'refund_status' => status,
              'refund_amount' => amount
            )
          )

          send_refund_email(investment)
        rescue => e
          Rails.logger.error "Error updating investment on refund webhook: #{e.message}\n#{e.backtrace.join("\n")}"
        end
      end

      def find_investment_from_webhook(data, refund_reference)
        # Try multiple strategies to locate investment:
        # 1. metadata.investment_id in webhook payload
        # 2. metadata.reference stored on investment
        # 3. metadata.refund_reference
        # 4. fallback: try by email + approximate amount (last resort)
        meta = data[:metadata] || data.dig(:data, :metadata) || {}

        if meta.is_a?(Hash) && (meta[:investment_id] || meta['investment_id'])
          id = meta[:investment_id] || meta['investment_id']
          investment = EquityInvestment.find_by(id: id)
          return investment if investment
        end

        # Look by reference fields stored on investment metadata
        if refund_reference.present?
          investment = EquityInvestment.where("metadata ->> 'reference' = ? OR metadata ->> 'refund_reference' = ? OR metadata ->> 'payment_reference' = ?", refund_reference, refund_reference, refund_reference).first
          return investment if investment
        end

        # Lastly, try by customer email and amount if present (best-effort)
        customer_email = data.dig(:customer, :email) || data.dig(:data, :customer, :email) || meta[:investor_email] || meta['investor_email']
        amount_raw = data[:amount] || data.dig(:data, :amount)
        amount = (amount_raw.to_f / 100.0) if amount_raw.present?

        if customer_email.present? && amount.present?
          # match gross_amount or net_amount approximate
          EquityInvestment.where(email: customer_email).order(created_at: :desc).find do |inv|
            (inv.gross_amount.to_f - amount.to_f).abs < 0.01 || (inv.net_amount.to_f - amount.to_f).abs < 0.01
          end
        else
          nil
        end
      rescue => e
        Rails.logger.error "Error finding investment from webhook: #{e.message}\n#{e.backtrace.join("\n")}"
        nil
      end

      def handle_successful_initiation(refund_response)
        Rails.logger.info "Refund initiated successfully: #{refund_response.dig(:data, :reference) || refund_response[:data][:reference]}"

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_reference' => refund_response.dig(:data, :reference) || refund_response[:data][:reference],
            'refund_id' => refund_response.dig(:data, :id) || refund_response[:data][:id],
            'refund_status' => refund_response.dig(:data, :status) || refund_response[:data][:status],
            'refund_amount' => (@investment.amount.to_f)
          )
        )

        # Schedule a status check job (keeps previous behavior)
        RefundStatusCheckJob.set(wait: 1.hour).perform_later(@investment.id)
      rescue => e
        Rails.logger.error "Error updating investment after successful refund initiation: #{e.message}\n#{e.backtrace.join("\n")}"
      end

      def handle_failed_initiation(refund_response)
        message = refund_response[:message] || refund_response.dig(:data, :message) || 'Unknown error'
        Rails.logger.error "Failed to initiate refund: #{message}"

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_error' => message,
            'refund_requires_manual_intervention' => true,
            'refund_response' => refund_response
          )
        )
      rescue => e
        Rails.logger.error "Error handling failed refund initiation: #{e.message}\n#{e.backtrace.join("\n")}"
      end

      def handle_exception(exception)
        Rails.logger.error "Exception during refund initiation: #{exception.message}\n#{exception.backtrace.join("\n")}"

        @investment.update!(
          metadata: @investment.metadata.merge(
            'refund_initiated_at' => Time.current.iso8601,
            'refund_error' => "Exception: #{exception.message}",
            'refund_requires_manual_intervention' => true
          )
        )
      rescue => e
        Rails.logger.error "Additional error while handling exception: #{e.message}\n#{e.backtrace.join("\n")}"
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
