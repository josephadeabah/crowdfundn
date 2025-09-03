class AddConditionalIndexesToEquityInvestments < ActiveRecord::Migration[7.1]
  def up
    # Check if first index exists before creating
    unless index_exists?(:equity_investments, [:campaign_id, :status], 
                        name: 'index_equity_investments_on_campaign_and_successful',
                        where: "status = 'successful'")
      add_index :equity_investments, [:campaign_id, :status], 
                where: "status = 'successful'",
                name: 'index_equity_investments_on_campaign_and_successful'
    end

    # Check if second index exists before creating
    unless index_exists?(:equity_investments, [:campaign_id, :id], 
                        where: "status = 'successful'")
      add_index :equity_investments, [:campaign_id, :id], 
                where: "status = 'successful'"
    end
  end

  def down
    # Remove indexes if they exist
    if index_exists?(:equity_investments, [:campaign_id, :status], 
                    name: 'index_equity_investments_on_campaign_and_successful')
      remove_index :equity_investments, 
                  name: 'index_equity_investments_on_campaign_and_successful'
    end

    if index_exists?(:equity_investments, [:campaign_id, :id], 
                    where: "status = 'successful'")
      remove_index :equity_investments, [:campaign_id, :id]
    end
  end
end