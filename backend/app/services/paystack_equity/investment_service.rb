# app/services/paystack_equity/investment_service.rb
module PaystackEquity
  class InvestmentService
    include Rails.application.routes.url_helpers

    def initialize(user, campaign)
      @user = user
      @campaign = campaign
      @paystack = PaystackService.new
    end

    def initiate_investment(amount, metadata = {})
      amount_in_kobo = (amount * 100).to_i
      reference = generate_reference

      investment = EquityInvestment.create!(
        user: @user,
        campaign: @campaign,
        amount: amount,
        status: 'pending',
        payment_reference: reference,
        metadata: metadata
      )

      payload = {
        email: @user.email,
        amount: amount_in_kobo,
        reference: reference,
        callback_url: equity_campaign_investment_callback_url,
        metadata: {
          investment_id: investment.id,
          campaign_id: @campaign.id,
          user_id: @user.id,
          payment_type: 'equity_investment',
          shares: calculate_shares(amount)
        }.merge(metadata)
      }

      response = @paystack.initialize_transaction(payload)

      if response[:status]
        {
          success: true,
          authorization_url: response[:data][:authorization_url],
          reference: reference,
          investment: investment
        }
      else
        investment.update!(status: 'failed', failure_reason: response[:message])
        {
          success: false,
          error: response[:message],
          investment: investment
        }
      end
    end

    def verify_investment(reference)
      verification = @paystack.verify_transaction(reference)

      if verification[:status] && verification[:data][:status] == 'success'
        amount = verification[:data][:amount] / 100.0
        investment = EquityInvestment.find_by!(payment_reference: reference)

        ActiveRecord::Base.transaction do
          investment.update!(
            status: 'completed',
            amount: amount,
            paystack_data: verification[:data],
            completed_at: Time.current
          )
          
          @campaign.increment!(:current_amount, amount)
        end

        send_confirmation_emails(investment)
        
        {
          success: true,
          investment: investment,
          shares: calculate_shares(amount)
        }
      else
        {
          success: false,
          error: verification[:message] || 'Payment verification failed'
        }
      end
    end

    private

    price_per_share = @campaign.valuation / @campaign.total_shares

    number_of_shares = amount / price_per_share


    def calculate_shares(amount)
      price_per_share = @campaign.valuation / @campaign.total_shares.to_f
      (amount / price_per_share).round(2)
    end

    def calculate_equity_percentage(amount)
      ((amount.to_f / @campaign.valuation) * 100).round(2)
    end
    
    

    def generate_reference
      "EQUITY-#{@campaign.id}-#{SecureRandom.hex(4)}-#{Time.now.to_i}"
    end

    def equity_campaign_investment_callback_url
      api_v1_equity_equity_investment_callback_url(
        host: Rails.application.config.action_mailer.default_url_options[:host]
      )
    end

    def send_confirmation_emails(investment)
      EquityInvestmentMailer.investor_confirmation(investment).deliver_later
      EquityInvestmentMailer.campaign_owner_notification(investment).deliver_later
    end
  end
end