class AddEquityStatusToEquityCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :equity_status, :integer
  end
end
