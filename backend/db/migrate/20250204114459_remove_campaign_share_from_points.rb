class RemoveCampaignShareFromPoints < ActiveRecord::Migration[7.1]
  def change
    remove_reference :points, :campaign_share, foreign_key: true
  end
end
