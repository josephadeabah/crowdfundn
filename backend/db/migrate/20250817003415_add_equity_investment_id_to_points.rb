class AddEquityInvestmentIdToPoints < ActiveRecord::Migration[7.1]
  def change
    add_reference :points, :equity_investment, foreign_key: true, type: :bigint
    add_index :points, :equity_investment_id
  end
end