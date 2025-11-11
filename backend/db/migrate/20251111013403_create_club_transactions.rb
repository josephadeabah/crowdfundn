class CreateClubTransactions < ActiveRecord::Migration[7.1]
  def change
    create_table :club_transactions do |t|
      t.references :investment_club, null: false, foreign_key: true
      t.references :club_investment, foreign_key: true
      t.decimal :amount, null: false
      t.string :transaction_type, null: false
      t.string :status, null: false, default: 'pending'
      t.string :reference
      t.text :description
      
      t.timestamps
    end
    
    add_index :club_transactions, :reference
    add_index :club_transactions, :transaction_type
    add_index :club_transactions, :status
  end
end
