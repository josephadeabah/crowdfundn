class AddEquityInvestmentIdToPoints < ActiveRecord::Migration[7.1]
  def change
    # First check if the column exists before adding it
    unless column_exists?(:points, :equity_investment_id)
      add_reference :points, :equity_investment, foreign_key: true, type: :bigint
    end

    # Only add the index if it doesn't exist
    unless index_exists?(:points, :equity_investment_id)
      add_index :points, :equity_investment_id
    end
  end
end