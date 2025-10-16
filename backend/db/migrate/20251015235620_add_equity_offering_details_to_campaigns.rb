class AddEquityOfferingDetailsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :minimum_target, :decimal
    add_column :campaigns, :price_per_share, :decimal
    add_column :campaigns, :min_shares, :integer
    add_column :campaigns, :max_shares, :integer
    add_column :campaigns, :shares_offered, :integer
    add_column :campaigns, :stock_type, :string
    add_column :campaigns, :funding_round, :string
    add_column :campaigns, :sec_filing_url, :string
    add_column :campaigns, :offering_circular, :string
    add_column :campaigns, :offering_memorandum, :string
  end
end
