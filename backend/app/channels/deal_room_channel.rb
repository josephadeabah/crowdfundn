class DealRoomChannel < ApplicationCable::Channel
  def subscribed
    @deal_room = DealRoom.find_by(id: params[:id])
    
    if @deal_room && (@deal_room.public? || @deal_room.members.include?(current_user) || current_user.admin?)
      stream_for @deal_room
      stream_from "deal_room_#{@deal_room.id}_user_#{current_user.id}"
      
      # Broadcast user joined
      broadcast_user_status('online')
      broadcast_system_message("#{current_user.full_name} joined the deal room")
    else
      reject
    end
  end
  
  def unsubscribed
    if @deal_room
      broadcast_user_status('offline')
      broadcast_system_message("#{current_user.full_name} left the deal room")
    end
  end
  
  def receive(data)
    case data['action']
    when 'send_message'
      send_message(data)
    when 'typing'
      broadcast_typing(data)
    when 'update_message'
      update_message(data)
    when 'delete_message'
      delete_message(data)
    when 'create_conversation'
      create_conversation(data)
    end
  end
  
  def send_message(data)
    conversation = @deal_room.deal_room_conversations.find(data['conversation_id'])
    
    message = conversation.deal_room_messages.create!(
      user: current_user,
      content: data['content'],
      message_type: data['message_type'] || 'text'
    )
    
    if data['attachment_url']
      # Handle file upload (would need additional logic for file handling)
      message.update(message_type: 'file')
    end
    
    # Broadcast to all subscribers
    DealRoomChannel.broadcast_to(
      @deal_room,
      {
        type: 'new_message',
        message: message.as_json,
        conversation_id: conversation.id
      }
    )
  rescue ActiveRecord::RecordNotFound => e
    transmit({ type: 'error', message: 'Conversation not found' })
  rescue => e
    logger.error "Error sending message: #{e.message}"
    transmit({ type: 'error', message: 'Failed to send message' })
  end
  
  def update_message(data)
    message = DealRoomMessage.find(data['message_id'])
    
    if message.user == current_user || current_user.admin?
      if message.update(content: data['content'])
        DealRoomChannel.broadcast_to(
          @deal_room,
          {
            type: 'message_updated',
            message: message.as_json,
            conversation_id: message.deal_room_conversation_id
          }
        )
      end
    else
      transmit({ type: 'error', message: 'Unauthorized' })
    end
  end
  
  def delete_message(data)
    message = DealRoomMessage.find(data['message_id'])
    
    if message.user == current_user || current_user.admin?
      conversation_id = message.deal_room_conversation_id
      message.destroy!
      
      DealRoomChannel.broadcast_to(
        @deal_room,
        {
          type: 'message_deleted',
          message_id: data['message_id'],
          conversation_id: conversation_id
        }
      )
    else
      transmit({ type: 'error', message: 'Unauthorized' })
    end
  end
  
  def create_conversation(data)
    conversation = @deal_room.deal_room_conversations.create!(
      user: current_user,
      title: data['title'],
      private: data['private'] || false
    )
    
    DealRoomChannel.broadcast_to(
      @deal_room,
      {
        type: 'conversation_created',
        conversation: conversation.as_json
      }
    )
  end
  
  def broadcast_typing(data)
    DealRoomChannel.broadcast_to(
      @deal_room,
      {
        type: 'user_typing',
        user_id: current_user.id,
        user_name: current_user.full_name,
        conversation_id: data['conversation_id'],
        timestamp: Time.current
      }
    )
  end
  
  def broadcast_user_status(status)
    DealRoomChannel.broadcast_to(
      @deal_room,
      {
        type: 'user_status',
        user_id: current_user.id,
        user_name: current_user.full_name,
        status: status,
        last_seen: Time.current
      }
    )
  end
  
  def broadcast_system_message(content)
    DealRoomChannel.broadcast_to(
      @deal_room,
      {
        type: 'system_message',
        content: content,
        timestamp: Time.current
      }
    )
  end
end