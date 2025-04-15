# app/controllers/api/v1/equity/equity_investments_controller.rb
module Api
  module V1
    module Equity
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, except: [:portfolio, :my_investments]
        before_action :validate_investor, only: [:create]

        def create
          investment_service = PaystackEquity::InvestmentService.new(@current_user, @campaign)
          result = investment_service.initiate_investment(
            params[:amount],
            investment_metadata
          )

          if result[:success]
            render json: {
              investment: investment_json(result[:investment]),
              authorization_url: result[:authorization_url],
              reference: result[:reference]
            }, status: :created
          else
            render json: { errors: [result[:error]] }, status: :unprocessable_entity
          end
        end

        def callback
          investment_service = PaystackEquity::InvestmentService.new(@current_user, @campaign)
          result = investment_service.verify_investment(params[:reference])

          if result[:success]
            render json: {
              message: 'Investment completed successfully',
              investment: investment_json(result[:investment]),
              shares: result[:shares]
            }, status: :ok
          else
            render json: { error: result[:error] }, status: :unprocessable_entity
          end
        end

        def portfolio
          investments = @current_user.equity_investments
                            .completed
                            .includes(:campaign, :share_certificate)
                            .order(created_at: :desc)

          render json: {
            investments: investments.map { |inv| portfolio_investment_json(inv) },
            summary: portfolio_summary(investments)
          }, status: :ok
        end

        def my_investments
          investments = @current_user.equity_investments
                            .includes(:equity_campaign)
                            .order(created_at: :desc)

          render json: {
            investments: investments.map { |inv| investment_json(inv) }
          }, status: :ok
        end

        private

        def set_campaign
          @campaign = Campaign.find(params[:campaign_id] || params[:id])
          unless @campaign.type == "EquityCampaign"
            render json: { error: 'Not an equity campaign' }, status: :unprocessable_entity
          end
        end

        def validate_investor
          unless @current_user.accredited_investor?
            render json: { error: 'You must be an accredited investor' }, status: :forbidden
          end
        end

        def investment_metadata
          {
            terms_accepted: true,
            investor_ip: request.remote_ip,
            user_agent: request.user_agent,
            additional_params: params[:metadata] || {}
          }
        end

        def investment_json(investment)
          {
            id: investment.id,
            amount: investment.amount,
            share_count: investment.share_count,
            status: investment.status,
            payment_reference: investment.payment_reference,
            campaign: {
              id: investment.campaign.id,
              title: investment.campaign.title,
              valuation: investment.campaign.valuation,
              equity_offered: investment.campaign.equity_offered,
              status: investment.campaign.status,
              end_date: investment.campaign.end_date
            },
            investor: {
              id: investment.user.id,
              name: investment.user.full_name,
              email: investment.user.email
            },
            created_at: investment.created_at,
            completed_at: investment.completed_at,
            metadata: investment.metadata
          }
        end

        def portfolio_investment_json(investment)
          {
            id: investment.id,
            amount: investment.amount,
            shares: investment.share_count,
            percentage_ownership: calculate_ownership_percentage(investment),
            invested_at: investment.created_at,
            campaign: {
              id: investment.campaign.id,
              title: investment.campaign.title,
              valuation: investment.campaign.valuation,
              status: investment.campaign.status,
              end_date: investment.campaign.end_date
            },
            certificate: {
              id: investment.share_certificate&.id,
              number: investment.share_certificate&.certificate_number,
              issued_at: investment.share_certificate&.issued_at
            }
          }
        end

        def portfolio_summary(investments)
          total_invested = investments.sum(&:amount)
          total_shares = investments.sum(&:share_count)
          
          {
            total_investments: investments.count,
            total_invested: total_invested,
            total_shares: total_shares,
            estimated_portfolio_value: calculate_portfolio_value(investments),
            average_ownership: calculate_average_ownership(investments)
          }
        end

        def calculate_ownership_percentage(investment)
          (investment.share_count / (investment.campaign.valuation / investment.campaign.equity_offered * 100)) * 100
        end

        def calculate_portfolio_value(investments)
          investments.sum do |inv|
            campaign = inv.campaign
            (inv.share_count / (campaign.valuation / campaign.equity_offered * 100)) * campaign.valuation
          end
        end

        def calculate_average_ownership(investments)
          return 0 if investments.empty?
          investments.sum { |inv| calculate_ownership_percentage(inv) } / investments.count
        end
      end
    end
  end
end