class AddCampaignIdToArchivedCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :archived_campaigns, :campaign_id, :integer
    add_reference :archived_campaigns, :campaign, foreign_key: true
  end
end
