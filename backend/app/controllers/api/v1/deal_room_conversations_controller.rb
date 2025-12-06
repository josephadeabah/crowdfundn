# app/controllers/api/v1/deal_room_conversations_controller.rb
module Api
  module V1
    class DealRoomConversationsController < ApplicationController
      before_action :authenticate_request
      before_action :set_deal_room_conversation, only: [:show, :update, :destroy]
      
      # GET /api/v1/deal_room_conversations/:id
      def show
        if has_access?
          render json: {
            conversation: @conversation.as_json,
            messages: @conversation.deal_room_messages
                                  .includes(:user)
                                  .order(created_at: :asc)
                                  .map(&:as_json)
          }, status: :ok
        else
          render json: { error: 'Access denied' }, status: :forbidden
        end
      end
      
      # PUT /api/v1/deal_room_conversations/:id
      def update
        if @conversation.user == @current_user || @current_user.admin?
          if @conversation.update(conversation_params)
            render json: {
              message: 'Conversation updated successfully',
              conversation: @conversation.as_json
            }, status: :ok
          else
            render json: { errors: @conversation.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      # DELETE /api/v1/deal_room_conversations/:id
      def destroy
        if @conversation.user == @current_user || @current_user.admin?
          if @conversation.destroy
            render json: { message: 'Conversation deleted successfully' }, status: :ok
          else
            render json: { errors: @conversation.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Unauthorized' }, status: :unauthorized
        end
      end
      
      private
      
      def set_deal_room_conversation
        @conversation = DealRoomConversation.find(params[:id])
      end
      
      def has_access?
        @conversation.deal_room.public? || 
        @conversation.deal_room.members.include?(@current_user) || 
        @current_user.admin?
      end
      
      def conversation_params
        params.permit(:title, :private)
      end
    end
  end
end