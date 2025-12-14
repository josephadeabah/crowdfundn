# app/controllers/api/v1/deal_room_meetings_controller.rb
module Api
  module V1
    class DealRoomMeetingsController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room
      before_action :set_deal_room_meeting, only: [:show, :update, :destroy, :add_participant, :remove_participant, :rsvp, :start, :end, :cancel, :reschedule, :add_participants, :attendance]
      
      # POST /api/v1/deal_rooms/:deal_room_id/meetings
      def create
        # Check if user has access to the deal room
        unless @deal_room.members.include?(@current_user) || @current_user.admin?
          render json: { error: 'Access denied' }, status: :forbidden
          return
        end
        
        # Build meeting with organizer set to current user
        @meeting = @deal_room.deal_room_meetings.new(meeting_params)
        @meeting.organizer = @current_user
        @meeting.status = 'scheduled'
        
        if @meeting.save
          # Handle participants
          handle_participants(@meeting)
          
          render json: {
            message: 'Meeting created successfully',
            meeting: @meeting.as_json(current_user: @current_user)
          }, status: :created
        else
          render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # GET /api/v1/my/meetings/upcoming
      def upcoming
        @meetings = DealRoomMeeting.upcoming
                                  .for_user(@current_user)
                                  .includes(:deal_room, :organizer)
                                  .order(start_time: :asc)
                                  .page(params[:page])
                                  .per(params[:per_page] || 10)
        
        render json: {
          meetings: @meetings.map { |m| m.as_json(current_user: @current_user) },
          current_page: @meetings.current_page,
          total_pages: @meetings.total_pages,
          total_count: @meetings.total_count
        }, status: :ok
      end
      
      # GET /api/v1/deal_room_meetings/:id
      def show
        if has_access?
          render json: {
            meeting: @meeting.as_json(current_user: @current_user),
            participants: @meeting.participants_info,
            can_edit: @meeting.can_edit?(@current_user),
            can_delete: @meeting.can_delete?(@current_user)
          }, status: :ok
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      # PUT /api/v1/deal_room_meetings/:id
      def update
        if @meeting.can_edit?(@current_user)
          if @meeting.update(meeting_params)
            # Update participants if specified
            if params[:participant_ids].present?
              update_participants(@meeting, params[:participant_ids])
            end
            
            render json: {
              message: 'Meeting updated successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized to edit this meeting' }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/deal_room_meetings/:id
      def destroy
        if @meeting.can_delete?(@current_user)
          if @meeting.destroy
            render json: { message: 'Meeting deleted successfully' }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized to delete this meeting' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/start
      def start
        if @meeting.organizer == @current_user || @current_user.admin?
          if @meeting.start_meeting
            render json: {
              message: 'Meeting started successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Only organizer can start the meeting' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/end
      def end
        if @meeting.organizer == @current_user || @current_user.admin?
          if @meeting.end_meeting
            render json: {
              message: 'Meeting ended successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Only organizer can end the meeting' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/cancel
      def cancel
        if @meeting.organizer == @current_user || @current_user.admin?
          if @meeting.cancel_meeting(params[:reason])
            render json: {
              message: 'Meeting canceled successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Only organizer can cancel the meeting' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/reschedule
      def reschedule
        if @meeting.can_edit?(@current_user)
          new_start_time = Time.zone.parse(params[:new_start_time])
          new_end_time = Time.zone.parse(params[:new_end_time])
          
          if @meeting.reschedule(new_start_time, new_end_time)
            render json: {
              message: 'Meeting rescheduled successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized to reschedule this meeting' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/add_participants
      def add_participants
        if @meeting.can_edit?(@current_user)
          participant_ids = params[:participant_ids] || []
          participant_emails = params[:participant_emails] || []
          
          # Add by user IDs
          participant_ids.each do |user_id|
            user = User.find_by(id: user_id)
            @meeting.add_participant(user) if user
          end
          
          # Add by emails
          @meeting.add_participants_by_email(participant_emails)
          
          render json: {
            message: 'Participants added successfully',
            meeting: @meeting.as_json(current_user: @current_user)
          }, status: :ok
        else
          render json: { error: 'Unauthorized to add participants' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/deal_room_meetings/:id/add_participant
      def add_participant
        if @meeting.can_edit?(@current_user)
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
        if @meeting.can_edit?(@current_user)
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
        
        case params[:status]
        when 'accepted'
          participant.accept!
        when 'declined'
          participant.decline!
        when 'tentative'
          participant.tentative!
        else
          render json: { error: 'Invalid RSVP status' }, status: :bad_request
          return
        end
        
        render json: {
          message: "RSVP #{params[:status]} successfully",
          participant: participant.as_json,
          meeting: @meeting.as_json(current_user: @current_user)
        }, status: :ok
      end
      
      # POST /api/v1/deal_room_meetings/:id/attendance
      def attendance
        if @meeting.organizer == @current_user || @current_user.admin?
          attendance_data = params[:attendance] || {}
          
          attendance_data.each do |user_id, status|
            user = User.find_by(id: user_id)
            next unless user
            
            participant = @meeting.deal_room_meeting_participants.find_by(user: user)
            next unless participant
            
            case status
            when 'attended'
              participant.mark_attended!
            when 'no_show'
              participant.mark_no_show!
            end
          end
          
          render json: {
            message: 'Attendance updated successfully',
            meeting: @meeting.as_json(current_user: @current_user)
          }, status: :ok
        else
          render json: { error: 'Only organizer can mark attendance' }, status: :unauthorized
        end
      end
      
      private
      
      def set_deal_room
        @deal_room = DealRoom.find(params[:deal_room_id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Deal room not found' }, status: :not_found
      end
      
      def meeting_params
        params.permit(
          :title, :description, :meeting_type,
          :start_time, :end_time, :meeting_link, :notes
        )
      end
      
      def handle_participants(meeting)
        # Add current user as host
        meeting.add_participant(@current_user, role: 'host', status: 'accepted')
        
        # Add selected users
        if params[:participant_ids].present?
          params[:participant_ids].each do |user_id|
            user = User.find_by(id: user_id)
            meeting.add_participant(user) if user
          end
        end
        
        # Add participants by email
        if params[:participant_emails].present?
          emails = params[:participant_emails].is_a?(String) ? 
                   params[:participant_emails].split(',').map(&:strip) : 
                   params[:participant_emails]
          meeting.add_participants_by_email(emails)
        end
        
        # Invite all deal room members if requested
        if params[:invite_all_members] == true || params[:invite_all_members] == 'true'
          @deal_room.members.each do |member|
            next if member == @current_user # Already added as host
            meeting.add_participant(member)
          end
        end
      end
      
      def set_deal_room_meeting
        @meeting = DealRoomMeeting.find(params[:id])
      end
      
      def has_access?
        @meeting.deal_room.public? || 
        @meeting.deal_room.members.include?(@current_user) || 
        @current_user.admin? ||
        @meeting.participants.include?(@current_user)
      end
      
      def meeting_params
        params.permit(
          :title, :description, :meeting_type, :status,
          :start_time, :end_time, :meeting_link, :notes
        )
      end
      
      def update_participants(meeting, participant_ids)
        current_participant_ids = meeting.participants.pluck(:id)
        new_participant_ids = participant_ids.map(&:to_i)
        
        # Add new participants
        (new_participant_ids - current_participant_ids).each do |user_id|
          user = User.find_by(id: user_id)
          meeting.add_participant(user) if user
        end
        
        # Remove participants no longer in the list
        (current_participant_ids - new_participant_ids).each do |user_id|
          user = User.find_by(id: user_id)
          meeting.remove_participant(user) if user && user != meeting.organizer
        end
      end
    end
  end
end