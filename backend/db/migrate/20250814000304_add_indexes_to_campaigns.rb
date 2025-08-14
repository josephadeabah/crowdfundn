class AddIndexesToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_index :campaigns, :category
    add_index :campaigns, :status
    add_index :campaigns, [:category, :status]
  end
end