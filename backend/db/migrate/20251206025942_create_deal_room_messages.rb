class CreateDealRoomMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_messages do |t|
      t.references :deal_room_conversation, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.text :content
      t.string :message_type

      t.timestamps
    end
  end
end
