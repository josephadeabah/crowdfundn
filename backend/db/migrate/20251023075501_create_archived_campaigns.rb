class CreateArchivedCampaigns < ActiveRecord::Migration[7.1]
  def change
    create_table :archived_campaigns do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.datetime :archived_at
      t.text :reason

      t.timestamps
    end

    add_index :archived_campaigns, [:user_id, :campaign_id], unique: true
    add_index :archived_campaigns, :archived_at
  end
end
