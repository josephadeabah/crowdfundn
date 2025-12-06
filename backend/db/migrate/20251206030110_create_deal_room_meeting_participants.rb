class CreateDealRoomMeetingParticipants < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_meeting_participants do |t|
      t.references :deal_room_meeting, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role
      t.string :status

      t.timestamps
    end
  end
end
