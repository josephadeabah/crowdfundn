class AddDescriptionToCampaignTeamMembers < ActiveRecord::Migration[7.1]
  def change
    add_column :campaign_team_members, :description, :text
  end
end
