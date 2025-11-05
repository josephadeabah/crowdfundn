# db/migrate/xxx_create_investment_club_contributions.rb
class CreateInvestmentClubContributions < ActiveRecord::Migration[7.1]
  def change
    create_table :investment_club_contributions do |t|
      t.references :investment_club, null: false
      t.references :user, null: false
      t.decimal :amount, precision: 15, scale: 2, null: false
      t.string :currency, default: 'USD'
      t.string :status, default: 'pending' # pending, completed, failed
      t.string :transaction_reference
      t.string :payment_method
      
      t.timestamps
    end
    
    add_index :investment_club_contributions, :transaction_reference, unique: true
    add_index :investment_club_contributions, :status
  end
end