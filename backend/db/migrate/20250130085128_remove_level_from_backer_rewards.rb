class RemoveLevelFromBackerRewards < ActiveRecord::Migration[7.1]
  def change
    remove_column :backer_rewards, :level, :string
  end
end
