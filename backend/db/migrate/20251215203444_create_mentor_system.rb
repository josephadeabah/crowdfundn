class CreateMentorSystem < ActiveRecord::Migration[7.1]
  def change
    # 1. Create expertise_tags FIRST (no dependencies)
    create_table :expertise_tags do |t|
      t.string :name, null: false
      t.string :category
      t.text :description
      t.timestamps
    end
    
    add_index :expertise_tags, :name, unique: true
    add_index :expertise_tags, :category
    
    # 2. Create mentors (depends on users)
    create_table :mentors do |t|
      t.references :user, null: false, foreign_key: true
      t.string :professional_title, null: false
      t.integer :years_of_experience, null: false
      t.text :bio
      t.decimal :hourly_rate, precision: 10, scale: 2
      t.integer :max_assignments
      t.integer :current_assignments, default: 0
      t.decimal :rating, precision: 3, scale: 2, default: 0
      t.integer :reviews_count, default: 0
      t.string :status, default: 'pending'
      t.string :linkedin_profile
      t.timestamps
    end
    
    add_index :mentors, :status
    add_index :mentors, :rating
    
    # 3. Create mentor_applications (depends on users, kycs, mentors)
    create_table :mentor_applications do |t|
      t.references :user, null: false, foreign_key: true
      t.references :kyc, foreign_key: true
      t.references :mentor, foreign_key: true
      t.string :tracking_id
      t.string :professional_title, null: false
      t.integer :years_of_experience, null: false
      t.text :industry_expertise, array: true, default: []
      t.text :previous_mentoring, null: false
      t.string :linkedin_profile
      t.string :resume_url
      t.text :mentorship_approach, null: false
      t.string :availability, null: false
      t.string :status, default: 'draft'
      t.datetime :submitted_at
      t.datetime :reviewed_at
      t.references :reviewed_by, foreign_key: { to_table: :users }
      t.text :review_notes
      t.timestamps
    end
    
    add_index :mentor_applications, :tracking_id, unique: true
    add_index :mentor_applications, :status
    
    # 4. Create mentor_assignments (depends on campaigns, mentors, users)
    create_table :mentor_assignments do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :mentor, null: false, foreign_key: true
      t.references :entrepreneur, null: false, foreign_key: { to_table: :users }
      t.string :status, default: 'pending'
      t.text :entrepreneur_notes
      t.text :mentor_notes
      t.decimal :mentor_fee, precision: 10, scale: 2
      t.decimal :rating, precision: 3, scale: 2
      t.text :feedback
      t.datetime :started_at
      t.datetime :completed_at
      t.datetime :cancelled_at
      t.text :cancellation_reason
      t.timestamps
    end
    
    add_index :mentor_assignments, :status
    add_index :mentor_assignments, [:campaign_id, :mentor_id], unique: true
    
    # 5. Create mentor_expertise_tags LAST (depends on both mentors and expertise_tags)
    create_table :mentor_expertise_tags do |t|
      t.references :mentor, null: false, foreign_key: true
      t.references :expertise_tag, null: false, foreign_key: true
      t.timestamps
    end
    
    add_index :mentor_expertise_tags, [:mentor_id, :expertise_tag_id], unique: true
  end
end