class CreateTransfers < ActiveRecord::Migration[7.1]
  def change
    create_table :transfers do |t|
      t.string :transfer_code, null: false
      t.string :recipient_code, null: false
      t.integer :amount, null: false
      t.string :status, default: 'pending'
      t.string :failure_reason
      t.datetime :completed_at
      t.datetime :reversed_at
      t.references :user, null: false, foreign_key: true
      t.references :campaign, null: false, foreign_key: true

      t.timestamps
    end
    
    # Add unique index for transfer_code
    add_index :transfers, :transfer_code, unique: true
  end
end
