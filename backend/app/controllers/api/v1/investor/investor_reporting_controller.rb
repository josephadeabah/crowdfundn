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
          period = params[:period] || 'current'
          format = params[:format] || 'pdf'
          include_sections = params[:include_sections] || ['summary', 'performance', 'campaigns']
          
          generator = InvestorReporting::DocumentGenerator.new
          
          if format == 'pdf'
            begin
              pdf = generator.generate_portfolio_statement(@current_user, period)
              
              send_data pdf.render, 
                        filename: "portfolio_statement_#{@current_user.id}_#{Time.current.to_i}.pdf",
                        type: 'application/pdf',
                        disposition: 'attachment'
            rescue => e
              Rails.logger.error "Failed to generate PDF: #{e.message}"
              render json: {
                success: false,
                error: "Failed to generate PDF statement: #{e.message}"
              }, status: :internal_server_error
            end
          else
            # For non-PDF formats, return JSON data
            begin
              calculator = InvestorReporting::PortfolioCalculator.new(@current_user)
              portfolio_data = calculator.calculate_detailed_portfolio
              
              # Filter data based on requested sections
              filtered_data = {}
              filtered_data[:summary] = portfolio_data[:summary] if include_sections.include?('summary')
              filtered_data[:by_campaign] = portfolio_data[:by_campaign] if include_sections.include?('campaigns')
              filtered_data[:performance_metrics] = portfolio_data[:performance_metrics] if include_sections.include?('performance')
              filtered_data[:risk_analysis] = portfolio_data[:risk_analysis] if include_sections.include?('risk')
              filtered_data[:cash_flow] = portfolio_data[:cash_flow] if include_sections.include?('cashflow')
              filtered_data[:projections] = portfolio_data[:projections] if include_sections.include?('projections')
              
              if format == 'json'
                render json: {
                  success: true,
                  statement: filtered_data,
                  period: period,
                  generated_at: Time.current,
                  user: {
                    id: @current_user.id,
                    name: @current_user.full_name,
                    email: @current_user.email
                  }
                }
              elsif format == 'csv'
                csv_data = generate_csv(filtered_data)
                send_data csv_data,
                          filename: "portfolio_statement_#{@current_user.id}_#{Time.current.to_i}.csv",
                          type: 'text/csv',
                          disposition: 'attachment'
              else
                render json: {
                  success: false,
                  error: "Unsupported format: #{format}. Supported formats: pdf, json, csv"
                }, status: :bad_request
              end
            rescue => e
              Rails.logger.error "Failed to generate #{format}: #{e.message}"
              render json: {
                success: false,
                error: "Failed to generate statement: #{e.message}"
              }, status: :internal_server_error
            end
          end
        end
        
        # POST /api/v1/investor/portfolio/statement (for email delivery or storage)
        def generate_portfolio_statement
          # Check both top-level and nested params
          period = params[:period] || params.dig(:investor_reporting, :period) || 'current'
          format = params[:format] || params.dig(:investor_reporting, :format) || 'pdf'
          include_sections = params[:include_sections] || params.dig(:investor_reporting, :include_sections) || ['summary', 'performance', 'campaigns']
          
          # Log the format for debugging
          Rails.logger.info "Generating portfolio statement with format: #{format}"
          
          generator = InvestorReporting::DocumentGenerator.new
          
          if format == 'pdf'
            pdf = generator.generate_portfolio_statement(@current_user, period)
            
            # Create a temp file and return download URL
            filename = "portfolio_statement_#{@current_user.id}_#{Time.current.to_i}.pdf"
            
            begin
              # Store in ActiveStorage temporarily
              blob = ActiveStorage::Blob.create_and_upload!(
                io: StringIO.new(pdf.render),
                filename: filename,
                content_type: 'application/pdf'
              )
              
              # Make it expire after 24 hours
              blob.update(expires_at: 24.hours.from_now) if blob.persisted?
              
              render json: {
                success: true,
                download_url: rails_blob_url(blob),
                filename: filename,
                generated_at: Time.current,
                expires_at: 24.hours.from_now
              }
            rescue => e
              Rails.logger.error "Failed to create blob: #{e.message}"
              # Fallback: return the PDF directly
              send_data pdf.render, 
                        filename: filename,
                        type: 'application/pdf',
                        disposition: 'attachment'
            end
          else
            # For other formats, generate and return as attachment
            calculator = InvestorReporting::PortfolioCalculator.new(@current_user)
            portfolio_data = calculator.calculate_detailed_portfolio
            
            # Prepare data based on requested sections
            export_data = {}
            export_data[:summary] = portfolio_data[:summary] if include_sections.include?('summary')
            export_data[:campaigns] = portfolio_data[:by_campaign] if include_sections.include?('campaigns')
            export_data[:performance] = portfolio_data[:performance_metrics] if include_sections.include?('performance')
            export_data[:risk] = portfolio_data[:risk_analysis] if include_sections.include?('risk')
            export_data[:cash_flow] = portfolio_data[:cash_flow] if include_sections.include?('cashflow')
            export_data[:projections] = portfolio_data[:projections] if include_sections.include?('projections')
            
            filename = "portfolio_statement_#{@current_user.id}_#{Time.current.to_i}"
            
            begin
              if format == 'json'
                json_data = JSON.pretty_generate(export_data)
                blob = ActiveStorage::Blob.create_and_upload!(
                  io: StringIO.new(json_data),
                  filename: "#{filename}.json",
                  content_type: 'application/json'
                )
              elsif format == 'csv'
                csv_data = generate_csv(export_data)
                blob = ActiveStorage::Blob.create_and_upload!(
                  io: StringIO.new(csv_data),
                  filename: "#{filename}.csv",
                  content_type: 'text/csv'
                )
              else
                render json: {
                  success: false,
                  error: "Unsupported format: #{format}. Supported formats: pdf, json, csv"
                }, status: :bad_request
                return
              end
              
              if blob && blob.persisted?
                blob.update(expires_at: 24.hours.from_now)
                
                render json: {
                  success: true,
                  download_url: rails_blob_url(blob),
                  filename: blob.filename.to_s,
                  generated_at: Time.current,
                  expires_at: 24.hours.from_now
                }
              else
                # Fallback to direct download
                send_fallback_download(format, export_data, filename)
              end
            rescue => e
              Rails.logger.error "Failed to generate #{format}: #{e.message}"
              send_fallback_download(format, export_data, filename)
            end
          end
        rescue => e
          Rails.logger.error "Error in generate_portfolio_statement: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          
          render json: {
            success: false,
            error: "Failed to generate statement: #{e.message}"
          }, status: :internal_server_error
        end
        
        # GET /api/v1/investor/portfolio/statements/history
        def statement_history
          # Since we're not storing portfolio statements permanently,
          # we can return empty array or track via user activity
          
          # Option 1: Return empty (simplest)
          render json: {
            success: true,
            statements: []
          }
        end
        
        # GET /api/v1/investor/metrics
        def metrics
          period = params[:period] || 'all'
          
          metrics_query = InvestorPortfolioMetric.for_user(@current_user.id)
          
          case period
          when '7d'
            start_date = 7.days.ago.to_date
            metrics_query = metrics_query.where('calculation_date >= ?', start_date)
          when '30d'
            start_date = 30.days.ago.to_date
            metrics_query = metrics_query.where('calculation_date >= ?', start_date)
          when '90d'
            start_date = 90.days.ago.to_date
            metrics_query = metrics_query.where('calculation_date >= ?', start_date)
          when '1y'
            start_date = 1.year.ago.to_date
            metrics_query = metrics_query.where('calculation_date >= ?', start_date)
          end
          
          metrics = metrics_query.order(calculation_date: :asc)
          
          # Ensure we have a current metric
          current_metric = InvestorPortfolioMetric.calculate_for_user(@current_user.id)
          
          render json: {
            success: true,
            metrics: metrics.as_json,
            current: current_metric&.as_json
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
          
          period_type = params[:period_type]
          financials = campaign.financial_statements.published.recent_first
          
          if period_type.present? && period_type != 'all'
            financials = financials.where(period_type: period_type)
          end
          
          render json: {
            success: true,
            financials: financials.as_json,
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
          
          kpi_type = params[:kpi_type]
          kpis = campaign.campaign_kpis.includes(:kpi_values)
          
          if kpi_type.present? && kpi_type != 'all'
            kpis = kpis.where(kpi_type: kpi_type)
          end
          
          # Prepare response with latest values and trends
          kpis_data = kpis.map do |kpi|
            latest_value = kpi.kpi_values.order(period_date: :desc).first
            trend = kpi.trend(days: 90)
            
            {
              id: kpi.id,
              name: kpi.name,
              kpi_type: kpi.kpi_type,
              unit: kpi.unit,
              target_value: kpi.target_value,
              is_primary: kpi.is_primary,
              latest_value: latest_value ? {
                value: latest_value.value,
                period_date: latest_value.period_date
              } : nil,
              trend: trend,
              performance_vs_target: kpi.performance_vs_target
            }
          end
          
          render json: {
            success: true,
            kpis: kpis_data
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
          
          report_type = params[:report_type]
          start_date = params[:start_date]
          end_date = params[:end_date]
          
          reports = campaign.investor_reports.published.includes(:documents)
          
          if report_type.present? && report_type != 'all'
            reports = reports.where(report_type: report_type)
          end
          
          if start_date.present?
            reports = reports.where('report_date >= ?', start_date)
          end
          
          if end_date.present?
            reports = reports.where('report_date <= ?', end_date)
          end
          
          reports = reports.order(report_date: :desc)
          
          render json: {
            success: true,
            reports: reports.as_json(include: { documents: {} })
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
          Rails.logger.error "Error fetching notification preferences: #{e.message}"
          render json: {
            success: false,
            error: "Failed to load notification preferences",
            preferences: NotificationPreference.new(user: @current_user).as_json
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
          ).tap do |permitted|
            # Convert preferred_time from string "HH:MM" to seconds since midnight
            if permitted[:preferred_time].present? && permitted[:preferred_time].is_a?(String)
              time_parts = permitted[:preferred_time].split(':')
              if time_parts.length == 2
                hours = time_parts[0].to_i
                minutes = time_parts[1].to_i
                permitted[:preferred_time] = (hours.hours + minutes.minutes).to_i
              end
            end
          end
        end
        
        def generate_csv(data)
          require 'csv'
          
          CSV.generate(headers: true) do |csv|
            # Summary section
            csv << ['PORTFOLIO STATEMENT']
            csv << ["Generated: #{Time.current.to_formatted_s(:long)}"]
            csv << ['Investor ID:', @current_user.id]
            csv << ['Investor Name:', @current_user.full_name]
            csv << []
            
            csv << ['PORTFOLIO SUMMARY']
            csv << ['Metric', 'Value']
            if data[:summary]
              data[:summary].each do |key, value|
                formatted_key = key.to_s.humanize.titleize
                formatted_value = if [:total_invested, :current_value, :total_returns].include?(key)
                  "#{@current_user.currency_symbol}#{value.round(2)}"
                elsif [:roi, :irr].include?(key)
                  "#{value.round(2)}%"
                elsif key == :moic
                  "#{value.round(2)}x"
                else
                  value
                end
                csv << [formatted_key, formatted_value]
              end
            end
            csv << []
            
            # Campaigns section
            if data[:campaigns] && data[:campaigns].any?
              csv << ['CAMPAIGN BREAKDOWN']
              csv << ['Company', 'Invested', 'Current Value', 'Returns', 'ROI', 'Ownership %']
              data[:campaigns].each do |campaign|
                csv << [
                  campaign[:company_name],
                  "#{@current_user.currency_symbol}#{campaign[:invested].round(2)}",
                  "#{@current_user.currency_symbol}#{campaign[:current_value].round(2)}",
                  "#{@current_user.currency_symbol}#{campaign[:returns].round(2)}",
                  "#{campaign[:roi].round(2)}%",
                  "#{campaign[:ownership_percentage].round(2)}%"
                ]
              end
              csv << []
            end
            
            # Performance section
            if data[:performance]
              csv << ['PERFORMANCE METRICS']
              data[:performance].each do |key, value|
                csv << [key.to_s.humanize.titleize, value]
              end
              csv << []
            end
            
            # Risk section
            if data[:risk]
              csv << ['RISK ANALYSIS']
              data[:risk].each do |key, value|
                if key == :risk_category
                  csv << ['Risk Category', value.upcase]
                elsif [:concentration_risk, :sector_diversification, :liquidity_risk, :overall_risk_score].include?(key)
                  csv << [key.to_s.humanize.titleize, "#{(value * 100).round(1)}%"]
                else
                  csv << [key.to_s.humanize.titleize, value]
                end
              end
            end
            
            csv << []
            csv << ['CONFIDENTIAL']
            csv << ['This statement contains confidential investor information.']
            csv << ['Generated by Bantuhive Investment Platform']
          end
        end

        def send_fallback_download(format, data, filename)
          case format
          when 'json'
            json_data = JSON.pretty_generate(data)
            send_data json_data,
                      filename: "#{filename}.json",
                      type: 'application/json',
                      disposition: 'attachment'
          when 'csv'
            csv_data = generate_csv(data)
            send_data csv_data,
                      filename: "#{filename}.csv",
                      type: 'text/csv',
                      disposition: 'attachment'
          when 'pdf'
            # This shouldn't happen since PDF is handled separately, but just in case
            render json: {
              success: false,
              error: "PDF generation failed. Try downloading directly instead."
            }, status: :internal_server_error
          else
            render json: {
              success: false,
              error: "Unsupported format: #{format}. Supported formats: pdf, json, csv"
            }, status: :bad_request
          end
        end
      end
    end
  end
end