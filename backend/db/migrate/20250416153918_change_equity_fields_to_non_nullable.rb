class ChangeEquityFieldsToNonNullable < ActiveRecord::Migration[7.1]
  def change
    # First update all NULL values
    execute <<-SQL
      UPDATE campaigns 
      SET valuation = COALESCE(valuation, 0), 
          equity_offered = COALESCE(equity_offered, 0), 
          minimum_investment = COALESCE(minimum_investment, 0) 
      WHERE valuation IS NULL OR 
            equity_offered IS NULL OR 
            minimum_investment IS NULL
    SQL

    # Then change the column definitions
    change_column :campaigns, :valuation, :decimal, precision: 15, scale: 2, null: false, default: 0
    change_column :campaigns, :equity_offered, :decimal, precision: 5, scale: 2, null: false, default: 0
    change_column :campaigns, :minimum_investment, :decimal, precision: 15, scale: 2, null: false, default: 0
  end
end