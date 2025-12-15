class CreateMentorAssignments < ActiveRecord::Migration[7.1]
  def change
    create_table :mentor_assignments do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :mentor, null: false, foreign_key: true
      t.references :entrepreneur, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'pending'
      t.decimal :mentor_fee, precision: 10, scale: 2
      t.text :entrepreneur_notes
      t.text :mentor_notes
      t.decimal :rating, precision: 3, scale: 2
      t.text :feedback
      t.datetime :started_at
      t.datetime :completed_at
      t.datetime :cancelled_at
      t.string :cancellation_reason
      
      t.timestamps
    end
    
    add_index :mentor_assignments, :status
    add_index :mentor_assignments, [:campaign_id, :mentor_id], unique: true
  end
end