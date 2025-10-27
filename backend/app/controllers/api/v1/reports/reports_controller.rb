module Api
  module V1
    module Reports
      class ReportsController < ApplicationController
        before_action :authenticate_request, only: [:create, :my_reports]
        before_action :set_report, only: [:show, :update, :assign, :resolve, :dismiss]
        before_action :authorize_admin, only: [:index, :update, :assign, :resolve, :dismiss, :stats]

        # GET /api/v1/reports/reports
        def index
          page = params[:page] || 1
          per_page = params[:per_page] || 20
          
          @reports = Report.includes(:reporter, :campaign, :reported_user, :assigned_admin)
                          .order(created_at: :desc)
                          
          # Filtering
          @reports = @reports.where(status: params[:status]) if params[:status].present?
          @reports = @reports.where(report_type: params[:report_type]) if params[:report_type].present?
          @reports = @reports.where(priority: params[:priority]) if params[:priority].present?
          @reports = @reports.where(assigned_admin_id: params[:assigned_to]) if params[:assigned_to].present?
          
          # Search
          if params[:search].present?
            @reports = @reports.joins(:reporter)
                              .where("reports.description ILIKE :search OR users.full_name ILIKE :search", 
                                     search: "%#{params[:search]}%")
          end

          @reports = @reports.page(page).per(per_page)

          render json: {
            reports: @reports.map { |report| report_json(report) },
            pagination: {
              current_page: @reports.current_page,
              total_pages: @reports.total_pages,
              total_count: @reports.total_count
            }
          }
        end

        # GET /api/v1/reports/reports/my_reports
        def my_reports
          page = params[:page] || 1
          per_page = params[:per_page] || 10
          
          @reports = @current_user.reported_reports
                                 .includes(:campaign, :reported_user, :assigned_admin)
                                 .order(created_at: :desc)
                                 .page(page)
                                 .per(per_page)

          render json: {
            reports: @reports.map { |report| report_json(report) },
            pagination: {
              current_page: @reports.current_page,
              total_pages: @reports.total_pages,
              total_count: @reports.total_count
            }
          }
        end

        # GET /api/v1/reports/reports/:id
        def show
          render json: report_json(@report)
        end

        # POST /api/v1/reports/reports
        def create
          @report = Report.new(report_params)
          @report.reporter = @current_user

          if @report.save
            render json: {
              message: 'Report submitted successfully. Our team will review it shortly.',
              report: report_json(@report)
            }, status: :created
          else
            render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH /api/v1/reports/reports/:id/assign
        def assign
          if @report.update(assigned_admin_id: params[:admin_id], status: :under_review)
            render json: {
              message: 'Report assigned successfully',
              report: report_json(@report)
            }
          else
            render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH /api/v1/reports/reports/:id/resolve
        def resolve
          if @report.resolve_with_action(params[:action_taken], params[:resolution_notes])
            render json: {
              message: 'Report resolved successfully',
              report: report_json(@report)
            }
          else
            render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # PATCH /api/v1/reports/reports/:id/dismiss
        def dismiss
          if @report.dismiss(params[:reason])
            render json: {
              message: 'Report dismissed successfully',
              report: report_json(@report)
            }
          else
            render json: { errors: @report.errors.full_messages }, status: :unprocessable_entity
          end
        end

        # GET /api/v1/reports/reports/stats
        def stats
          stats = {
            total_reports: Report.count,
            pending_reports: Report.pending.count,
            under_review: Report.under_review.count,
            resolved_reports: Report.resolved.count,
            high_priority: Report.high_priority.count,
            by_type: Report.group(:report_type).count,
            by_status: Report.group(:status).count
          }

          render json: { stats: stats }
        end

        private

        def set_report
          @report = Report.find(params[:id])
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'Report not found' }, status: :not_found
        end

        def report_params
          params.require(:report).permit(
            :report_type, 
            :description, 
            :campaign_id, 
            :reported_user_id,
            :contact_email,
            evidence_links: []
          )
        end

        def report_json(report)
          {
            id: report.id,
            report_type: report.report_type,
            report_type_display: report.report_type.humanize,
            description: report.description,
            status: report.status,
            status_display: report.status.humanize,
            priority: report.priority,
            priority_display: report.priority.humanize,
            evidence_links: report.evidence_links,
            contact_email: report.contact_email,
            action_taken: report.action_taken,
            resolution_notes: report.resolution_notes,
            resolved_at: report.resolved_at,
            created_at: report.created_at,
            updated_at: report.updated_at,
            reporter: {
              id: report.reporter.id,
              name: report.reporter.full_name,
              email: report.reporter.email
            },
            assigned_admin: report.assigned_admin ? {
              id: report.assigned_admin.id,
              name: report.assigned_admin.full_name
            } : nil,
            campaign: report.campaign ? {
              id: report.campaign.id,
              title: report.campaign.title,
              fundraiser_name: report.campaign.fundraiser.full_name
            } : nil,
            reported_user: report.reported_user ? {
              id: report.reported_user.id,
              name: report.reported_user.full_name,
              email: report.reported_user.email
            } : nil,
            report_target_type: report.report_target_type,
            report_target_name: report.report_target_name
          }
        end

        def authorize_admin
          unless @current_user&.has_role?('Admin') || @current_user&.admin?
            render json: { error: 'Unauthorized. Admin access required.' }, status: :unauthorized
          end
        end
      end
    end
  end
end