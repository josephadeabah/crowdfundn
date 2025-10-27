class CreateReports < ActiveRecord::Migration[7.1]
  def change
    create_table :reports do |t|
      t.integer :report_type, null: false
      t.text :description, null: false
      t.integer :status, default: 0
      t.integer :priority, default: 0
      
      # Polymorphic reference - can report either a campaign or a user
      t.references :campaign, foreign_key: true, null: true
      t.references :reported_user, foreign_key: { to_table: :users }, null: true
      
      t.references :reporter, null: false, foreign_key: { to_table: :users }
      t.references :assigned_admin, foreign_key: { to_table: :users }, null: true
      
      # Resolution fields
      t.text :action_taken
      t.text :resolution_notes
      t.datetime :resolved_at
      
      # Additional evidence
      t.json :evidence_links
      t.string :contact_email

      t.timestamps
    end

    add_index :reports, :report_type
    add_index :reports, :status
    add_index :reports, :priority
    add_index :reports, :created_at
    add_index :reports, [:campaign_id, :status]
    add_index :reports, [:reported_user_id, :status]
  end
end