class AddProcessingFeeToEquityInvestments < ActiveRecord::Migration[7.1]
  def change
    add_column :equity_investments, :processing_fee, :decimal, precision: 15, scale: 2, default: 0.0, null: false
  end
end
