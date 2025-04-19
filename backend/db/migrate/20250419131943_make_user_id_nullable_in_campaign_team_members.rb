class MakeUserIdNullableInCampaignTeamMembers < ActiveRecord::Migration[7.1]
  def change
    change_column_null :campaign_team_members, :user_id, true
  end
end
