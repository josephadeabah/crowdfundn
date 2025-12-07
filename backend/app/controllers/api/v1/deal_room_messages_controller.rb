module Api
  module V1
    class DealRoomMessagesController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room_conversation
      before_action :set_deal_room_message, only: [:show, :update, :destroy, :mark_as_read]
      before_action :check_access, only: [:index, :create]
      
      # GET /api/v1/deal_room_conversations/:deal_room_conversation_id/messages
      def index
        @messages = @conversation.deal_room_messages
                                .includes(:user)
                                .order(created_at: :asc)
                                .page(params[:page])
                                .per(params[:per_page] || 50)
        
        # Mark messages as read for current user
        mark_messages_as_read(@messages)
        
        render json: {
          messages: @messages.map { |msg| message_json(msg) },
          current_page: @messages.current_page,
          total_pages: @messages.total_pages,
          total_count: @messages.total_count,
          unread_count: unread_count
        }, status: :ok
      end
      
      # GET /api/v1/deal_room_conversations/:deal_room_conversation_id/messages/:id
      def show
        render json: {
          message: message_json(@message)
        }, status: :ok
      end
      
      # POST /api/v1/deal_room_conversations/:deal_room_conversation_id/messages
      def create
        @message = @conversation.deal_room_messages.new(
          user: @current_user,
          content: params[:content],
          message_type: params[:message_type] || 'text'
        )
        
        if params[:attachment].present?
          @message.attachment.attach(params[:attachment])
          @message.message_type = 'file'
        end
        
        if @message.save
          # Create notifications for mentioned users
          create_mention_notifications(@message)
          
          render json: {
            message: 'Message sent successfully',
            message_data: message_json(@message)
          }, status: :created
        else
          render json: { errors: @message.errors.full_messages }, status: :unprocessable_entity
        end
      end
      
      # PUT /api/v1/deal_room_conversations/:deal_room_conversation_id/messages/:id
      def update
        if @message.user == @current_user || @current_user.admin?
          if @message.update(message_params)
            render json: {
              message: 'Message updated successfully',
              message_data: message_json(@message)
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
      
      # POST /api/v1/deal_room_conversations/:deal_room_conversation_id/messages/:id/mark_as_read
      def mark_as_read
        @message.mark_as_read!(@current_user) if @message.respond_to?(:mark_as_read!)
        render json: { success: true }, status: :ok
      end
      
      private
      
      def set_deal_room_conversation
        @conversation = DealRoomConversation.find(params[:deal_room_conversation_id])
        @deal_room = @conversation.deal_room
      end
      
      def set_deal_room_message
        @message = @conversation.deal_room_messages.find(params[:id])
      end
      
      def check_access
        unless @deal_room.public? || @deal_room.members.include?(@current_user) || @current_user.admin?
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      def message_params
        params.permit(:content, :message_type)
      end
      
      def mark_messages_as_read(messages)
        # Implementation for marking messages as read
        # This depends on your read receipt system
        messages.each do |message|
          # Add logic to mark message as read for current user
        end
      end
      
      def unread_count
        # Count unread messages for current user
        @conversation.deal_room_messages.where.not(user: @current_user).count
      end
      
      def create_mention_notifications(message)
        mentioned_usernames = message.content.scan(/@(\w+)/).flatten
        
        mentioned_usernames.each do |username|
          user = User.find_by(username: username)
          if user && user != @current_user
            Notification.create!(
              user: user,
              title: "You were mentioned in #{@conversation.title}",
              body: message.content.truncate(100),
              notification_type: 'mention',
              data: {
                deal_room_id: @deal_room.id,
                conversation_id: @conversation.id,
                message_id: message.id
              }
            )
          end
        end
      end
      
      def message_json(message)
        {
          id: message.id,
          content: message.content,
          message_type: message.message_type,
          created_at: message.created_at,
          updated_at: message.updated_at,
          user: {
            id: message.user.id,
            full_name: message.user.full_name,
            avatar: message.user.avatar_url,
            is_current_user: message.user == @current_user
          },
          attachment: message.attachment.attached? ? {
            url: message.attachment_url,
            filename: message.attachment.filename.to_s,
            content_type: message.attachment.content_type,
            size: message.attachment.byte_size
          } : nil,
          can_edit: message.user == @current_user || @current_user.admin?,
          can_delete: message.user == @current_user || @current_user.admin?,
          reactions: [] # Add if you have reaction system
        }
      end
    end
  end
end