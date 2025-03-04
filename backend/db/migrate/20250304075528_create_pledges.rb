class CreatePledges < ActiveRecord::Migration[7.1]
  def change
    create_table :pledges do |t|
      t.references :donation, null: false, foreign_key: true
      t.references :reward, null: false, foreign_key: true
      t.decimal :amount, null: false, default: 0
      t.string :status, null: false, default: 'pending'
      t.string :shipping_status, null: false, default: 'not_shipped'

      t.timestamps
    end
  end
end
