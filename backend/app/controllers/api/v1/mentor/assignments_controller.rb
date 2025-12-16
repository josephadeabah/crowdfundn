# app/controllers/api/v1/mentor/assignments_controller.rb
module Api
  module V1
    module Mentor
      class AssignmentsController < ApplicationController
        before_action :authenticate_request
        before_action :set_campaign, only: [:index, :available_mentors, :request_mentor]
        before_action :set_mentor, only: [:request_mentor]
        
        def index
          assignments = @campaign.mentor_assignments.includes(:mentor)
          
          render json: {
            assignments: assignments.map do |assignment|
              {
                id: assignment.id,
                status: assignment.status,
                mentor: assignment.mentor.as_json(include_user: true),
                started_at: assignment.started_at,
                completed_at: assignment.completed_at,
                rating: assignment.rating,
                feedback: assignment.feedback
              }
            end,
            can_request_mentor: can_request_mentor?
          }, status: :ok
        end

        def show
          @assignment = MentorAssignment.find(params[:id])
          
          # Check authorization
          unless @assignment && (
            @assignment.entrepreneur == @current_user || 
            @assignment.mentor.user == @current_user ||
            @current_user.admin?
          )
            render json: { error: 'Unauthorized' }, status: :unauthorized
            return
          end
          
          render json: {
            assignment: {
              id: @assignment.id,
              status: @assignment.status,
              campaign: {
                id: @assignment.campaign.id,
                title: @assignment.campaign.title,
                fundraiser_name: @assignment.campaign.fundraiser.full_name
              },
              mentor: @assignment.mentor.as_json(include_user: true),
              entrepreneur: {
                id: @assignment.entrepreneur.id,
                full_name: @assignment.entrepreneur.full_name
              },
              entrepreneur_notes: @assignment.entrepreneur_notes,
              mentor_notes: @assignment.mentor_notes,
              started_at: @assignment.started_at,
              completed_at: @assignment.completed_at,
              rating: @assignment.rating,
              feedback: @assignment.feedback,
              cancellation_reason: @assignment.cancellation_reason
            }
          }, status: :ok
        end
        
        def available_mentors
          # Get mentors filtered by campaign needs
          base_query = ::Mentor.available
          
          # Filter by expertise if campaign has specific needs
          if params[:expertise].present?
            base_query = base_query.by_expertise(params[:expertise])
          end
          
          # Filter by rating if requested
          if params[:min_rating].present?
            base_query = base_query.where('rating >= ?', params[:min_rating])
          end
          
          mentors = base_query.order(rating: :desc, reviews_count: :desc).limit(20)
          
          render json: {
            mentors: mentors.map do |mentor|
              mentor.as_json(include_user: true).merge(
                current_assignments: mentor.current_assignments,
                max_assignments: mentor.max_assignments,
                availability_score: calculate_availability_score(mentor)
              )
            end
          }, status: :ok
        end
        
        def request_mentor
          # Check if entrepreneur can request mentors
          unless can_request_mentor?
            render json: { error: 'You cannot request mentors for this campaign' }, status: :forbidden
            return
          end
        
          # Check if mentor is available
          unless @mentor.available?
            render json: { error: 'Mentor is not available for new assignments' }, status: :unprocessable_entity
            return
          end
        
          # Check if mentor is already assigned to this campaign
          existing_assignment = MentorAssignment.find_by(campaign: @campaign, mentor: @mentor)
          if existing_assignment
            render json: { 
              error: 'Mentor is already assigned to this campaign',
              assignment: existing_assignment.as_json,
              existing_status: existing_assignment.status
            }, status: :conflict
            return
          end
        
          # Create the assignment
          @assignment = MentorAssignment.new(
            campaign: @campaign,
            mentor: @mentor,
            entrepreneur: @current_user,
            status: 'pending',
            entrepreneur_notes: params[:notes]
          )
        
          begin
            if @assignment.save
              # Send notification to mentor using the new service
              MentorNotificationService.new_mentor_request(assignment: @assignment)
              
              render json: {
                assignment: @assignment.as_json,
                message: 'Mentor request sent successfully'
              }, status: :created
            else
              render json: { errors: @assignment.errors.full_messages }, status: :unprocessable_entity
            end
          rescue => e
            Rails.logger.error "Error creating mentor assignment: #{e.message}"
            render json: { error: 'Failed to create mentor assignment' }, status: :internal_server_error
          end
        end
        
        def my_mentor_assignments
          assignments = MentorAssignment.where(entrepreneur: @current_user)
                                        .or(MentorAssignment.where(mentor: @current_user.mentor))
                                        .includes(:campaign, :mentor)
                                        .order(created_at: :desc)
          
          render json: {
            assignments: assignments.map do |assignment|
              {
                id: assignment.id,
                status: assignment.status,
                campaign: {
                  id: assignment.campaign.id,
                  title: assignment.campaign.title,
                  fundraiser_name: assignment.campaign.fundraiser.full_name
                },
                mentor: assignment.mentor.as_json(include_user: true),
                entrepreneur_notes: assignment.entrepreneur_notes,
                mentor_notes: assignment.mentor_notes,
                started_at: assignment.started_at,
                completed_at: assignment.completed_at,
                rating: assignment.rating,
                feedback: assignment.feedback
              }
            end
          }, status: :ok
        end
        
        def approve_assignment
          @assignment = MentorAssignment.find_by(id: params[:id], mentor: @current_user.mentor)
          
          if @assignment.nil?
            render json: { error: 'Assignment not found or unauthorized' }, status: :not_found
            return
          end
          
          if @assignment.pending?
            @assignment.approve!
            
            # Send notification using the new service
            MentorNotificationService.send_mentor_assignment_notification(
              assignment: @assignment, 
              event_type: :assignment_approved
            )
            
            render json: {
              assignment: @assignment.as_json,
              message: 'Assignment approved successfully'
            }, status: :ok
          else
            render json: { error: 'Assignment cannot be approved in current state' }, status: :unprocessable_entity
          end
        end
        
        def complete_assignment
          @assignment = MentorAssignment.find_by(id: params[:id])
          
          # Check authorization
          unless @assignment && (
            @assignment.entrepreneur == @current_user || 
            @assignment.mentor.user == @current_user
          )
            render json: { error: 'Unauthorized' }, status: :unauthorized
            return
          end
          
          if @assignment.active?
            @assignment.complete!(
              params[:rating],
              params[:feedback]
            )
            
            # Send notification using the new service
            MentorNotificationService.send_mentor_assignment_notification(
              assignment: @assignment, 
              event_type: :assignment_completed
            )
            
            render json: {
              assignment: @assignment.as_json,
              message: 'Assignment completed successfully'
            }, status: :ok
          else
            render json: { error: 'Assignment cannot be completed in current state' }, status: :unprocessable_entity
          end
        end
        
        def cancel_assignment
          @assignment = MentorAssignment.find_by(id: params[:id])
          
          # Check authorization
          unless @assignment && (
            @assignment.entrepreneur == @current_user || 
            @assignment.mentor.user == @current_user
          )
            render json: { error: 'Unauthorized' }, status: :unauthorized
            return
          end
          
          if @assignment.pending? || @assignment.active?
            @assignment.cancel!(params[:reason])
            
            # Send notification using the new service
            MentorNotificationService.send_mentor_assignment_notification(
              assignment: @assignment, 
              event_type: :assignment_cancelled
            )
            
            render json: {
              assignment: @assignment.as_json,
              message: 'Assignment cancelled successfully'
            }, status: :ok
          else
            render json: { error: 'Assignment cannot be cancelled in current state' }, status: :unprocessable_entity
          end
        end
        
        private
        
        def set_campaign
          @campaign = Campaign.find_by(id: params[:campaign_id])
          
          if @campaign.nil?
            render json: { error: 'Campaign not found' }, status: :not_found
            return
          end
          
          # Check if user has access to the campaign
          unless @campaign.fundraiser == @current_user || @current_user.admin?
            render json: { error: 'Unauthorized' }, status: :unauthorized
          end
        end
        
        def set_mentor
          @mentor = ::Mentor.find_by(id: params[:mentor_id])
          
          if @mentor.nil?
            render json: { error: 'Mentor not found' }, status: :not_found
          end
        end
        
        def can_request_mentor?
          @campaign.fundraiser == @current_user || @current_user.admin?
        end
        
        def calculate_availability_score(mentor)
          if mentor.max_assignments.nil?
            100
          else
            available_slots = mentor.max_assignments - mentor.current_assignments
            (available_slots.to_f / mentor.max_assignments.to_f * 100).to_i
          end
        end
      end
    end
  end
end