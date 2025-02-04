class RemoveCampaignFromBackerRewards < ActiveRecord::Migration[7.1]
  def change
    remove_reference :backer_rewards, :campaign, null: false, foreign_key: true
  end
end
