class AddMissingIndexesToKycs < ActiveRecord::Migration[7.1]
  def change
    # Check and add indexes for Kycs table
    add_index :kycs, :status unless index_exists?(:kycs, :status)
    add_index :kycs, :kyc_type unless index_exists?(:kycs, :kyc_type)
    add_index :kycs, :created_at unless index_exists?(:kycs, :created_at)
    add_index :kycs, [:status, :kyc_type] unless index_exists?(:kycs, [:status, :kyc_type])
    
    # Check and add indexes for related tables
    add_index :kyc_addresses, :kyc_id unless index_exists?(:kyc_addresses, :kyc_id)
    add_index :kyc_documents, :kyc_id unless index_exists?(:kyc_documents, :kyc_id)
    add_index :kyc_documents, :document_type unless index_exists?(:kyc_documents, :document_type)
  end
end