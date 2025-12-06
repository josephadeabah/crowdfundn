# app/controllers/api/v1/deal_room_messages_controller.rb
module Api
  module V1
    class DealRoomMessagesController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room_conversation
      before_action :set_deal_room_message, only: [:update, :destroy]
      
      # GET /api/v1/deal_room_conversations/:deal_room_conversation_id/messages
      def index
        if has_access?
          @messages = @conversation.deal_room_messages
                                  .includes(:user)
                                  .order(created_at: :desc)
                                  .page(params[:page])
                                  .per(params[:per_page] || 50)
          
          render json: {
            messages: @messages.map(&:as_json),
            current_page: @messages.current_page,
            total_pages: @messages.total_pages,
            total_count: @messages.total_count
          }, status: :ok
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      # POST /api/v1/deal_room_conversations/:deal_room_conversation_id/messages
      def create
        if has_access?
          @message = @conversation.deal_room_messages.new(
            user: @current_user,
            content: params[:content],
            message_type: 'text'
          )
          
          if params[:attachment].present?
            @message.message_type = 'file'
            @message.attachment.attach(params[:attachment])
          end
          
          if @message.save
            render json: {
              message: 'Message sent successfully',
              message_data: @message.as_json
            }, status: :created
          else
            render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      # PUT /api/v1/deal_room_conversations/:deal_room_conversation_id/messages/:id
      def update
        if @message.user == @current_user || @current_user.admin?
          if @message.update(message_params)
            render json: {
              message: 'Message updated successfully',
              message_data: @message.as_json
            }, status: :ok
          else
            render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/deal_room_conversations/:deal_room_conversation_id/messages/:id
      def destroy
        if @message.user == @current_user || @current_user.admin?
          if @message.destroy
            render json: { message: 'Message deleted successfully' }, status: :ok
          else
            render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      private
      
      def set_deal_room_conversation
        @conversation = DealRoomConversation.find(params[:deal_room_conversation_id])
      end
      
      def set_deal_room_message
        @message = @conversation.deal_room_messages.find(params[:id])
      end
      
      def has_access?
        @conversation.deal_room.public? || 
        @conversation.deal_room.members.include?(@current_user) || 
        @current_user.admin?
      end
      
      def message_params
        params.permit(:content)
      end
    end
  end
end