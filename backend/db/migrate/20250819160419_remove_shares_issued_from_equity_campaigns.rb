# db/migrate/20240101_remove_shares_issued_from_equity_campaigns.rb
class RemoveSharesIssuedFromEquityCampaigns < ActiveRecord::Migration[7.1]
  def change
    remove_column :campaigns, :shares_issued, :decimal
  end
end