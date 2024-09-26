class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true
      t.string :name
      t.text :description
      t.decimal :funding_goal
      t.decimal :amount_raised
      t.date :end_date
      t.string :category
      t.string :location
      t.string :avatar
      t.string :status

      t.timestamps
    end
  end
end
