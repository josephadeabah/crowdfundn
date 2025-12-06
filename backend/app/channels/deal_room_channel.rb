# app/channels/deal_room_channel.rb
class DealRoomChannel < ApplicationCable::Channel
  def subscribed
    @deal_room = DealRoom.find(params[:id])
    
    if @deal_room.public? || @deal_room.members.include?(current_user) || current_user.admin?
      stream_for @deal_room
      stream_from "deal_room_#{params[:id]}_user_#{current_user.id}"
      
      broadcast_user_status('online')
    else
      reject
    end
  end
  
  def unsubscribed
    broadcast_user_status('offline') if @deal_room
  end
  
  def receive(data)
    case data['action']
    when 'send_message'
      send_message(data)
    when 'typing'
      broadcast_typing(data)
    when 'update_document'
      update_document(data)
    when 'meeting_update'
      broadcast_meeting_update(data)
    end
  end
  
  def send_message(data)
    conversation = @deal_room.deal_room_conversations.find(data['conversation_id'])
    message = conversation.deal_room_messages.create!(
      user: current_user,
      content: data['content'],
      message_type: 'text'
    )
  rescue ActiveRecord::RecordNotFound => e
    transmit({ type: 'error', message: 'Conversation not found' })
  rescue => e
    transmit({ type: 'error', message: e.message })
  end
  
  def broadcast_typing(data)
    ActionCable.server.broadcast(
      "deal_room_#{@deal_room.id}",
      {
        type: 'user_typing',
        user_id: current_user.id,
        user_name: current_user.full_name,
        conversation_id: data['conversation_id']
      }
    )
  end
  
  def broadcast_user_status(status)
    ActionCable.server.broadcast(
      "deal_room_#{@deal_room.id}",
      {
        type: 'user_status',
        user_id: current_user.id,
        user_name: current_user.full_name,
        status: status
      }
    )
  end
  
  def broadcast_meeting_update(data)
    ActionCable.server.broadcast(
      "deal_room_#{@deal_room.id}",
      {
        type: 'meeting_update',
        meeting_id: data['meeting_id'],
        action: data['meeting_action'],
        user_id: current_user.id
      }
    )
  end
  
  private
  
  def update_document(data)
    document = @deal_room.deal_room_documents.find(data['document_id'])
    
    if document.user == current_user || current_user.admin?
      document.update(data['updates'])
      
      ActionCable.server.broadcast(
        "deal_room_#{@deal_room.id}",
        {
          type: 'document_updated',
          document_id: document.id,
          updates: data['updates']
        }
      )
    end
  end
end