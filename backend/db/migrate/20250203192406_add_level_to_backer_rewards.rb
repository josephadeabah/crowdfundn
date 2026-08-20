# db/migrate/20250203192406_add_level_to_backer_rewards.rb
class AddLevelToBackerRewards < ActiveRecord::Migration[7.1]
  def change
    # Only add the column if it doesn't already exist
    unless column_exists?(:backer_rewards, :level)
      add_column :backer_rewards, :level, :string
    else
      puts "Column 'level' already exists on backer_rewards table. Skipping..."
    end
  end
end