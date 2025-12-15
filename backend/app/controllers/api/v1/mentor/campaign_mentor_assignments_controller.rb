# app/controllers/api/v1/mentor/campaign_mentor_assignments_controller.rb
module Api
  module V1
    module Mentor
      class CampaignMentorAssignmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign
        
        def index
          assignments = @campaign.mentor_assignments.includes(mentor: :user)
          
          render json: {
            assignments: assignments.map do |assignment|
              {
                id: assignment.id,
                status: assignment.status,
                mentor: {
                  id: assignment.mentor.id,
                  user: {
                    id: assignment.mentor.user.id,
                    full_name: assignment.mentor.user.full_name,
                    profile: assignment.mentor.user.profile
                  },
                  professional_title: assignment.mentor.professional_title,
                  rating: assignment.mentor.rating,
                  reviews_count: assignment.mentor.reviews_count
                },
                started_at: assignment.started_at,
                completed_at: assignment.completed_at,
                rating: assignment.rating,
                feedback: assignment.feedback
              }
            end,
            can_request_mentor: @campaign.fundraiser == @current_user || @current_user.admin?
          }, status: :ok
        end
        
        def available_mentors
          # Get available mentors
          base_query = ::Mentor.available.includes(:user)
          
          # Filter by expertise if provided
          if params[:expertise].present?
            base_query = base_query.joins(:expertise_tags).where(expertise_tags: { name: params[:expertise] })
          end
          
          # Filter by minimum rating
          if params[:min_rating].present?
            base_query = base_query.where('rating >= ?', params[:min_rating])
          end
          
          # Filter by minimum experience
          if params[:min_experience].present?
            base_query = base_query.where('years_of_experience >= ?', params[:min_experience])
          end
          
          mentors = base_query.order(rating: :desc, reviews_count: :desc).limit(20)
          
          render json: {
            mentors: mentors.map do |mentor|
              {
                id: mentor.id,
                user: {
                  id: mentor.user.id,
                  full_name: mentor.user.full_name,
                  profile: mentor.user.profile
                },
                professional_title: mentor.professional_title,
                years_of_experience: mentor.years_of_experience,
                rating: mentor.rating,
                reviews_count: mentor.reviews_count,
                current_assignments: mentor.current_assignments,
                max_assignments: mentor.max_assignments,
                expertise: mentor.expertise_tags.pluck(:name),
                bio: mentor.bio,
                linkedin_profile: mentor.linkedin_profile
              }
            end
          }, status: :ok
        end
        
        def request_mentor
          # Check if user can request mentors
          unless @campaign.fundraiser == @current_user || @current_user.admin?
            render json: { error: 'Unauthorized to request mentors for this campaign' }, status: :forbidden
            return
          end
          
          mentor = ::Mentor.find_by(id: params[:mentor_id])
          
          if mentor.nil?
            render json: { error: 'Mentor not found' }, status: :not_found
            return
          end
          
          # Check if mentor is available
          unless mentor.available?
            render json: { error: 'Mentor is not available for new assignments' }, status: :unprocessable_entity
            return
          end
          
          # Check if mentor is already assigned to this campaign
          existing_assignment = MentorAssignment.find_by(campaign: @campaign, mentor: mentor)
          if existing_assignment
            render json: { 
              error: 'Mentor is already assigned to this campaign',
              assignment: {
                id: existing_assignment.id,
                status: existing_assignment.status
              }
            }, status: :conflict
            return
          end
          
          # Create mentor assignment
          assignment = MentorAssignment.new(
            campaign: @campaign,
            mentor: mentor,
            entrepreneur: @current_user,
            status: 'pending',
            entrepreneur_notes: params[:notes]
          )
          
          if assignment.save
            # Send notification to mentor
            MentorNotificationService.new_mentor_request(assignment)
            
            render json: {
              assignment: {
                id: assignment.id,
                status: assignment.status,
                mentor: {
                  id: mentor.id,
                  user: {
                    id: mentor.user.id,
                    full_name: mentor.user.full_name
                  }
                }
              },
              message: 'Mentor request sent successfully'
            }, status: :created
          else
            render json: { errors: assignment.errors.full_messages }, status: :unprocessable_entity
          end
        end
        
        private
        
        def set_campaign
          @campaign = Campaign.find(params[:campaign_id])
        end
      end
    end
  end
end