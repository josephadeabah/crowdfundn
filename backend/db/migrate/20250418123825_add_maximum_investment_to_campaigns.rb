class AddMaximumInvestmentToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :maximum_investment, :decimal
  end
end
