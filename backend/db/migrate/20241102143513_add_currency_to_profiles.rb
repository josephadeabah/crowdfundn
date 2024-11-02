class AddCurrencyToProfiles < ActiveRecord::Migration[7.1]
  def change
    add_column :profiles, :currency, :string
  end
end
