class CreatePoints < ActiveRecord::Migration[7.1]
  def change
    create_table :points do |t|
      t.references :user, null: false, foreign_key: true
      t.references :donation, null: false, foreign_key: true
      t.integer :amount
      t.string :reason

      t.timestamps
    end
  end
end
