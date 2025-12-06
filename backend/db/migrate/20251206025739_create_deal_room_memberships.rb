class CreateDealRoomMemberships < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_memberships do |t|
      t.references :deal_room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role
      t.string :status

      t.timestamps
    end
  end
end
