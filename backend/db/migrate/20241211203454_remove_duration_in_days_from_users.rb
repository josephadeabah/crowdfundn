class RemoveDurationInDaysFromUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :duration_in_days, :integer
  end
end
