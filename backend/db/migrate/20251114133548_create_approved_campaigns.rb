class CreateApprovedCampaigns < ActiveRecord::Migration[7.1]
  def change
    create_table :approved_campaigns do |t|
      t.references :investment_club, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true
      t.references :club_investment, null: false, foreign_key: true
      
      t.timestamps
    end

    add_index :approved_campaigns, [:investment_club_id, :campaign_id], unique: true
  end
end
