# db/migrate/[timestamp]_update_investor_documents_table.rb
class UpdateInvestorDocumentsTable < ActiveRecord::Migration[7.1]
  def change
    change_table :investor_documents do |t|
      # Add campaign reference if not already there
      t.references :campaign, null: false, foreign_key: true unless column_exists?(:investor_documents, :campaign_id)
      
      # Add index for better query performance
      add_index :investor_documents, [:user_id, :campaign_id, :document_type], name: 'index_investor_docs_on_user_campaign_and_type'
    end
  end
end