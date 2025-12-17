module Api
  module V1
    module Mentor
      class MentorsController < ApplicationController
        before_action :authenticate_request
        
        def index
          # Public endpoint to browse available mentors
          base_query = ::Mentor.available
          
          # Apply filters
          if params[:expertise].present?
            base_query = base_query.by_expertise(params[:expertise])
          end
          
          if params[:min_rating].present?
            base_query = base_query.where('rating >= ?', params[:min_rating])
          end
          
          if params[:min_experience].present?
            base_query = base_query.where('years_of_experience >= ?', params[:min_experience])
          end
          
          # Pagination
          page = params[:page] || 1
          per_page = params[:per_page] || 20
          
          mentors = base_query.order(rating: :desc, reviews_count: :desc)
                             .page(page)
                             .per(per_page)
          
          render json: {
            mentors: mentors.map { |m| m.as_json(include_user: true) },
            pagination: {
              current_page: mentors.current_page,
              total_pages: mentors.total_pages,
              total_count: mentors.total_count,
              per_page: mentors.limit_value
            },
            filters: {
              expertise_tags: ExpertiseTag.all.pluck(:name),
              max_rating: 5.0,
              max_experience: ::Mentor.maximum(:years_of_experience) || 50
            }
          }, status: :ok
        end
        
        def show
          mentor = ::Mentor.find(params[:id])
          
          render json: {
            mentor: mentor.as_json(include_user: true),
            expertise: mentor.expertise_list,
            assignments: {
              current: mentor.current_assignments,
              max: mentor.max_assignments,
              completed: mentor.mentor_assignments.completed.count,
              active: mentor.mentor_assignments.active.count,
              needs_rating: mentor.mentor_assignments.completed.where(rating: nil).count
            },
            reviews: mentor.mentor_assignments.completed.where.not(rating: nil).map do |assignment|
              {
                rating: assignment.rating,
                feedback: assignment.feedback,
                campaign_title: assignment.campaign.title,
                entrepreneur_name: assignment.entrepreneur.full_name,
                completed_at: assignment.completed_at
              }
            end
          }, status: :ok
        end
        
        def my_mentor_profile
          mentor = @current_user.mentor
          
          if mentor.nil?
            # Check if they have a pending mentor application
            mentor_app = @current_user.mentor_applications.last
            
            if mentor_app
              render json: {
                has_mentor_profile: false,
                has_mentor_application: true,
                application: mentor_app.as_json,
                message: 'Mentor application is pending review'
              }, status: :ok
            else
              render json: { 
                error: 'You are not registered as a mentor. Please submit a mentor application first.',
                has_mentor_profile: false,
                has_mentor_application: false
              }, status: :not_found
            end
            return
          end
          
          # Get assignments that need rating (from entrepreneur's perspective)
          entrepreneur_assignments = MentorAssignment.where(entrepreneur: @current_user, status: 'completed', rating: nil)
          
          render json: {
            has_mentor_profile: true,
            mentor: mentor.as_json(include_user: true),
            expertise: mentor.expertise_list,
            assignments: {
              current: mentor.current_assignments,
              max: mentor.max_assignments,
              completed: mentor.mentor_assignments.completed.count,
              active: mentor.mentor_assignments.active.count
            },
            reviews: mentor.mentor_assignments.completed.where.not(rating: nil).map do |assignment|
              {
                rating: assignment.rating,
                feedback: assignment.feedback,
                campaign_title: assignment.campaign.title,
                entrepreneur_name: assignment.entrepreneur.full_name,
                completed_at: assignment.completed_at
              }
            end,
            assignments_needing_rating: entrepreneur_assignments.map do |assignment|
              {
                id: assignment.id,
                mentor_name: assignment.mentor.professional_title,
                campaign_title: assignment.campaign.title,
                completed_at: assignment.completed_at
              }
            end,
            message: entrepreneur_assignments.any? ? 'You have completed mentorships that need your rating' : nil
          }, status: :ok
        end
        
        def update_profile
          mentor = @current_user.mentor
          
          if mentor.nil?
            render json: { error: 'You are not registered as a mentor' }, status: :not_found
            return
          end
          
          if mentor.update(mentor_params)
            # Update expertise tags if provided
            if params[:expertise_tags].present?
              mentor.mentor_expertise_tags.destroy_all
              params[:expertise_tags].each do |tag_name|
                mentor.add_expertise(tag_name)
              end
            end
            
            render json: {
              mentor: mentor.as_json(include_user: true),
              message: 'Profile updated successfully'
            }, status: :ok
          else
            render json: { errors: mentor.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        def update_availability
          mentor = @current_user.mentor
          
          if mentor.nil?
            render json: { error: 'You are not registered as a mentor' }, status: :not_found
            return
          end
          
          if params[:max_assignments].present?
            mentor.max_assignments = params[:max_assignments]
          end
          
          if params[:status].present? && %w[approved inactive].include?(params[:status])
            mentor.status = params[:status]
          end
          
          if mentor.save
            render json: {
              mentor: mentor.as_json(include_user: true),
              message: 'Availability updated successfully'
            }, status: :ok
          else
            render json: { errors: mentor.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        private
        
        def mentor_params
          params.require(:mentor).permit(
            :professional_title,
            :bio,
            :linkedin_profile,
            :hourly_rate,
            :max_assignments
          )
        end
      end
    end
  end
end