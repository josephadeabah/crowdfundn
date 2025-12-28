# app/controllers/api/v1/campaigns/investor_reports_controller.rb
module Api
  module V1
    module Campaigns
      class InvestorReportsController < ApplicationController
        
        before_action :authenticate_request
        before_action :set_campaign
        before_action :authorize_fundraiser_or_admin, except: [:index, :show]
        
        # GET /api/v1/campaigns/:campaign_id/investor_reports
        def index
          reports = @campaign.investor_reports
          
          if params[:report_type]
            reports = reports.where(report_type: params[:report_type])
          end
          
          if params[:status]
            reports = reports.where(status: params[:status])
          end
          
          render json: {
            success: true,
            reports: reports.recent.as_json
          }
        end
        
        # GET /api/v1/campaigns/:campaign_id/investor_reports/:id
        def show
          report = @campaign.investor_reports.find(params[:id])
          
          render json: {
            success: true,
            report: report.as_json(include_documents: true)
          }
        end
        
        # POST /api/v1/campaigns/:campaign_id/investor_reports
        def create
          report = @campaign.investor_reports.new(report_params)
          report.published_by = @current_user if params[:status] == 'published'
          
          if report.save
            render json: {
              success: true,
              report: report.as_json
            }, status: :created
          else
            render json: {
              success: false,
              errors: report.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # PUT /api/v1/campaigns/:campaign_id/investor_reports/:id
        def update
          report = @campaign.investor_reports.find(params[:id])
          
          if report.update(report_params)
            render json: {
              success: true,
              report: report.as_json
            }
          else
            render json: {
              success: false,
              errors: report.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # DELETE /api/v1/campaigns/:campaign_id/investor_reports/:id
        def destroy
          report = @campaign.investor_reports.find(params[:id])
          
          if report.destroy
            render json: {
              success: true,
              message: 'Report deleted'
            }
          else
            render json: {
              success: false,
              errors: report.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/campaigns/:campaign_id/investor_reports/:id/publish
        def publish
          report = @campaign.investor_reports.find(params[:id])
          
          if report.update(status: 'published', published_by: @current_user)
            # Generate PDF and notify investors (handled by callbacks)
            render json: {
              success: true,
              report: report.as_json
            }
          else
            render json: {
              success: false,
              errors: report.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/campaigns/:campaign_id/investor_reports/:id/generate_quarterly
        def generate_quarterly
          report_date = params[:report_date] ? Date.parse(params[:report_date]) : Date.current
          
          if @campaign.is_a?(EquityCampaign)
            report = @campaign.generate_quarterly_report(report_date)
            
            render json: {
              success: true,
              report: report.as_json
            }
          else
            render json: {
              success: false,
              error: 'Only equity campaigns can generate quarterly reports'
            }, status: :unprocessable_entity
          end
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
        
        def report_params
          params.require(:report).permit(
            :report_type,
            :title,
            :executive_summary,
            :key_highlights,
            :challenges_risks,
            :forward_outlook,
            :report_date,
            :period_start,
            :period_end,
            :status,
            :notify_investors,
            attachments: []
          )
        end
      end
    end
  end
end