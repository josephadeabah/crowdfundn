class CreateRewards < ActiveRecord::Migration[7.1]
  def change
    create_table :rewards do |t|
      t.string :title
      t.text :description
      t.decimal :amount
      t.string :image
      t.references :campaign, null: false, foreign_key: true

      t.timestamps
    end
  end
end
