class AddSeoFieldsToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :seo_title, :string
    add_column :campaigns, :seo_description, :string
  end
end
