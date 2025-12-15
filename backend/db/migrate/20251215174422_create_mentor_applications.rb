class CreateMentorApplications < ActiveRecord::Migration[7.1]
  def change
    create_table :mentor_applications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :mentor, foreign_key: true
      t.string :tracking_id
      t.string :professional_title
      t.integer :years_of_experience
      t.json :industry_expertise
      t.string :previous_mentoring
      t.string :linkedin_profile
      t.string :resume_url
      t.text :mentorship_approach
      t.string :availability
      t.string :status, default: 'draft'
      t.text :review_notes
      t.datetime :submitted_at
      t.datetime :reviewed_at
      t.references :reviewed_by, foreign_key: { to_table: :users }
      
      t.timestamps
    end
    
    add_index :mentor_applications, :tracking_id, unique: true
    add_index :mentor_applications, :status
  end
end