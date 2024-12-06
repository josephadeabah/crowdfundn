class RenameTypeColumnInSubaccounts < ActiveRecord::Migration[7.1]
  def change
    rename_column :subaccounts, :type, :subaccount_type
  end
end
