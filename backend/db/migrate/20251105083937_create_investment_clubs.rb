# db/migrate/xxx_create_investment_clubs.rb
class CreateInvestmentClubs < ActiveRecord::Migration[7.1]
  def change
    create_table :investment_clubs do |t|
      t.string :name, null: false
      t.text :mission
      t.decimal :minimum_monthly_contribution, precision: 15, scale: 2, default: 0
      t.string :investment_focus
      t.integer :max_members
      t.string :club_type, default: 'private' # private, public, verified
      t.string :status, default: 'active' # active, inactive, suspended
      t.references :creator, foreign_key: { to_table: :users }, null: false
      t.string :slug, null: false
      
      # Financial tracking
      t.decimal :total_contributions, precision: 15, scale: 2, default: 0
      t.decimal :total_invested, precision: 15, scale: 2, default: 0
      t.decimal :current_balance, precision: 15, scale: 2, default: 0
      
      t.timestamps
    end
    
    add_index :investment_clubs, :slug, unique: true
    add_index :investment_clubs, :status
  end
end