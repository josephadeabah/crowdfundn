# db/migrate/xxx_create_club_investments.rb
class CreateClubInvestments < ActiveRecord::Migration[7.1]
  def change
    create_table :club_investments do |t|
      t.references :investment_club, null: false
      t.references :campaign, null: false
      t.decimal :investment_amount, precision: 15, scale: 2, null: false
      t.decimal :shares_acquired, precision: 20, scale: 4
      t.decimal :percentage_acquired, precision: 10, scale: 4
      t.string :status, default: 'pending' # pending, approved, executed, completed
      t.string :voting_session_id
      t.integer :yes_votes, default: 0
      t.integer :no_votes, default: 0
      t.decimal :approval_rate, precision: 5, scale: 2
      t.boolean :approved, default: false
      
      # For equity campaigns
      t.decimal :equity_percentage, precision: 10, scale: 4
      
      t.timestamps
    end
    
    add_index :club_investments, :voting_session_id
    add_index :club_investments, :status
    add_index :club_investments, [:investment_club_id, :campaign_id], unique: true
  end
end