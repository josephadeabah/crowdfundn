class AddGrossAndNetAmountToDonations < ActiveRecord::Migration[7.1]
  def change
    add_column :donations, :gross_amount, :decimal, precision: 15, scale: 2, default: 0.0, null: false
    add_column :donations, :net_amount, :decimal, precision: 15, scale: 2, default: 0.0, null: false
  end
end
