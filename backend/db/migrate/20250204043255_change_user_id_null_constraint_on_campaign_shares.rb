class ChangeUserIdNullConstraintOnCampaignShares < ActiveRecord::Migration[7.1]
  def change
    change_column_null :campaign_shares, :user_id, true
  end
end
