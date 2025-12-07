class CreateDealRoomMessageReads < ActiveRecord::Migration[7.0]
  def change
    create_table :deal_room_message_reads do |t|
      t.references :deal_room_message, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.datetime :read_at

      t.timestamps
    end

    add_index :deal_room_message_reads, [:deal_room_message_id, :user_id], unique: true, name: 'index_message_reads_on_message_and_user'
  end
end