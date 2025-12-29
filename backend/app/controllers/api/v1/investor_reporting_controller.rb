# app/controllers/api/v1/investor/investor_reporting_controller.rb
module Api
  module V1
    module Investor
      class InvestorReportingController < ApplicationController
        
        before_action :authenticate_request
        before_action :authorize_investor, except: [:campaign_financials, :campaign_kpis, :campaign_reports]
        
        # GET /api/v1/investor/portfolio
        def portfolio
          calculator = InvestorReporting::PortfolioCalculator.new(@current_user)
          portfolio_data = calculator.calculate_detailed_portfolio
          
          render json: {
            success: true,
            portfolio: portfolio_data
          }
        end
        
        # GET /api/v1/investor/portfolio/statement
        def portfolio_statement
          period = params[:period] || Date.current
          
          generator = InvestorReporting::DocumentGenerator.new
          pdf = generator.generate_portfolio_statement(@current_user, period)
          
          send_data pdf.render, 
                    filename: "portfolio_statement_#{@current_user.id}_#{Time.current.to_i}.pdf",
                    type: 'application/pdf',
                    disposition: 'inline'
        rescue => e
          render json: {
            success: false,
            error: "Failed to generate statement: #{e.message}"
          }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/metrics
        def metrics
          metrics = InvestorPortfolioMetric.for_user(@current_user.id)
                                           .recent(30)
                                           .order(calculation_date: :asc)
          
          render json: {
            success: true,
            metrics: metrics.as_json,
            current: InvestorPortfolioMetric.calculate_for_user(@current_user.id)&.as_json
          }
        rescue => e
          render json: {
            success: false,
            error: e.message
          }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/campaigns/:campaign_id/financials
        def campaign_financials
          campaign = Campaign.find(params[:campaign_id])
          
          # Check if user is investor or has access
          unless @current_user.admin? || campaign.equity_investments.successful.exists?(user: @current_user)
            return render json: { error: 'Not authorized' }, status: :forbidden
          end
          
          financials = campaign.financial_statements.published.recent_first
          periods = params[:periods] || 12
          
          render json: {
            success: true,
            financials: financials.limit(periods).as_json,
            summary: campaign.financial_performance_summary(4)
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/campaigns/:campaign_id/kpis
        def campaign_kpis
          campaign = Campaign.find(params[:campaign_id])
          
          # Check if user is investor or has access
          unless @current_user.admin? || campaign.equity_investments.successful.exists?(user: @current_user)
            return render json: { error: 'Not authorized' }, status: :forbidden
          end
          
          render json: {
            success: true,
            kpis: campaign.kpi_dashboard
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/campaigns/:campaign_id/reports
        def campaign_reports
          campaign = Campaign.find(params[:campaign_id])
          
          # Check if user is investor or has access
          unless @current_user.admin? || campaign.equity_investments.successful.exists?(user: @current_user)
            return render json: { error: 'Not authorized' }, status: :forbidden
          end
          
          reports = campaign.investor_reports.published.recent
          
          render json: {
            success: true,
            reports: reports.as_json
          }
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Campaign not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/notifications/preferences
        def notification_preferences
          preferences = NotificationPreference.defaults_for_user(@current_user)
          
          render json: {
            success: true,
            preferences: preferences.as_json
          }
        rescue => e
          render json: {
            success: false,
            error: e.message
          }, status: :internal_server_error
        end
        
        # PUT /api/v1/investor/notifications/preferences
        def update_notification_preferences
          preferences = NotificationPreference.defaults_for_user(@current_user)
          
          if preferences.update(notification_preferences_params)
            render json: {
              success: true,
              preferences: preferences.as_json
            }
          else
            render json: {
              success: false,
              errors: preferences.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
        
        # POST /api/v1/investor/documents/:id/download
        def download_document
          document = InvestorReportDocument.find(params[:id])
          
          # Check if user has access
          unless document.investor_report.campaign.equity_investments.successful.exists?(user: @current_user)
            return render json: { error: 'Not authorized' }, status: :forbidden
          end
          
          if document.file.attached?
            document.increment_download_count!
            
            if Rails.env.development?
              # For development, serve directly
              redirect_to rails_blob_url(document.file), allow_other_host: true
            else
              # For production, use the pre-signed URL
              redirect_to document.file_url, allow_other_host: true
            end
          else
            render json: { error: 'File not found' }, status: :not_found
          end
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Document not found' }, status: :not_found
        rescue => e
          render json: { error: e.message }, status: :internal_server_error
        end
        
        private
        
        def authorize_investor
          unless @current_user.investor?
            render json: { error: 'Investor access required' }, status: :forbidden
          end
        end
        
        def notification_preferences_params
          params.require(:preferences).permit(
            :financial_statements,
            :valuation_updates,
            :monthly_reports,
            :quarterly_reports,
            :annual_reports,
            :campaign_updates,
            :portfolio_updates,
            :email_notifications,
            :push_notifications,
            :in_app_notifications,
            :summary_frequency,
            :preferred_time
          )
        end
      end
    end
  end
end