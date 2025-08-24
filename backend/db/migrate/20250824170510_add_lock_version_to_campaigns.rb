class AddLockVersionToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :lock_version, :integer, default: 0
  end
end
