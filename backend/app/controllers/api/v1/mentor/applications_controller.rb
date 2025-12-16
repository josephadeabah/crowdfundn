# app/controllers/api/v1/mentor/applications_controller.rb
module Api
  module V1
    module Mentor
      class ApplicationsController < ApplicationController
        before_action :authenticate_request
        
        def create
          # Check if user already has a mentor application
          existing_application = MentorApplication.where(user: @current_user, status: ['draft', 'submitted', 'under_review']).first
          
          if existing_application
            render json: { 
              error: 'You already have a pending mentor application', 
              application_id: existing_application.id 
            }, status: :conflict
            return
          end
          
          @application = MentorApplication.new(application_params)
          @application.user = @current_user
          @application.status = 'draft'
          
          if @application.save
            render json: {
              application: @application.as_json,
              message: 'Mentor application started successfully'
            }, status: :created
          else
            render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update
          @application = MentorApplication.find_by(id: params[:id], user: @current_user)
          
          if @application.nil?
            render json: { error: 'Application not found' }, status: :not_found
            return
          end
          
          if @application.update(application_params)
            render json: {
              application: @application.as_json,
              message: 'Application updated successfully'
            }, status: :ok
          else
            render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def submit
          @application = MentorApplication.find_by(id: params[:id], user: @current_user)
          
          if @application.nil?
            render json: { error: 'Application not found' }, status: :not_found
            return
          end
          
          if @application.submitted?
            render json: { error: 'Application already submitted' }, status: :unprocessable_entity
            return
          end
          
          if @application.update(
            status: 'submitted',
            submitted_at: Time.current
          )
            # Send notification to admins using the new service
            MentorNotificationService.new_mentor_application_submitted(application: @application)
            
            render json: {
              application: @application.as_json,
              message: 'Application submitted successfully'
            }, status: :ok
          else
            render json: { errors: @application.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def show
          @application = MentorApplication.find_by(id: params[:id], user: @current_user)
          
          if @application.nil?
            render json: { error: 'Application not found' }, status: :not_found
            return
          end
          
          render json: { application: @application.as_json }, status: :ok
        end
        
        def my_applications
          applications = MentorApplication.where(user: @current_user).order(created_at: :desc)
          
          render json: {
            applications: applications.map(&:as_json),
            stats: {
              total: applications.count,
              draft: applications.where(status: 'draft').count,
              submitted: applications.where(status: 'submitted').count,
              approved: applications.where(status: 'approved').count,
              rejected: applications.where(status: 'rejected').count
            }
          }, status: :ok
        end
        
        def status
          application = MentorApplication.where(user: @current_user).order(created_at: :desc).first
          
          if application.nil?
            render json: { has_application: false }, status: :ok
            return
          end
          
          render json: {
            has_application: true,
            application: application.as_json,
            mentor_profile: application.mentor&.as_json
          }, status: :ok
        end
        
        private
        
        def application_params
          params.require(:mentor_application).permit(
            :professional_title,
            :years_of_experience,
            :previous_mentoring,
            :linkedin_profile,
            :resume_url,
            :mentorship_approach,
            :availability,
            industry_expertise: []
          )
        end
      end
    end
  end
end