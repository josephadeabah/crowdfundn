class AddCurrentValueToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :current_value, :decimal, default: 0.0
  end
end
