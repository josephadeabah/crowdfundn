class AddCurrencySymbolAndPhoneCodeToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :currency_symbol, :string
    add_column :users, :phone_code, :string
  end
end
