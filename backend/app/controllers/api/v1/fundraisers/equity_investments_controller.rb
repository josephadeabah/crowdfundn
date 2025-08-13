module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: %i[create index public_investments]

        def create
          validate_investment_params or return
          validate_investment_amount or return
          validate_shares_available or return

          subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)
          return render_subaccount_error unless valid_subaccount?(subaccount)

          investment = initialize_investment(subaccount)
          return render_investment_error(investment) unless investment.save

          response = initialize_payment(investment, subaccount.subaccount_code)
          handle_payment_response(response, investment)
        end

        private

        def initialize_investment(subaccount)
          @campaign.donations.new(
            type: 'EquityInvestment',
            user: @current_user,
            amount: equity_investment_params[:amount].to_f,
            status: 'pending',
            metadata: build_metadata,
            email: equity_investment_params[:email] || @current_user.email,
            phone: equity_investment_params[:phone],
            full_name: equity_investment_params[:full_name] || @current_user.full_name
          ).tap do |inv|
            calculate_shares_and_percentage(inv)
          end
        end

        def calculate_shares_and_percentage(investment)
          total_equity_value = (@campaign.valuation.to_f * @campaign.equity_offered.to_f / 100)
          investment.percentage = ((investment.amount / total_equity_value) * 100).round(8)
          total_available_shares = (@campaign.equity_offered.to_f / 100) * @campaign.total_shares.to_f
          investment.shares = (investment.percentage / 100 * total_available_shares).round(4)
        end

        def build_metadata
          {
            type: 'equity_investment',
            user_id: @current_user.id,
            campaign_id: @campaign.id,
            redirect_url: generate_redirect_url,
            title: @campaign.title,
            currency: @campaign.currency,
            valuation: @campaign.valuation,
            equity_offered: @campaign.equity_offered
          }
        end

        def initialize_payment(investment, subaccount_code)
          PaystackService.new.initialize_transaction(
            email: investment.email,
            amount: investment.amount * 100,
            callback_url: generate_redirect_url,
            metadata: investment.metadata,
            subaccount: subaccount_code
          )
        end

        def handle_payment_response(response, investment)
          if response[:status]
            investment.update(transaction_reference: response[:data][:reference])
            render json: payment_success_response(response, investment), status: :created
          else
            render json: { error: response[:message] }, status: :unprocessable_entity
          end
        end

        def payment_success_response(response, investment)
          {
            authorization_url: response[:data][:authorization_url],
            redirect_url: generate_redirect_url,
            investment: {
              id: investment.id,
              amount: investment.amount,
              shares: investment.shares,
              percentage: investment.percentage
            }
          }
        end

        def generate_redirect_url
          "#{Rails.application.routes.url_helpers.campaign_url(@campaign.slug || @campaign.id, host: Rails.application.config.app_domain)}?#{SecureRandom.uuid}"
        end

        def validate_investment_params
          if equity_investment_params[:amount].blank?
            render json: { error: 'Investment amount is required' }, status: :unprocessable_entity
            return false
          end
          true
        end

        def validate_investment_amount
          amount = equity_investment_params[:amount].to_f
          if amount <= 0
            render json: { error: 'Investment amount must be positive' }, status: :unprocessable_entity
            return false
          end
          if amount < @campaign.minimum_investment
            render json: { error: "Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}" }, 
                   status: :unprocessable_entity
            return false
          end
          if @campaign.maximum_investment > 0 && amount > @campaign.maximum_investment
            render json: { error: "Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}" }, 
                   status: :unprocessable_entity
            return false
          end
          true
        end

        def validate_shares_available
          if @campaign.shares_available <= 0
            render json: { error: 'No shares currently available for investment' }, 
                   status: :unprocessable_entity
            return false
          end
          true
        end

        def render_subaccount_error
          render json: { error: 'Fundraiser payment setup incomplete' }, status: :unprocessable_entity
        end

        def render_investment_error(investment)
          render json: { error: investment.errors.full_messages.join(', ') }, 
                 status: :unprocessable_entity
        end

        def valid_subaccount?(subaccount)
          subaccount&.subaccount_code.present?
        end

        def equity_investment_params
          params.require(:equity_investment).permit(
            :amount, :email, :phone, :full_name
          )
        end

        def set_campaign
          @campaign = Campaign.find_by(id: params[:campaign_id])
          render json: { error: 'Campaign not found' }, status: :not_found unless @campaign
        end
      end
    end
  end
end