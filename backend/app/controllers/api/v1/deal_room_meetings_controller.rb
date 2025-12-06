# app/controllers/api/v1/deal_room_meetings_controller.rb
module Api
  module V1
    class DealRoomMeetingsController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room_meeting, only: [:show, :update, :destroy, :add_participant, :remove_participant, :rsvp]
      
      # GET /api/v1/deal_room_meetings/:id
      def show
        if has_access?
          render json: {
            meeting: @meeting.as_json
          }, status: :ok
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      # PUT /api/v1/deal_room_meetings/:id
      def update
        if @meeting.organizer == @current_user || @current_user.admin?
          if @meeting.update(meeting_params)
            render json: {
              message: 'Meeting updated successfully',
              meeting: @meeting.as_json
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/deal_room_meetings/:id
      def destroy
        if @meeting.organizer == @current_user || @current_user.admin?
          if @meeting.destroy
            render json: { message: 'Meeting deleted successfully' }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/add_participant
      def add_participant
        if @meeting.organizer == @current_user || @current_user.admin?
          user = User.find_by(id: params[:user_id])
          
          if user.nil?
            render json: { error: 'User not found' }, status: :not_found
            return
          end
          
          participant = @meeting.deal_room_meeting_participants.find_or_initialize_by(user: user)
          participant.role = params[:role] || 'attendee'
          participant.status = 'invited'
          
          if participant.save
            render json: {
              message: 'Participant added successfully',
              participant: participant.as_json
            }, status: :ok
          else
            render json: { errors: participant.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/deal_room_meetings/:id/remove_participant
      def remove_participant
        if @meeting.organizer == @current_user || @current_user.admin?
          participant = @meeting.deal_room_meeting_participants.find_by(user_id: params[:user_id])
          
          if participant.nil?
            render json: { error: 'Participant not found' }, status: :not_found
            return
          end
          
          if participant.destroy
            render json: { message: 'Participant removed successfully' }, status: :ok
          else
            render json: { errors: participant.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/rsvp
      def rsvp
        participant = @meeting.deal_room_meeting_participants.find_by(user: @current_user)
        
        if participant.nil?
          render json: { error: 'You are not invited to this meeting' }, status: :forbidden
          return
        end
        
        if participant.update(status: params[:status])
          render json: {
            message: "RSVP #{params[:status]} successfully",
            participant: participant.as_json
          }, status: :ok
        else
          render json: { errors: participant.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      private
      
      def set_deal_room_meeting
        @meeting = DealRoomMeeting.find(params[:id])
      end
      
      def has_access?
        @meeting.deal_room.public? || 
        @meeting.deal_room.members.include?(@current_user) || 
        @current_user.admin?
      end
      
      def meeting_params
        params.permit(:title, :description, :meeting_type, :start_time, :end_time, :meeting_link, :notes)
      end
    end
  end
end