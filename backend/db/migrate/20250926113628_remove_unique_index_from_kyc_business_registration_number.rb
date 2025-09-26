class RemoveUniqueIndexFromKycBusinessRegistrationNumber < ActiveRecord::Migration[7.1]
  def up
    # Remove unique indexes for business fields
    remove_index :kycs, :business_name if index_exists?(:kycs, :business_name)
    remove_index :kycs, :business_registration_number if index_exists?(:kycs, :business_registration_number)
    remove_index :kycs, :business_tax_id if index_exists?(:kycs, :business_tax_id)
    
    # Add regular indexes for performance (optional)
    add_index :kycs, :business_name unless index_exists?(:kycs, :business_name)
    add_index :kycs, :business_registration_number unless index_exists?(:kycs, :business_registration_number)
    add_index :kycs, :business_tax_id unless index_exists?(:kycs, :business_tax_id)
  end

  def down
    # Remove regular indexes
    remove_index :kycs, :business_name if index_exists?(:kycs, :business_name)
    remove_index :kycs, :business_registration_number if index_exists?(:kycs, :business_registration_number)
    remove_index :kycs, :business_tax_id if index_exists?(:kycs, :business_tax_id)
    
    # Recreate unique indexes
    add_index :kycs, :business_name, unique: true
    add_index :kycs, :business_registration_number, unique: true
    add_index :kycs, :business_tax_id, unique: true
  end
end
