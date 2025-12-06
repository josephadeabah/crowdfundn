class CreateDealRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_rooms do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.string :room_type
      t.string :status

      t.timestamps
    end
  end
end
