class RenameEquityCampaignIdToCampaignIdInCampaignTeamMembers < ActiveRecord::Migration[7.1]
  def change
    rename_column :campaign_team_members, :equity_campaign_id, :campaign_id
  end
end