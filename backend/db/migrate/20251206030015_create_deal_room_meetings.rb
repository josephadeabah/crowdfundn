class CreateDealRoomMeetings < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_meetings do |t|
      t.references :deal_room, null: false, foreign_key: true
      t.references :organizer, null: false, foreign_key: { to_table: :users }  # Changed this line
      t.string :title
      t.text :description
      t.string :meeting_type
      t.string :status
      t.datetime :start_time
      t.datetime :end_time
      t.string :meeting_link
      t.text :notes

      t.timestamps
    end
  end
end