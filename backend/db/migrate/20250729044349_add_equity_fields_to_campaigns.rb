class AddEquityFieldsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :total_shares, :integer, default: 0
    add_column :campaigns, :shares_issued, :integer, default: 0
    add_column :campaigns, :equity_issued, :decimal, precision: 5, scale: 2, default: 0
  end
end