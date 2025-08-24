class AddSharesAvailableToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :shares_available, :decimal, precision: 20, scale: 4, default: 0.0
    
    # For existing EquityCampaign records, calculate initial shares_available
    reversible do |dir|
      dir.up do
        execute <<-SQL
          UPDATE campaigns 
          SET shares_available = (
            (equity_offered::decimal / 100) * total_shares::decimal - 
            COALESCE((
              SELECT SUM(shares) 
              FROM equity_investments 
              WHERE equity_investments.campaign_id = campaigns.id 
              AND equity_investments.status = 'successful'
            ), 0)
          )
          WHERE type = 'EquityCampaign';
        SQL
      end
    end
  end
end