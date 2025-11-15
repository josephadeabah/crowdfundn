class CreateClubTransfers < ActiveRecord::Migration[7.1]
  def change
    create_table :club_transfers do |t|
      t.references :investment_club, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      
      # Transfer details
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.string :currency, null: false, default: 'GHS'
      t.string :status, null: false, default: 'pending'
      t.text :reason
      t.string :failure_reason
      
      # Paystack integration
      t.string :transfer_code
      t.string :reference
      t.string :recipient_code
      
      # Bank account details (cached from Paystack response)
      t.string :account_name
      t.string :account_number
      t.string :bank_name
      
      # Timestamps
      t.datetime :completed_at
      t.datetime :reversed_at
      
      t.timestamps
    end

    # Add indexes for better query performance
    add_index :club_transfers, :transfer_code, unique: true
    add_index :club_transfers, :reference, unique: true
    add_index :club_transfers, :status
    add_index :club_transfers, :created_at
    add_index :club_transfers, [:investment_club_id, :created_at]
  end
end
