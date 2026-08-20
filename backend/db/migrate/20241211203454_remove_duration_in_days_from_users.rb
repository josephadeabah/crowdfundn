# db/migrate/20241211203454_remove_duration_in_days_from_users.rb
class RemoveDurationInDaysFromUsers < ActiveRecord::Migration[7.1]
  def change
    # Only remove the column if it exists
    if column_exists?(:users, :duration_in_days)
      remove_column :users, :duration_in_days
    else
      puts "Column duration_in_days does not exist on users table. Skipping removal..."
    end
  end
end