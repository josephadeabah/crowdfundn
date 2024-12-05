class AddPaymentMethodFieldsToSubaccounts < ActiveRecord::Migration[7.1]
  def change
    # Add the fields from payment_methods to subaccounts
    add_column :subaccounts, :authorization_code, :string
    add_column :subaccounts, :card_type, :string
    add_column :subaccounts, :last4, :string
    add_column :subaccounts, :exp_month, :string
    add_column :subaccounts, :exp_year, :string
    add_column :subaccounts, :bank, :string
    add_column :subaccounts, :brand, :string
    add_column :subaccounts, :reusable, :boolean

    # Remove the payment_methods table after moving the data
    drop_table :payment_methods, if_exists: true
  end
end
