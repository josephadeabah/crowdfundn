class CreateExpertiseTags < ActiveRecord::Migration[7.1]
  def change
    create_table :expertise_tags do |t|
      t.string :name, null: false
      t.string :category
      t.text :description
      
      t.timestamps
    end
    
    add_index :expertise_tags, :name, unique: true
    add_index :expertise_tags, :category
    
    # Seed common tags
    ExpertiseTag::COMMON_TAGS.each do |tag_name|
      ExpertiseTag.find_or_create_by!(name: tag_name)
    end
  end
end