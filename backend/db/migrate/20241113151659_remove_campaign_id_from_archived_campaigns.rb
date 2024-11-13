class RemoveCampaignIdFromArchivedCampaigns < ActiveRecord::Migration[7.1]
  def change
    remove_column :archived_campaigns, :campaign_id, :integer
  end
end
