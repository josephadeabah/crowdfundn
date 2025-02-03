class AddLevelToBackerRewards < ActiveRecord::Migration[7.1]
  def change
    add_column :backer_rewards, :level, :string
  end
end
