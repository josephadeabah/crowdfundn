class AddCampaignToPledges < ActiveRecord::Migration[7.1]
  def change
    add_reference :pledges, :campaign, null: false, foreign_key: true
  end
end
