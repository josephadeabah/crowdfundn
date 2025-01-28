class AddRewardToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :reward_id, :integer
  end
end
