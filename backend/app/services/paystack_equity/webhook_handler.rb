# app/services/paystack_equity/webhook_handler.rb
module PaystackEquity
  class WebhookHandler
    def initialize(event_data)
      @data = event_data
      @paystack = PaystackService.new
    end

    def handle_charge_success
      metadata = @data[:metadata]
      return unless metadata && metadata[:investment_id]

      investment = EquityInvestment.find_by(id: metadata[:investment_id])
      return unless investment

      verification = @paystack.verify_transaction(@data[:reference])
      return unless verification[:status] && verification[:data][:status] == 'success'

      amount = verification[:data][:amount] / 100.0

      ActiveRecord::Base.transaction do
        investment.update!(
          status: 'completed',
          amount: amount,
          paystack_data: verification[:data],
          completed_at: Time.current
        )

        campaign = investment.equity_campaign
        campaign.increment!(:current_amount, amount)

        create_share_certificate(investment)
      end

      send_notifications(investment)
    end

    def handle_transfer_success
      transfer = @data
      metadata = transfer[:metadata]
      return unless metadata && metadata[:campaign_id]

      campaign = Campaign.find_by(id: metadata[:campaign_id])
      return unless campaign

      campaign.update!(
        last_transfer_amount: transfer[:amount] / 100.0,
        last_transfer_date: transfer[:createdAt],
        transfer_reference: transfer[:reference]
      )

      EquityCampaignMailer.transfer_notification(campaign, transfer).deliver_later
    end

    private

    def create_share_certificate(investment)
      ShareCertificate.create!(
        equity_investment: investment,
        user: investment.user,
        campaign: investment.campaign,
        shares: investment.share_count,
        certificate_number: "SH-#{Time.now.year}-#{SecureRandom.alphanumeric(8).upcase}",
        issued_at: Time.current
      )
    end

    def send_notifications(investment)
      EquityInvestmentMailer.investment_completed(investment).deliver_later
      EquityCampaignMailer.new_investment_notification(investment).deliver_later
      AdminMailer.new_equity_investment(investment).deliver_later
    end
  end
end