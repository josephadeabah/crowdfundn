class AddUpgradeFieldsToKycs < ActiveRecord::Migration[7.1]
  def change
    add_column :kycs, :superseded_at, :datetime
    add_column :kycs, :superseded_by_type, :string
    add_column :kycs, :upgraded_from_type, :string
    add_column :kycs, :is_upgrade, :boolean, default: false
  end
end