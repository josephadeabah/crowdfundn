class AddTotalEquityInvestedToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :total_equity_invested, :decimal, precision: 15, scale: 2, default: 0.0
  end
end