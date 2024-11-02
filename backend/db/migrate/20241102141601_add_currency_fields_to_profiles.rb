class AddCurrencyFieldsToProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :currency, :string
    add_column :profiles, :currency_code, :string
    add_column :profiles, :currency_symbol, :string
  end
end
