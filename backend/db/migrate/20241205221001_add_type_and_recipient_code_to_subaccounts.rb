class AddTypeAndRecipientCodeToSubaccounts < ActiveRecord::Migration[7.1]
  def change
    add_column :subaccounts, :type, :string
    add_column :subaccounts, :recipient_code, :string
  end
end
