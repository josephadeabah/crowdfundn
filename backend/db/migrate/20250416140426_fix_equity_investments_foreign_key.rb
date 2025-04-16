class FixEquityInvestmentsForeignKey < ActiveRecord::Migration[7.1]
  def change
    # Remove the incorrect foreign key if it exists
    if column_exists?(:equity_investments, :equity_campaign_id)
      remove_column :equity_investments, :equity_campaign_id
    end

    # Add the correct foreign key to campaigns table
    unless column_exists?(:equity_investments, :campaign_id)
      add_reference :equity_investments, :campaign, foreign_key: true
    end
  end
end
