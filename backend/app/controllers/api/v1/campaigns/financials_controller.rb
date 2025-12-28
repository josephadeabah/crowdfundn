# app/controllers/api/v1/campaigns/financials_controller.rb
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
          
          render json: {
            success: true,
            financials: financials.as_json,
            summary: @campaign.financial_performance_summary
          }
        end
        
        # GET /api/v1/campaigns/:campaign_id/financials/:id
        def show
          financial = @campaign.financial_statements.find(params[:id])
          
          render json: {
            success: true,
            financial: financial.as_json
          }
        end
        
        # POST /api/v1/campaigns/:campaign_id/financials
        def create
          financial = @campaign.financial_statements.new(financial_params)
          financial.published_by = @current_user if params[:status] == 'published'
          
          if financial.save
            render json: {
              success: true,
              financial: financial.as_json
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
              financial: financial.as_json
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
              financial: financial.as_json
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
      end
    end
  end
end