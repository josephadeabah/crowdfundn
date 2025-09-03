class FixEquityCampaignConsistency < ActiveRecord::Migration[7.1]
  def up
    EquityCampaign.find_each do |campaign|
      # Recalculate shares available without double-counting founder equity
      total_equity_shares = (campaign.equity_offered.to_f / 100) * campaign.total_shares.to_f
      available_shares = total_equity_shares - campaign.shares_issued
      
      campaign.update_column(:shares_available, available_shares.round(4))
    end
  end

  def down
    # This migration fixes data consistency, so rolling back isn't straightforward
    # You might want to leave this empty or implement a backup strategy
  end
end