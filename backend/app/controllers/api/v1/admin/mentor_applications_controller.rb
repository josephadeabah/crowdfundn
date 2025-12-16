# app/controllers/api/v1/admin/mentor_applications_controller.rb
module Api
  module V1
    module Admin
      class MentorApplicationsController < ApplicationController
        before_action :authenticate_request
        before_action :require_admin
        
        def index
          applications = ::MentorApplication.includes(:user).order(created_at: :desc)
          
          # Apply filters
          if params[:status].present?
            applications = applications.where(status: params[:status])
          end
          
          if params[:search].present?
            applications = applications.joins(:user).where(
              'users.full_name ILIKE :search OR users.email ILIKE :search',
              search: "%#{params[:search]}%"
            )
          end
          
          page = params[:page] || 1
          per_page = params[:per_page] || 20
          
          applications = applications.page(page).per(per_page)
          
          render json: {
            applications: applications.map(&:as_json),
            pagination: {
              current_page: applications.current_page,
              total_pages: applications.total_pages,
              total_count: applications.total_count,
              per_page: applications.limit_value
            }
          }, status: :ok
        end
        
        def show
          application = ::MentorApplication.includes(:user, :reviewed_by).find(params[:id])
          
          render json: {
            application: application.as_json(include: [:user, :reviewed_by]),
            user: application.user.as_json(include_profile: true),
            reviewed_by: application.reviewed_by&.as_json,
            similar_applications: ::MentorApplication
              .where(professional_title: application.professional_title)
              .where.not(id: application.id)
              .limit(5)
              .map(&:as_json)
          }, status: :ok
        end
                
        def approve
          application = ::MentorApplication.find(params[:id])
          
          begin
            # Start transaction
            ::MentorApplication.transaction do
              # Update application status - use reviewed_by_id instead of reviewed_by
              application.update!(
                status: 'approved',
                reviewed_at: Time.current,
                reviewed_by_id: @current_user.id,
                review_notes: params[:review_notes]
              )
              
              # Check if mentor already exists
              if application.user.mentor.present?
                mentor = application.user.mentor
                mentor.update!(
                  professional_title: application.professional_title,
                  years_of_experience: application.years_of_experience,
                  linkedin_profile: application.linkedin_profile,
                  bio: application.mentorship_approach,
                  status: 'approved',
                  max_assignments: params[:max_assignments] || 5
                )
              else
                # Create mentor profile - Use ::Mentor to specify the global namespace
                mentor = ::Mentor.create!(
                  user: application.user,
                  professional_title: application.professional_title,
                  years_of_experience: application.years_of_experience,
                  linkedin_profile: application.linkedin_profile,
                  bio: application.mentorship_approach,
                  status: 'approved',
                  current_assignments: 0,
                  max_assignments: params[:max_assignments] || 5,
                  rating: 0,
                  reviews_count: 0
                )
              end
              
              # Add expertise tags
              mentor.mentor_expertise_tags.destroy_all
              application.industry_expertise.each do |expertise|
                mentor.add_expertise(expertise)
              end
              
              application.update!(mentor: mentor)
            end  # End of transaction block
            
            # Send approval email to applicant (you can add this if you want)
            MentorNotificationService.send_application_approved_email(application: application)
            
            render json: {
              application: application.as_json,
              mentor: application.user.mentor.as_json,
              message: 'Application approved successfully'
            }, status: :ok
            
          rescue ActiveRecord::RecordInvalid => e
            render json: { errors: e.record.errors.full_messages }, status: :unprocessable_entity
          rescue => e
            Rails.logger.error "Error approving mentor application: #{e.message}"
            Rails.logger.error e.backtrace.join("\n")
            render json: { 
              error: 'Failed to approve application',
              details: e.message 
            }, status: :internal_server_error
          end
        end
        
        def reject
          application = ::MentorApplication.find(params[:id])
          
          if application.update(
            status: 'rejected',
            reviewed_at: Time.current,
            reviewed_by_id: @current_user.id,
            review_notes: params[:review_notes]
          )
            # Send rejection email to applicant (you can add this if you want)
            MentorNotificationService.send_application_rejected_email(application: application)
            
            render json: {
              application: application.as_json,
              message: 'Application rejected'
            }, status: :ok
          else
            render json: { errors: application.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def request_additional_info
          application = ::MentorApplication.find(params[:id])
          
          # Send information request email to applicant (you can add this if you want)
          MentorNotificationService.send_additional_info_request_email(
            application: application, 
            requested_info: params[:requested_info]
          )
          
          render json: {
            message: 'Information request sent to applicant'
          }, status: :ok
        end
        
        def stats
          total = ::MentorApplication.count
          pending = ::MentorApplication.where(status: 'submitted').count
          approved = ::MentorApplication.where(status: 'approved').count
          rejected = ::MentorApplication.where(status: 'rejected').count
          
          # Monthly stats
          monthly_data = ::MentorApplication
            .where('created_at >= ?', 6.months.ago)
            .group_by_month(:created_at, format: '%b %Y')
            .count
            
          # Expertise distribution
          expertise_distribution = ::MentorApplication
            .where.not(industry_expertise: nil)
            .pluck(:industry_expertise)
            .flatten
            .group_by(&:itself)
            .transform_values(&:count)
            .sort_by { |_, count| -count }
            .first(10)
            .to_h
            
          render json: {
            totals: {
              total: total,
              pending: pending,
              approved: approved,
              rejected: rejected,
              approval_rate: total > 0 ? (approved.to_f / total * 100).round(2) : 0
            },
            monthly_data: monthly_data,
            expertise_distribution: expertise_distribution
          }, status: :ok
        end
        
        def pending_review
          applications = ::MentorApplication
            .where(status: ['submitted', 'under_review'])
            .includes(:user)
            .order(created_at: :asc)
            
          render json: {
            applications: applications.map { |app| app.as_json(include_user: true) },
            count: applications.count
          }, status: :ok
        end
        
        private
        
        def require_admin
          unless @current_user.admin?
            render json: { error: 'Unauthorized' }, status: :unauthorized
          end
        end
      end
    end
  end
end