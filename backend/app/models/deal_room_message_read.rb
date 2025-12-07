class DealRoomMessageRead < ApplicationRecord
  belongs_to :deal_room_message
  belongs_to :user
  
  validates :user_id, uniqueness: { scope: :deal_room_message_id }
  
  after_create :update_conversation_unread_count
  
  private
  
  def update_conversation_unread_count
    # Update conversation unread count cache
    conversation = deal_room_message.deal_room_conversation
    # Implementation depends on your caching strategy
  end
end