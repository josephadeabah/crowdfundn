# app/controllers/api/v1/fundraisers/equity_investments_controller.rb
module Api
  module V1
    module Fundraisers
      class EquityInvestmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: %i[create index public_investments]

        def index
          investments = @campaign.equity_investments
                                 .includes(:user, :reward)
                                 .order(created_at: :desc)
                                 .page(params[:page])
                                 .per(params[:per_page] || 10)

          render json: {
            investments: investments.as_json(include: %i[user reward]),
            pagination: pagination_data(investments),
            campaign: campaign_summary
          }, status: :ok
        end

        def public_investments
          investments = @campaign.equity_investments.success
                                 .order(created_at: :desc)

          investors = investments.map do |investment|
            {
              investor_name: investment.user&.full_name || 'Anonymous',
              amount: investment.amount,
              shares: investment.shares,
              ownership_percentage: investment.percentage,
              date: investment.created_at.strftime('%Y-%m-%d %H:%M:%S'),
              certificate_url: investment.certificate_url,
              reward: investment.reward&.as_json(only: %i[title description delivery_date])
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
          # Use strong parameters
          investment_params = equity_investment_params
          amount = investment_params[:amount].to_f
          reward_id = investment_params[:reward_id]

          validate_investment_amount(amount) or return

          ActiveRecord::Base.transaction do
            investment = @campaign.equity_investments.new(
              user: @current_user,
              amount: amount,
              reward_id: reward_id,
              status: :pending,
              metadata: investment_params[:metadata] || {} # Include metadata from frontend
            )

            raise ActiveRecord::Rollback, investment.errors.full_messages.join(', ') unless investment.save

            # Generate secure callback URL with UUID
            secure_uuid = SecureRandom.uuid
            campaign_identifier = @campaign.slug || @campaign.id
            redirect_url = Rails.application.routes.url_helpers.campaign_url(
              campaign_identifier,
              host: Rails.application.config.app_domain
            ) + "?#{secure_uuid}"

            # Build metadata combining frontend data and system data
            metadata = {
              # Frontend-provided metadata
              **investment.metadata,

              # System-generated metadata
              user_id: @current_user.id,
              campaign_id: @campaign.id,
              investment_id: investment.id,
              shares: investment.shares,
              percentage: investment.percentage,
              type: 'equity_investment',
              redirect_url: redirect_url,

              # Campaign details
              title: @campaign.title,
              currency: @campaign.currency,
              currency_symbol: @campaign.currency_symbol,
              valuation: @campaign.valuation,
              equity_offered: @campaign.equity_offered,

              # Investor details
              investor_name: @current_user.full_name,
              investor_email: @current_user.email,

              # Reward info if present
              reward: if reward_id
                        {
                          id: reward_id,
                          title: investment.reward&.title,
                          description: investment.reward&.description,
                          delivery_date: investment.reward&.delivery_date
                        }
                      end
            }

            initialize_payment(investment, metadata, redirect_url)
          end
        rescue StandardError => e
          render json: { error: e.message }, status: :unprocessable_entity
        end

        def my_investments
          investments = @current_user.equity_investments
                                    .includes(:campaign, :reward)
                                    .order(created_at: :desc)
                                    .page(params[:page])
                                    .per(params[:per_page] || 10)

          render json: {
            investments: investments.map { |i| my_investment_json(i) },
            pagination: pagination_data(investments),
            summary: {
              total_invested: investments.sum(:amount),
              total_campaigns: investments.distinct.count(:campaign_id)
            }
          }, status: :ok
        end

        def portfolio
          investments = @current_user.equity_investments
                                     .includes(:campaign, :reward)
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

        def equity_investment_params
          params.require(:equity_investment).permit(
            :amount,
            :reward_id,
            :email,
            :phone,
            :full_name,
            :ip_address,
            :country,
            metadata: {}
          )
        end

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
            render json: { error: 'No shares available for investment' },
                   status: :unprocessable_entity
            return false
          end

          true
        end

        def initialize_payment(investment, metadata, redirect_url)
          subaccount = Subaccount.find_by(user_id: @campaign.fundraiser_id)

          unless subaccount&.subaccount_code.present?
            render json: { error: 'Fundraiser does not meet requirements for raising funds' },
                   status: :unprocessable_entity
            return
          end

          paystack_service = PaystackService.new

          response = paystack_service.initialize_transaction(
            email: @current_user.email,
            amount: investment.amount * 100,
            callback_url: redirect_url,
            metadata: metadata,
            subaccount: subaccount.subaccount_code
          )

          if response[:status]
            investment.update(
              transaction_reference: response[:data][:reference],
              metadata: metadata # Store complete metadata
            )

            render json: {
              authorization_url: response[:data][:authorization_url],
              redirect_url: redirect_url,
              investment: {
                id: investment.id,
                amount: investment.amount,
                shares: investment.shares,
                percentage: investment.percentage,
                campaign: {
                  id: @campaign.id,
                  title: @campaign.title
                }
              },
              total_investors: @campaign.total_investors
            }, status: :created
          else
            investment.update(status: :failed)
            render json: { error: response[:message] },
                   status: :unprocessable_entity
          end
        end

        def investment_callback_url(investment)
          Rails.application.routes.url_helpers.campaign_url(
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
            currency_symbol: @campaign.currency_symbol,
            rewards: @campaign.rewards.available.as_json(only: %i[id title description amount delivery_date])
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
            status: investment.status,
            reward: investment.reward&.as_json(only: %i[title description delivery_date]),
            campaign: {
              id: investment.campaign.id,
              title: investment.campaign.title,
              valuation: investment.campaign.valuation,
              status: investment.campaign.status,
              last_valuation_change: investment.campaign.updated_at
            }
          }
        end

        def my_investment_json(investment)
          {
            id: investment.id,
            amount: investment.amount,
            shares: investment.shares,
            percentage: investment.percentage,
            status: investment.status,
            created_at: investment.created_at,
            campaign: {
              id: investment.campaign.id,
              title: investment.campaign.title,
              valuation: investment.campaign.valuation,
              status: investment.campaign.status,
              image_url: investment.campaign.image_url
            },
            reward: investment.reward&.as_json(only: %i[title description delivery_date]),
            certificate_url: investment.certificate_url
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