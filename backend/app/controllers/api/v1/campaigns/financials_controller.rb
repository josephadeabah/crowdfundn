module Api
  module V1
    module Campaigns
      class FinancialsController < ApplicationController        
        before_action :authenticate_request
        before_action :set_campaign
        before_action :authorize_fundraiser_or_admin, except: [:index, :show]
        
        # GET /api/v1/campaigns/:campaign_id/financials
        def index
          financials = @campaign.financial_statements
                                .order(period_end: :desc)
          
          if params[:status]
            financials = financials.where(status: params[:status])
          end
          
          # Format financial statements with campaign currency
          formatted_financials = financials.map do |financial|
            financial.as_json.merge(
              formatted_revenue: format_amount(financial.revenue),
              formatted_expenses: format_amount(financial.expenses),
              formatted_gross_profit: format_amount(financial.gross_profit),
              formatted_net_income: format_amount(financial.net_income),
              formatted_assets: financial.assets ? format_amount(financial.assets) : nil,
              formatted_liabilities: financial.liabilities ? format_amount(financial.liabilities) : nil,
              formatted_equity: financial.equity ? format_amount(financial.equity) : nil,
              formatted_cash_flow: financial.cash_flow ? format_amount(financial.cash_flow) : nil,
              formatted_burn_rate: financial.burn_rate ? format_amount(financial.burn_rate) : nil
            )
          end
          
          render json: {
            success: true,
            financials: formatted_financials,
            summary: @campaign.financial_performance_summary,
            campaign_currency: {
              code: @campaign.currency_code,
              symbol: @campaign.currency_symbol,
              name: @campaign.currency
            },
            fundraiser_currency: {
              code: @campaign.fundraiser.currency_code,
              symbol: @campaign.fundraiser.currency_symbol,
              name: @campaign.fundraiser.currency
            }
          }
        end
        
        # GET /api/v1/campaigns/:campaign_id/financials/:id
        def show
          financial = @campaign.financial_statements.find(params[:id])
          
          formatted_financial = financial.as_json.merge(
            formatted_revenue: format_amount(financial.revenue),
            formatted_expenses: format_amount(financial.expenses),
            formatted_gross_profit: format_amount(financial.gross_profit),
            formatted_net_income: format_amount(financial.net_income),
            formatted_assets: financial.assets ? format_amount(financial.assets) : nil,
            formatted_liabilities: financial.liabilities ? format_amount(financial.liabilities) : nil,
            formatted_equity: financial.equity ? format_amount(financial.equity) : nil,
            formatted_cash_flow: financial.cash_flow ? format_amount(financial.cash_flow) : nil,
            formatted_burn_rate: financial.burn_rate ? format_amount(financial.burn_rate) : nil
          )
          
          render json: {
            success: true,
            financial: formatted_financial,
            campaign_currency: {
              code: @campaign.currency_code,
              symbol: @campaign.currency_symbol,
              name: @campaign.currency
            }
          }
        end
        
        # POST /api/v1/campaigns/:campaign_id/financials
        def create
          financial = @campaign.financial_statements.new(financial_params)
          financial.published_by = @current_user if params[:status] == 'published'
          
          if financial.save
            render json: {
              success: true,
              financial: financial.as_json.merge(
                formatted_revenue: format_amount(financial.revenue),
                formatted_expenses: format_amount(financial.expenses),
                formatted_gross_profit: format_amount(financial.gross_profit),
                formatted_net_income: format_amount(financial.net_income)
              ),
              campaign_currency: {
                code: @campaign.currency_code,
                symbol: @campaign.currency_symbol,
                name: @campaign.currency
              }
            }, status: :created
          else
            render json: {
              success: false,
              errors: financial.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # PUT /api/v1/campaigns/:campaign_id/financials/:id
        def update
          financial = @campaign.financial_statements.find(params[:id])
          
          if financial.update(financial_params)
            render json: {
              success: true,
              financial: financial.as_json.merge(
                formatted_revenue: format_amount(financial.revenue),
                formatted_expenses: format_amount(financial.expenses),
                formatted_gross_profit: format_amount(financial.gross_profit),
                formatted_net_income: format_amount(financial.net_income)
              ),
              campaign_currency: {
                code: @campaign.currency_code,
                symbol: @campaign.currency_symbol,
                name: @campaign.currency
              }
            }
          else
            render json: {
              success: false,
              errors: financial.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # DELETE /api/v1/campaigns/:campaign_id/financials/:id
        def destroy
          financial = @campaign.financial_statements.find(params[:id])
          
          if financial.destroy
            render json: {
              success: true,
              message: 'Financial statement deleted'
            }
          else
            render json: {
              success: false,
              errors: financial.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/campaigns/:campaign_id/financials/:id/publish
        def publish
          financial = @campaign.financial_statements.find(params[:id])
          
          if financial.update(status: 'published', published_by: @current_user)
            # Notify investors
            financial.campaign.equity_investments.successful.distinct.pluck(:user_id).each do |user_id|
              user = User.find(user_id)
              InvestorReporting::NotificationService.new(user).notify_financial_statement_published(financial)
            end
            
            render json: {
              success: true,
              financial: financial.as_json.merge(
                formatted_revenue: format_amount(financial.revenue),
                formatted_expenses: format_amount(financial.expenses),
                formatted_gross_profit: format_amount(financial.gross_profit),
                formatted_net_income: format_amount(financial.net_income)
              ),
              campaign_currency: {
                code: @campaign.currency_code,
                symbol: @campaign.currency_symbol,
                name: @campaign.currency
              }
            }
          else
            render json: {
              success: false,
              errors: financial.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/campaigns/:campaign_id/financials/import
        def import
          # Implement CSV/Excel import
          # This is a placeholder for import functionality
          render json: {
            success: false,
            message: 'Import functionality coming soon'
          }, status: :not_implemented
        end
        
        private
        
        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        end
        
        def authorize_fundraiser_or_admin
          unless @current_user.admin? || @campaign.fundraiser == @current_user
            render json: { error: 'Not authorized' }, status: :forbidden
          end
        end
        
        def financial_params
          params.require(:financial).permit(
            :period_type,
            :period_start,
            :period_end,
            :revenue,
            :expenses,
            :gross_profit,
            :net_income,
            :cash_flow,
            :assets,
            :liabilities,
            :equity,
            :burn_rate,
            :runway_months,
            :mrr,
            :arr,
            :customer_acquisition_cost,
            :lifetime_value,
            :churn_rate,
            :gmv,
            :active_customers,
            :average_order_value,
            :status,
            :is_public,
            :source_file
          )
        end
        
        # Helper method to format amounts with campaign currency
        def format_amount(amount)
          return nil if amount.nil?
          "#{@campaign.currency_symbol}#{amount.to_f.round(2)}"
        end
      end
    end
  end
end