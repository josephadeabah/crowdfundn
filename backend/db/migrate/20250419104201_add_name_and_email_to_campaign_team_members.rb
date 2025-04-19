class AddNameAndEmailToCampaignTeamMembers < ActiveRecord::Migration[7.1]
  def change
    add_column :campaign_team_members, :name, :string
    add_column :campaign_team_members, :email, :string
  end
end
