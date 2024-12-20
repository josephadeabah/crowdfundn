class CreateEventProcessed < ActiveRecord::Migration[7.1]
  def change
    create_table :event_processed do |t|
      t.string :event_id, null: false

      t.timestamps
    end
    add_index :event_processed, :event_id, unique: true
  end
end
