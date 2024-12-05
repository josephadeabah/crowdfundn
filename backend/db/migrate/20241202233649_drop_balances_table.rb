class DropBalancesTable < ActiveRecord::Migration[7.1]
  def change
    drop_table :balances do |t|
      t.decimal :amount
      t.string :description
      t.string :status

      t.timestamps
    end
  end
end
