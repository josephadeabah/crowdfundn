# app/controllers/api/v1/campaigns/kpis_controller.rb
module Api
  module V1
    module Campaigns
      class KpisController < ApplicationController
        
        before_action :authenticate_request
        before_action :set_campaign
        before_action :authorize_fundraiser_or_admin, except: [:index, :show]
        
        # GET /api/v1/campaigns/:campaign_id/kpis
        def index
          kpis = @campaign.campaign_kpis
          
          if params[:kpi_type]
            kpis = kpis.where(kpi_type: params[:kpi_type])
          end
          
          if params[:is_primary]
            kpis = kpis.where(is_primary: params[:is_primary])
          end
          
          render json: {
            success: true,
            kpis: kpis.ordered.as_json,
            dashboard: @campaign.kpi_dashboard
          }
        rescue => e
          render json: {
            success: false,
            error: e.message
          }, status: :internal_server_error
        end
        
        # GET /api/v1/campaigns/:campaign_id/kpis/:id
        def show
          kpi = @campaign.campaign_kpis.find(params[:id])
          
          render json: {
            success: true,
            kpi: kpi.as_json(include_values: true)
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'KPI not found' }, status: :not_found
        end
        
        # POST /api/v1/campaigns/:campaign_id/kpis
        def create
          kpi = @campaign.campaign_kpis.new(kpi_params)
          
          if kpi.save
            render json: {
              success: true,
              kpi: kpi.as_json
            }, status: :created
          else
            render json: {
              success: false,
              errors: kpi.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # PUT /api/v1/campaigns/:campaign_id/kpis/:id
        def update
          kpi = @campaign.campaign_kpis.find(params[:id])
          
          if kpi.update(kpi_params)
            render json: {
              success: true,
              kpi: kpi.as_json
            }
          else
            render json: {
              success: false,
              errors: kpi.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # DELETE /api/v1/campaigns/:campaign_id/kpis/:id
        def destroy
          kpi = @campaign.campaign_kpis.find(params[:id])
          
          if kpi.destroy
            render json: {
              success: true,
              message: 'KPI deleted'
            }
          else
            render json: {
              success: false,
              errors: kpi.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/campaigns/:campaign_id/kpis/:id/add_value
        def add_value
          kpi = @campaign.campaign_kpis.find(params[:id])
          
          value = kpi.kpi_values.new(kpi_value_params)
          
          if value.save
            render json: {
              success: true,
              value: value.as_json
            }, status: :created
          else
            render json: {
              success: false,
              errors: value.errors.full_messages
            }, status: :unprocessable_entity
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'KPI not found' }, status: :not_found
        end
        
        # GET /api/v1/campaigns/:campaign_id/kpis/:id/values
        def values
          kpi = @campaign.campaign_kpis.find(params[:id])
          period_start = params[:period_start] ? Date.parse(params[:period_start]) : 90.days.ago
          period_end = params[:period_end] ? Date.parse(params[:period_end]) : Date.current
          
          values = kpi.kpi_values.where(period_date: period_start..period_end)
                       .order(period_date: :asc)
          
          render json: {
            success: true,
            values: values.as_json,
            trend: values.pluck(:period_date, :value).to_h
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'KPI not found' }, status: :not_found
        rescue ArgumentError
          render json: { error: 'Invalid date format' }, status: :bad_request
        end
        
        private
        
        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        end
        
        def authorize_fundraiser_or_admin
          unless @current_user.admin? || @campaign.fundraiser == @current_user
            render json: { error: 'Not authorized' }, status: :forbidden
          end
        end
        
        def kpi_params
          params.require(:kpi).permit(
            :kpi_type,
            :name,
            :description,
            :unit,
            :target_value,
            :target_period,
            :is_primary,
            :is_public,
            :display_order,
            calculation_config: {}
          )
        end
        
        def kpi_value_params
          params.require(:value).permit(
            :period_date,
            :value,
            :is_actual,
            :data_source,
            :financial_statement_id
          )
        end
      end
    end
  end
end