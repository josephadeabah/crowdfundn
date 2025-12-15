class CreateMentors < ActiveRecord::Migration[7.1]
  def change
    create_table :mentors do |t|
      t.references :user, null: false, foreign_key: true
      t.string :professional_title
      t.integer :years_of_experience
      t.text :bio
      t.string :linkedin_profile
      t.decimal :hourly_rate, precision: 10, scale: 2
      t.decimal :rating, precision: 3, scale: 2, default: 0
      t.integer :reviews_count, default: 0
      t.integer :current_assignments, default: 0
      t.integer :max_assignments
      t.string :status, default: 'pending'
      t.json :metadata
      
      t.timestamps
    end
    
    add_index :mentors, :status
    add_index :mentors, :rating
  end
end