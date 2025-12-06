class CreateDealRoomDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :deal_room_documents do |t|
      t.references :deal_room, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :title
      t.string :document_type
      t.text :description

      t.timestamps
    end
  end
end
