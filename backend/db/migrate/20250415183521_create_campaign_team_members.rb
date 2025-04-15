class CreateCampaignTeamMembers < ActiveRecord::Migration[7.1]
  def change
    create_table :campaign_team_members do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role
      t.decimal :equity_percentage
      t.string :title

      t.timestamps
    end
  end
end
