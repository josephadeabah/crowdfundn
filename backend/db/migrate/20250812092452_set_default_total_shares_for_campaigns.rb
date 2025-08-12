class SetDefaultTotalSharesForCampaigns < ActiveRecord::Migration[6.1]
  def up
    # Update all existing campaigns to set total_shares to 1,000,000
    Campaign.where(total_shares: 0).update_all(total_shares: 1_000_000)
    
    # Also update the column default for future records
    change_column_default :campaigns, :total_shares, from: 0, to: 1_000_000
  end

  def down
    # Revert the change (though you probably don't want to do this in production)
    change_column_default :campaigns, :total_shares, from: 1_000_000, to: 0
  end
end