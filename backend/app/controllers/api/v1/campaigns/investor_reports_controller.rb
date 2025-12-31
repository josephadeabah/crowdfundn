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
        rescue => e
          render json: {
            success: false,
            error: e.message
          }, status: :internal_server_error
        end
        
        # GET /api/v1/campaigns/:campaign_id/investor_reports/:id
        def show
          report = @campaign.investor_reports.find(params[:id])
          
          render json: {
            success: true,
            report: report.as_json(include_documents: true)
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Report not found' }, status: :not_found
        end
        
        # POST /api/v1/campaigns/:campaign_id/investor_reports
        def create
          report = @campaign.investor_reports.new(report_params.except(:attachments))
          report.published_by = @current_user if params[:status] == 'published'
          
          if report.save
            # Attach uploaded files
            if params[:report][:attachments].present?
              params[:report][:attachments].each do |attachment|
                report.attachments.attach(attachment)
              end
            end
            
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
          
          if report.update(report_params.except(:attachments))
            # Attach uploaded files
            if params[:report][:attachments].present?
              params[:report][:attachments].each do |attachment|
                report.attachments.attach(attachment)
              end
            end
            
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
            # Trigger notification job which will send emails
            report.notify_investors_on_publish
            
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
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Report not found' }, status: :not_found
        end
        
        # POST  /api/v1/campaigns/:campaign_id/investor_reports/generate_quarterly
        def generate_quarterly
          # Debug logging
          Rails.logger.info "=== GENERATE QUARTERLY REPORT ==="
          Rails.logger.info "All params received: #{params.inspect}"
          Rails.logger.info "Current User ID: #{@current_user.id}"
          Rails.logger.info "Campaign ID from params: #{params[:campaign_id]}"
          
          # Get report_date from params - handle both nested and top-level formats
          report_date_param = params[:report_date] || params.dig(:investor_report, :report_date)
          
          report_date = if report_date_param.present?
            begin
              Date.parse(report_date_param.to_s)
            rescue ArgumentError
              Date.current
            end
          else
            Date.current
          end
          
          Rails.logger.info "Using report date: #{report_date}"
          Rails.logger.info "Campaign ID: #{@campaign.id}"
          Rails.logger.info "Campaign Title: #{@campaign.title}"
          Rails.logger.info "Campaign Fundraiser ID: #{@campaign.fundraiser_id}"
          
          # Check if we're generating for a specific report (member route) or creating new (collection route)
          if params[:id]
            # Member route - update existing report
            report = @campaign.investor_reports.find(params[:id])
            if report.update(report_type: 'quarterly', report_date: report_date)
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
          else
            # Collection route - create new quarterly report
            begin
              # Log what method we're calling
              Rails.logger.info "Calling generate_quarterly_report on campaign #{@campaign.id}"
              
              # Use the generate_quarterly_report method which now exists in both Campaign and EquityCampaign
              if @campaign.respond_to?(:generate_quarterly_report)
                report = @campaign.generate_quarterly_report(report_date)
                
                if report.persisted?
                  Rails.logger.info "Successfully generated report ID: #{report.id}"
                  
                  # If report is published, notify investors
                  if report.status == 'published' && report.notify_investors?
                    report.notify_investors_on_publish
                  end
                  
                  render json: {
                    success: true,
                    report: report.as_json
                  }
                else
                  Rails.logger.error "Failed to generate report: #{report.errors.full_messages}"
                  render json: {
                    success: false,
                    errors: report.errors.full_messages
                  }, status: :unprocessable_entity
                end
              else
                # Fallback - create basic quarterly report
                quarter = ((report_date.month - 1) / 3) + 1
                year = report_date.year
                quarter_start_month = (quarter - 1) * 3 + 1
                period_start = Date.new(year, quarter_start_month, 1)
                period_end = period_start.end_of_quarter
                
                report = @campaign.investor_reports.create!(
                  report_type: 'quarterly',
                  title: "Q#{quarter} #{year} Quarterly Report - #{@campaign.title}",
                  report_date: report_date,
                  period_start: period_start,
                  period_end: period_end,
                  status: 'draft',
                  notify_investors: false,
                  executive_summary: "Quarterly financial report for Q#{quarter} #{year}."
                )
                
                render json: {
                  success: true,
                  report: report.as_json
                }
              end
            rescue => e
              Rails.logger.error "Error generating quarterly report: #{e.message}"
              Rails.logger.error e.backtrace.join("\n")
              
              render json: {
                success: false,
                error: "Failed to generate quarterly report: #{e.message}"
              }, status: :internal_server_error
            end
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Report not found' }, status: :not_found
        end
        
        # POST /api/v1/campaigns/:campaign_id/investor_reports/:id/upload_attachments
        def upload_attachments
          report = @campaign.investor_reports.find(params[:id])
          
          if params[:attachments].present?
            params[:attachments].each do |attachment|
              report.attachments.attach(attachment)
            end
            
            render json: {
              success: true,
              message: 'Attachments uploaded successfully',
              attachments: report.attachments_urls
            }
          else
            render json: {
              success: false,
              error: 'No attachments provided'
            }, status: :bad_request
          end
        end
        
        private
        
        def set_campaign
          # Find campaign that belongs to the current user
          @campaign = @current_user.campaigns.find(params[:campaign_id])
        rescue ActiveRecord::RecordNotFound
          Rails.logger.error "Campaign not found or not owned by user #{@current_user.id}: #{params[:campaign_id]}"
          render json: { 
            success: false,
            error: 'Campaign not found or you do not have permission to access it' 
          }, status: :not_found
        end
        
        def authorize_fundraiser_or_admin
          # This is already covered by set_campaign which only finds user's campaigns
          # But keep it for additional security
          unless @current_user.admin? || @campaign.fundraiser == @current_user
            Rails.logger.error "User #{@current_user.id} not authorized for campaign #{@campaign.id}"
            render json: { 
              success: false,
              error: 'Not authorized to manage this campaign' 
            }, status: :forbidden
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
            attachments: []  # Allow array of files
          )
        end
      end
    end
  end
end