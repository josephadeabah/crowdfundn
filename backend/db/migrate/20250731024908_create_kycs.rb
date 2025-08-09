class CreateKycs < ActiveRecord::Migration[7.1]
  def change
    create_table :kycs do |t|
      t.references :user, null: false, foreign_key: true
      t.references :verified_by, foreign_key: { to_table: :users }
      
      t.string :reference, index: { unique: true }
      t.string :kyc_type, null: false, default: 'investor'
      t.string :status, null: false, default: 'pending'
      t.string :verification_type, null: false
      t.string :id_number, null: false
      t.date :id_expiry_date, null: false
      t.text :rejection_reason
      t.datetime :verified_at
      t.jsonb :signature_data # Stores the raw signature points
      
      t.timestamps
    end

    add_index :kycs, [:user_id, :status]
    add_index :kycs, :id_number, unique: true
  end
end