class AddReferenceToSubaccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :subaccounts, :reference, :string, null: true
  end
end
