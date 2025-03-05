class RenameFundraiserIdToUserIdInPledges < ActiveRecord::Migration[7.1]
  def change
    rename_column :pledges, :fundraiser_id, :user_id

    # Make user_id optional (nullable)
    change_column_null :pledges, :user_id, true
  end
end
