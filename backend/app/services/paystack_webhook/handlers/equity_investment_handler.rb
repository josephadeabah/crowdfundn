module PaystackWebhook::Handlers
  class EquityInvestmentHandler
    include PaystackWebhook::JsonHelper
    def initialize(data)
      @data = data
    end

    def call
      transaction_reference = @data[:reference]
      Rails.logger.info "Verifying equity investment with reference #{transaction_reference}"

      # Verify transaction with Paystack - same as donations
      response = PaystackService.new.verify_transaction(transaction_reference)
      unless response[:status] == true
        Rails.logger.error "Transaction verification failed for #{transaction_reference}"
        raise 'Transaction verification failed'
      end

      transaction_status = response.dig(:data, :status)
      if transaction_status == 'success'
        # Same financial calculations as donations
        gross_amount = response.dig(:data, :amount).to_f / 100.0
        net_amount = gross_amount * 0.93 # 93% to fundraiser
        platform_fee = gross_amount * 0.07 # 7% platform fee
        paystack_fee = platform_fee * 0.0195 # Paystack's cut
        adjusted_platform_fee = platform_fee - paystack_fee

        # Same metadata parsing logic
        metadata = if response.dig(:data, :metadata).is_a?(String)
                     begin
                       fixed_metadata = fix_malformed_json(response.dig(:data, :metadata))
                       JSON.parse(fixed_metadata, symbolize_names: true)
                     rescue JSON::ParserError => e
                       Rails.logger.error "Failed to parse metadata even after fixing: #{e.message}"
                       raise "Invalid metadata: #{response.dig(:data, :metadata)}"
                     end
                   else
                     response.dig(:data, :metadata) || {}
                   end

        Rails.logger.debug { "Parsed metadata: #{metadata}" }

        # Same donor location handling
        donor_ip = response.dig(:data, :ip_address)
        donor_country = response.dig(:data, :authorization, :country_code)
        country_from_ip = Geocoder.search(donor_ip).first&.country || 'Unknown'
        final_country = donor_country.presence || country_from_ip
        final_country = 'Unknown' if final_country.blank?

        # Find the investment
        investment = EquityInvestment.find_by(id: metadata[:investment_id])

        if investment && (investment.pending? || investment.initialized?)
          # Update with all the same transaction details as donations
          investment.update!(
            status: 'successful',
            transaction_reference: transaction_reference,
            gross_amount: gross_amount,
            net_amount: net_amount,
            platform_fee: adjusted_platform_fee,
            subaccount_code: response.dig(:data, :subaccount, :subaccount_code),
            processed: false,
            country: final_country,
            ip_address: donor_ip,
            metadata: {
              user_id: metadata[:user_id],
              campaign_id: metadata[:campaign_id],
              shares: metadata[:shares],
              percentage: metadata[:percentage],
              type: 'equity_investment',
              subaccount_contact: {
                name: response.dig(:data, :subaccount, :primary_contact_name),
                email: response.dig(:data, :subaccount, :primary_contact_email),
                phone: response.dig(:data, :subaccount, :primary_contact_phone)
              }
            }
          )

          # Update campaign totals
          campaign = investment.campaign
          campaign.update!(
            total_equity_invested: campaign.total_equity_invested + net_amount,
            shares_issued: campaign.shares_issued + investment.shares
          )

          # Handle rewards (same pattern as donations)
          if investment.reward
            Pledge.create!(
              equity_investment_id: investment.id,
              reward_id: investment.reward.id,
              amount: investment.amount,
              status: 'pending',
              shipping_status: 'not_shipped',
              campaign_id: campaign.id,
              user_id: campaign.fundraiser_id
            )
          end

          # Generate certificate and send confirmation
          certificate = InvestmentCertificateService.generate_certificate(investment)
          if certificate
            InvestmentConfirmationEmailService.send_confirmation_email(
              investment,
              certificate.url,
              response.dig(:data, :customer, :email),
              investment.user&.full_name || 'Investor'
            )
          end

          # Update portfolio
          InvestmentUpdateJob.perform_later(investment.id)
        else
          Rails.logger.error "Equity investment not found or invalid state: #{metadata[:investment_id]}"
          raise 'Invalid investment state'
        end
      else
        Rails.logger.error "Transaction failed with status #{transaction_status}"
        raise "Transaction status is #{transaction_status}"
      end
    end
  end
end
