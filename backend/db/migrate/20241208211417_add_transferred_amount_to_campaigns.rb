class AddTransferredAmountToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :transferred_amount, :decimal, default: 0, null: false
  end
end
