class AddSubaccountIdToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :subaccount_id, :string
    add_index :users, :subaccount_id
  end
end
