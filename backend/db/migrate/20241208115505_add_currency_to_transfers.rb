class AddCurrencyToTransfers < ActiveRecord::Migration[7.1]
  def change
    add_column :transfers, :currency, :string
  end
end
