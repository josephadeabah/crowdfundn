class CreateCampaignPartnerships < ActiveRecord::Migration[7.1]
  def change
    create_table :campaign_partnerships do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :partner, null: false, foreign_key: true
      t.string :status
      t.decimal :commission_rate
      t.string :commission_type
      t.datetime :accepted_at
      t.datetime :ended_at
      t.text :notes

      t.timestamps
    end
  end
end
