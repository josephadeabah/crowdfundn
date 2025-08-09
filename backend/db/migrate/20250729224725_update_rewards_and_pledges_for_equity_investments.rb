class UpdateRewardsAndPledgesForEquityInvestments < ActiveRecord::Migration[7.0]
  def change
    # Make campaign polymorphic in rewards
    add_column :rewards, :campaign_type, :string
    rename_column :rewards, :campaign_id, :campaign_id_old
    add_column :rewards, :campaign_id, :bigint
    Reward.update_all("campaign_id = campaign_id_old, campaign_type = 'Campaign'")
    remove_column :rewards, :campaign_id_old

    # Add equity_investment_id to pledges and make campaign polymorphic
    add_column :pledges, :equity_investment_id, :bigint
    add_index :pledges, :equity_investment_id
    add_foreign_key :pledges, :equity_investments
    
    add_column :pledges, :campaign_type, :string
    rename_column :pledges, :campaign_id, :campaign_id_old
    add_column :pledges, :campaign_id, :bigint
    Pledge.update_all("campaign_id = campaign_id_old, campaign_type = 'Campaign'")
    remove_column :pledges, :campaign_id_old
  end
end