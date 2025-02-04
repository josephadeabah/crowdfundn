class AddCampaignShareToPoints < ActiveRecord::Migration[7.1]
  def change
    add_reference :points, :campaign_share, null: true, foreign_key: true
  end
end
