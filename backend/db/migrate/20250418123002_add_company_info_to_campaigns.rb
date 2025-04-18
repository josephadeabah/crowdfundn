class AddCompanyInfoToCampaigns < ActiveRecord::Migration[7.1]
  def change
    add_column :campaigns, :company_name, :string
    add_column :campaigns, :company_description, :text
    add_column :campaigns, :company_headquarters, :string
    add_column :campaigns, :company_website, :string
    add_column :campaigns, :contract_term, :string
  end
end
