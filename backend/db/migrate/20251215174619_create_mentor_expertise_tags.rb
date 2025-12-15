class CreateMentorExpertiseTags < ActiveRecord::Migration[7.1]
  def change
    create_table :mentor_expertise_tags do |t|
      t.references :mentor, null: false, foreign_key: true
      t.references :expertise_tag, null: false, foreign_key: true
      
      t.timestamps
    end
    
    add_index :mentor_expertise_tags, [:mentor_id, :expertise_tag_id], unique: true
  end
end