# app/controllers/api/v1/deal_room_meetings_controller.rb
module Api
  module V1
    class DealRoomMeetingsController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room_meeting, only: [:show, :update, :destroy, :start, :end, :cancel, :add_participants, :remove_participant, :rsvp, :reschedule, :attendance]
      before_action :set_deal_room, only: [:index, :create, :calendar, :availability]
      before_action :check_access, only: [:show, :update, :destroy, :start, :end, :cancel, :add_participants, :remove_participant, :reschedule, :attendance]
      
      # GET /api/v1/deal_rooms/:deal_room_id/meetings
      def index
        @meetings = @deal_room.deal_room_meetings
                             .includes(:organizer, :participants)
                             .order(start_time: :asc)
                             .page(params[:page])
                             .per(params[:per_page] || 20)
        
        render json: {
          meetings: @meetings.map { |m| m.as_json(current_user: @current_user) },
          current_page: @meetings.current_page,
          total_pages: @meetings.total_pages,
          total_count: @meetings.total_count
        }, status: :ok
      end
      
      # GET /api/v1/deal_room_meetings/upcoming
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
      
      # GET /api/v1/deal_rooms/:deal_room_id/calendar
      def calendar
        start_date = params[:start_date] ? Date.parse(params[:start_date]) : Date.current.beginning_of_month
        end_date = params[:end_date] ? Date.parse(params[:end_date]) : Date.current.end_of_month
        
        @meetings = @deal_room.deal_room_meetings
                             .where(start_time: start_date.beginning_of_day..end_date.end_of_day)
                             .includes(:organizer)
                             .order(start_time: :asc)
        
        render json: {
          meetings: @meetings.map { |m| 
            m.as_json(current_user: @current_user).merge(
              all_day: false,
              color: meeting_color(m.status)
            )
          },
          date_range: {
            start: start_date,
            end: end_date
          }
        }, status: :ok
      end
      
      # GET /api/v1/deal_rooms/:deal_room_id/availability
      def availability
        date = params[:date] ? Date.parse(params[:date]) : Date.current
        duration = params[:duration] ? params[:duration].to_i : 60 # minutes
        
        # Get busy times for all participants
        participant_ids = params[:participant_ids] ? params[:participant_ids].split(',') : []
        busy_slots = get_busy_slots(date, participant_ids)
        
        # Generate available slots (9 AM to 5 PM by default)
        available_slots = generate_available_slots(date, busy_slots, duration)
        
        render json: {
          date: date,
          duration: duration,
          available_slots: available_slots,
          busy_slots: busy_slots
        }, status: :ok
      end
      
      # GET /api/v1/deal_room_meetings/:id
      def show
        render json: {
          meeting: @meeting.as_json(current_user: @current_user),
          participants: @meeting.participants_info,
          can_edit: @meeting.can_edit?(@current_user),
          can_delete: @meeting.can_delete?(@current_user)
        }, status: :ok
      end
      
      # POST /api/v1/deal_rooms/:deal_room_id/meetings
      def create
        @meeting = @deal_room.deal_room_meetings.new(meeting_params)
        @meeting.organizer = @current_user
        
        ActiveRecord::Base.transaction do
          if @meeting.save
            # Add participants
            add_participants_to_meeting(@meeting)
            
            render json: {
              message: 'Meeting scheduled successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :created
          else
            render json: {
              errors: @meeting.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
      
      # PUT /api/v1/deal_room_meetings/:id
      def update
        if @meeting.can_edit?(@current_user)
          ActiveRecord::Base.transaction do
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
              render json: {
                errors: @meeting.errors.full_messages
              }, status: :unprocessable_entity
            end
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
      
      # DELETE /api/v1/deal_room_meetings/:id/remove_participant/:user_id
      def remove_participant
        if @meeting.can_edit?(@current_user)
          user = User.find_by(id: params[:user_id])
          
          if user.nil?
            render json: { error: 'User not found' }, status: :not_found
            return
          end
          
          if @meeting.remove_participant(user)
            render json: {
              message: 'Participant removed successfully',
              meeting: @meeting.as_json(current_user: @current_user)
            }, status: :ok
          else
            render json: { errors: 'Failed to remove participant' }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized to remove participants' }, status: :unauthorized
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
      
      def set_deal_room_meeting
        @meeting = DealRoomMeeting.find(params[:id])
      end
      
      def set_deal_room
        @deal_room = DealRoom.find(params[:deal_room_id])
      end
      
      def check_access
        unless @meeting.deal_room.public? || 
               @meeting.deal_room.members.include?(@current_user) || 
               @current_user.admin? ||
               @meeting.participants.include?(@current_user)
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      def meeting_params
        params.permit(
          :title, :description, :meeting_type, :status,
          :start_time, :end_time, :meeting_link, :notes
        )
      end
      
      def add_participants_to_meeting(meeting)
        # Add organizer as host
        meeting.add_participant(@current_user, role: 'host', status: 'accepted')
        
        # Add other participants
        if params[:participant_ids].present?
          params[:participant_ids].each do |user_id|
            user = User.find_by(id: user_id)
            meeting.add_participant(user) if user && user != @current_user
          end
        end
        
        # Add participants by email
        if params[:participant_emails].present?
          meeting.add_participants_by_email(params[:participant_emails])
        end
        
        # Add all deal room members if specified
        if params[:invite_all_members] == 'true'
          @deal_room.members.each do |member|
            next if member == @current_user
            meeting.add_participant(member)
          end
        end
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
      
      def get_busy_slots(date, participant_ids)
        busy_slots = []
        
        # Get meetings for each participant
        participant_ids.each do |user_id|
          user = User.find_by(id: user_id)
          next unless user
          
          user_meetings = DealRoomMeeting
            .joins(:deal_room_meeting_participants)
            .where(deal_room_meeting_participants: { user_id: user.id })
            .where('DATE(start_time) = ?', date)
            .where.not(status: ['canceled', 'declined'])
          
          user_meetings.each do |meeting|
            busy_slots << {
              start: meeting.start_time,
              end: meeting.end_time,
              title: meeting.title,
              user_id: user.id
            }
          end
        end
        
        busy_slots
      end
      
      def generate_available_slots(date, busy_slots, duration)
        available_slots = []
        start_time = date.beginning_of_day + 9.hours  # 9 AM
        end_time = date.beginning_of_day + 17.hours   # 5 PM
        
        current_time = start_time
        
        while current_time + duration.minutes <= end_time
          slot_end = current_time + duration.minutes
          slot_available = true
        
          # Check if slot overlaps with any busy time
          busy_slots.each do |busy|
            if (current_time < busy[:end]) && (slot_end > busy[:start])
              slot_available = false
              break
            end
          end
        
          if slot_available
            available_slots << {
              start: current_time,
              end: slot_end,
              formatted: "#{current_time.strftime('%I:%M %p')} - #{slot_end.strftime('%I:%M %p')}"
            }
          end
        
          # Move to next slot (30-minute intervals)
          current_time += 30.minutes
        end
        
        available_slots
      end
      
      def meeting_color(status)
        case status
        when 'scheduled' then '#3b82f6'  # blue
        when 'in_progress' then '#f59e0b' # amber
        when 'completed' then '#10b981'  # green
        when 'canceled' then '#ef4444'   # red
        when 'draft' then '#6b7280'      # gray
        else '#3b82f6'
        end
      end
    end
  end
end