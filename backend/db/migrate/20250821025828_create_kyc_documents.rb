# db/migrate/20250820120001_create_kyc_documents.rb
class CreateKycDocuments < ActiveRecord::Migration[7.1]
  def change
    create_table :kyc_documents do |t|
      t.belongs_to :kyc, null: false, foreign_key: true
      t.string :document_type, null: false
      t.string :file_name
      t.string :verification_status, default: 'pending'
      t.text :rejection_reason
      t.datetime :verified_at
      t.bigint :verified_by_id
      
      t.timestamps
    end
    
    add_index :kyc_documents, [:kyc_id, :document_type], unique: true
  end
end