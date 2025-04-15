class AddStiAndEquityFieldsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    # Add STI type column (defaults to `Campaign` for existing records)
    add_column :campaigns, :type, :string, default: "Campaign"
    add_index :campaigns, :type

    # Add nullable equity-specific fields
    add_column :campaigns, :valuation, :decimal, precision: 15, scale: 2, null: true
    add_column :campaigns, :equity_offered, :decimal, precision: 5, scale: 2, null: true
    add_column :campaigns, :minimum_investment, :decimal, precision: 15, scale: 2, null: true
  end
end
