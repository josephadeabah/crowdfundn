class CreateUpdates < ActiveRecord::Migration[7.1]
  def change
    create_table :updates do |t|
      t.text :content
      t.references :campaign, null: false, foreign_key: true

      t.timestamps
    end
  end
end
