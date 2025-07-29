# app/controllers/api/v1/fundraisers/equity_investments_controller.rb
module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: [:create, :index, :public_investments]
        
        def index
          investments = @campaign.equity_investments
                                .includes(:user)
                                .order(created_at: :desc)
                                .page(params[:page])
                                .per(params[:per_page] || 10)
          
          render json: {
            investments: investments.as_json(include: :user),
            pagination: pagination_data(investments),
            campaign: campaign_summary
          }, status: :ok
        end
        
        def public_investments
          investments = @campaign.equity_investments.completed
                                .order(created_at: :desc)
          
          investors = investments.map do |investment|
            {
              investor_name: investment.user&.full_name || 'Anonymous',
              amount: investment.amount,
              shares: investment.shares,
              ownership_percentage: investment.percentage,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              certificate_url: investment.certificate_url
            }
          end
          
          paginated_investors = Kaminari.paginate_array(investors)
                                      .page(params[:page])
                                      .per(params[:per_page] || 10)
          
          render json: { 
            investments: paginated_investors, 
            pagination: pagination_data(paginated_investors),
            campaign: campaign_summary
          }, status: :ok
        end
        
        def create
          amount = params[:amount].to_f
          
          validate_investment_amount(amount) or return
          
          ActiveRecord::Base.transaction do
            investment = @campaign.equity_investments.new(
              user: @current_user,
              amount: amount,
              status: :pending
            )
            
            # Calculate shares and percentage before saving
            price_per_share = @campaign.valuation.to_f / @campaign.total_shares.to_f
            investment.shares = (amount / price_per_share).round(2)
            investment.percentage = ((amount / (@campaign.valuation.to_f * @campaign.equity_offered.to_f / 100)) * 100).round(4)
            
            if investment.save
              initialize_payment(investment)
            else
              raise ActiveRecord::Rollback
            end
          end
        rescue => e
          render json: { error: e.message }, status: :unprocessable_entity
        end
        
        def portfolio
          investments = @current_user.equity_investments
                                    .includes(:campaign)
                                    .order(created_at: :desc)
                                    .page(params[:page])
                                    .per(params[:per_page] || 10)

          total_invested = investments.sum(:amount)
          total_current_value = investments.sum(&:current_value)
          total_returns = investments.sum(&:total_returns)

          render json: {
            investments: investments.map { |i| portfolio_investment_json(i) },
            summary: {
              total_investments: @current_user.equity_investments.count,
              total_invested: total_invested.round(2),
              total_current_value: total_current_value.round(2),
              total_returns: total_returns.round(2),
              overall_roi: total_invested.zero? ? 0 : ((total_returns / total_invested) * 100).round(2)
            },
            pagination: pagination_data(investments)
          }, status: :ok
        end

        private
        
        def set_campaign
          @campaign = EquityCampaign.find(params[:campaign_id])
        end
        
        def validate_investment_amount(amount)
          if amount < @campaign.minimum_investment
            render json: { error: "Minimum investment is #{@campaign.currency_symbol}#{@campaign.minimum_investment}" }, 
                   status: :unprocessable_entity
            return false
          end
          
          if amount > @campaign.maximum_investment && @campaign.maximum_investment > 0
            render json: { error: "Maximum investment is #{@campaign.currency_symbol}#{@campaign.maximum_investment}" }, 
                   status: :unprocessable_entity
            return false
          end
          
          if @campaign.shares_available <= 0
            render json: { error: "No shares available for investment" }, 
                   status: :unprocessable_entity
            return false
          end
          
          true
        end
        
        def initialize_payment(investment)
          paystack_service = PaystackService.new
          
          metadata = {
            investment_id: investment.id,
            user_id: @current_user.id,
            campaign_id: @campaign.id,
            shares: investment.shares,
            percentage: investment.percentage,
            type: 'equity_investment'
          }
          
          response = paystack_service.initialize_transaction(
            email: @current_user.email,
            amount: investment.amount * 100,
            callback_url: investment_callback_url(investment),
            metadata: metadata
          )
          
          if response[:status]
            render json: { 
              authorization_url: response[:data][:authorization_url],
              investment: investment.as_json(include: :campaign)
            }, status: :created
          else
            investment.destroy
            render json: { error: response[:message] }, 
                   status: :unprocessable_entity
          end
        end
        
        def investment_callback_url(investment)
          Rails.application.routes.url_helpers.equity_campaign_url(
            investment.campaign.slug || investment.campaign.id,
            host: Rails.application.config.app_domain
          )
        end
        
        def campaign_summary
          {
            total_shares: @campaign.total_shares,
            shares_remaining: @campaign.shares_available,
            equity_offered: @campaign.equity_offered,
            equity_remaining: @campaign.percentage_available,
            valuation: @campaign.valuation,
            currency_symbol: @campaign.currency_symbol
          }
        end
        
       def portfolio_investment_json(investment)
        {
          id: investment.id,
          amount: investment.amount,
          shares: investment.shares,
          percentage: investment.percentage,
          current_value: investment.current_value,
          total_returns: investment.total_returns,
          roi: investment.roi,
          certificate_url: investment.certificate_url,
          last_updated: investment.updated_at,
          campaign: {
            id: investment.campaign.id,
            title: investment.campaign.title,
            valuation: investment.campaign.valuation,
            status: investment.campaign.status,
            last_valuation_change: investment.campaign.updated_at
          }
        }
      end
        
        def pagination_data(paginated_records)
          {
            current_page: paginated_records.current_page,
            total_pages: paginated_records.total_pages,
            per_page: paginated_records.limit_value,
            total_count: paginated_records.total_count
          }
        end
      end
    end
  end
end