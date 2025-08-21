# db/migrate/20250820120002_create_kyc_addresses.rb
class CreateKycAddresses < ActiveRecord::Migration[7.1]
  def change
    create_table :kyc_addresses do |t|
      t.belongs_to :kyc, null: false, foreign_key: true
      t.string :address_type, null: false # residential, mailing, business
      t.string :street
      t.string :city
      t.string :state
      t.string :postal_code
      t.string :country
      t.boolean :is_primary, default: false
      
      t.timestamps
    end
    
    add_index :kyc_addresses, [:kyc_id, :address_type], unique: true
  end
end