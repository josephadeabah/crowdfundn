class ChangeEquityInvestmentStatusToString < ActiveRecord::Migration[7.1]
  def change
    change_column :equity_investments, :status, :string, default: 'pending'
  end
end