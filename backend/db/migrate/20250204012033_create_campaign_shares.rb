class CreateCampaignShares < ActiveRecord::Migration[7.1]
  def change
    create_table :campaign_shares do |t|
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.string :platform
      t.integer :points_awarded

      t.timestamps
    end
  end
end
