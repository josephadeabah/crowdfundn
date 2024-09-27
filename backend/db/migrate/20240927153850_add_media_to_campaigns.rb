class AddMediaToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :media, :string
  end
end
