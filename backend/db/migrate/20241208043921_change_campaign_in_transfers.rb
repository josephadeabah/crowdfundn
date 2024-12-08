class ChangeCampaignInTransfers < ActiveRecord::Migration[7.1]
  def change
    change_column_null :transfers, :campaign_id, true
  end
end
