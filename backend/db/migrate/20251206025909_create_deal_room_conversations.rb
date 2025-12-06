class CreateDealRoomConversations < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_conversations do |t|
      t.references :deal_room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.boolean :private

      t.timestamps
    end
  end
end
