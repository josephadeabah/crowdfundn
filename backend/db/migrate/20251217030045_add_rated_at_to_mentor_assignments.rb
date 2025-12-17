class AddRatedAtToMentorAssignments < ActiveRecord::Migration[7.1]
  def change
    add_column :mentor_assignments, :rated_at, :datetime
    add_index :mentor_assignments, :rated_at
  end
end
