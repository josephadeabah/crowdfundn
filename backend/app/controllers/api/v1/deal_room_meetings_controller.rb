# app/controllers/api/v1/deal_room_meetings_controller.rb
module Api
  module V1
    class DealRoomMeetingsController < ApplicationController
      before_action :authenticate_request  # Changed from :authenticate_user!
      before_action :set_meeting, only: [:show, :update, :destroy]
      
      # POST /api/v1/deal_room_meetings
      def create
        deal_room_id_param = meeting_params[:deal_room_id]
        
        # Try to find deal room by ID or campaign ID
        deal_room = DealRoom.find_by(id: deal_room_id_param)
        deal_room ||= DealRoom.find_by(campaign_id: deal_room_id_param)
        
        if deal_room.nil?
          render json: { 
            errors: ["Deal room not found. Tried ID: #{deal_room_id_param} as both deal_room_id and campaign_id"] 
          }, status: :unprocessable_entity
          return
        end
        
        Rails.logger.info "Found deal room: #{deal_room.id} for campaign: #{deal_room.campaign_id}"
        
        @meeting = DealRoomMeeting.new(
          meeting_params.except(:deal_room_id).merge(deal_room: deal_room)
        )
        @meeting.organizer = @current_user
        
        if @meeting.save
          # Auto-add organizer as host
          @meeting.deal_room_meeting_participants.create(
            user: @current_user,
            role: :host,
            status: :accepted
          )
          
          render json: @meeting.as_json(current_user: @current_user), status: :created
        else
          render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # GET /api/v1/deal_room_meetings/:id
      def show
        render json: @meeting.as_json(current_user: @current_user)  # Changed from current_user
      end
      
      # PUT /api/v1/deal_room_meetings/:id
      def update
        if @meeting.update(meeting_params)
          render json: @meeting
        else
          render json: { errors: @meeting.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # DELETE /api/v1/deal_room_meetings/:id
      def destroy
        if @meeting.destroy
          render json: { message: 'Meeting deleted successfully' }
        else
          render json: { error: 'Failed to delete meeting' }, status: :unprocessable_entity
        end
      end
      
      private
      
      def set_meeting
        @meeting = DealRoomMeeting.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Meeting not found' }, status: :not_found
      end
      
      def meeting_params
        params.require(:deal_room_meeting).permit(
          :deal_room_id,
          :title,
          :description,
          :meeting_type,
          :start_time,
          :end_time,
          :meeting_link,
          :notes
        )
      end
    end
  end
end