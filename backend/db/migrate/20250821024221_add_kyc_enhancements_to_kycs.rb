# db/migrate/20250820120000_add_kyc_enhancements_to_kycs.rb
class AddKycEnhancementsToKycs < ActiveRecord::Migration[7.1]
  def change
    # Personal information
    add_column :kycs, :date_of_birth, :date
    add_column :kycs, :nationality, :string
    add_column :kycs, :occupation, :string
    add_column :kycs, :source_of_funds, :string
    add_column :kycs, :risk_level, :integer, default: 0
    
    # Business information (for issuers)
    add_column :kycs, :business_name, :string
    add_column :kycs, :business_registration_number, :string
    add_column :kycs, :business_tax_id, :string
    add_column :kycs, :business_industry, :string
    add_column :kycs, :business_established_date, :date
    
    # Additional fields
    add_column :kycs, :next_review_date, :date
    add_column :kycs, :review_notes, :text
    
    # Indexes
    add_index :kycs, :business_registration_number, unique: true
    add_index :kycs, :business_tax_id, unique: true
  end
end