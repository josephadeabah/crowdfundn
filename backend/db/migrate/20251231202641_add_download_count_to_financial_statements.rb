class AddDownloadCountToFinancialStatements < ActiveRecord::Migration[7.1]
  def change
    add_column :financial_statements, :download_count, :integer, default: 0, null: false
    
    # Optional: Add an index if you plan to query by download count frequently
    add_index :financial_statements, :download_count
  end
end