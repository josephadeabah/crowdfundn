class RemovePlatformAndPointsAwardedFromCampaignShares < ActiveRecord::Migration[7.1]
  def change
    remove_column :campaign_shares, :platform, :string
    remove_column :campaign_shares, :points_awarded, :integer
  end
end
