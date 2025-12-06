# db/migrate/xxxxxxxxxxxxxx_add_indexes_to_deal_room_tables.rb
class AddIndexesToDealRoomTables < ActiveRecord::Migration[7.1]
  def change
    # Add unique index for deal_room_memberships
    add_index :deal_room_memberships, [:deal_room_id, :user_id], unique: true
    
    # Add indexes for better query performance
    add_index :deal_rooms, :room_type
    add_index :deal_rooms, :status
    
    add_index :deal_room_memberships, :role
    add_index :deal_room_memberships, :status
    
    add_index :deal_room_documents, :document_type
    
    add_index :deal_room_conversations, :private
    
    add_index :deal_room_messages, :message_type
    add_index :deal_room_messages, :created_at
    
    add_index :deal_room_meetings, :meeting_type
    add_index :deal_room_meetings, :status
    add_index :deal_room_meetings, :start_time
    
    add_index :deal_room_meeting_participants, [:deal_room_meeting_id, :user_id], 
              unique: true, name: 'index_meeting_participants_on_meeting_and_user'
    add_index :deal_room_meeting_participants, :role
    add_index :deal_room_meeting_participants, :status
  end
end