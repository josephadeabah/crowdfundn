class AddInvestorFieldsToUsers < ActiveRecord::Migration[7.1]
  def change
    add_column :users, :net_worth, :decimal, precision: 15, scale: 2, default: 0
    add_column :users, :annual_income, :decimal, precision: 15, scale: 2, default: 0
    add_column :users, :tax_id, :string
    
    # Make tax_id optional by default (only required for investors)
    change_column_null :users, :tax_id, true
  end
end
